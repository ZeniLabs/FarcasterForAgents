import { readFileSync, writeFileSync } from 'fs';

const BASE_URL = 'https://news.clanker.ai';

/**
 * Crosspost Clanker News headlines to Farcaster via Neynar.
 *
 * REQUIRES PAID NEYNAR PLAN — managed signers are not available on free tier.
 * See: https://neynar.com/#pricing
 *
 * Env vars:
 *   NEYNAR_API_KEY     — Neynar API key (required)
 *   NEYNAR_SIGNER_UUID — Managed signer UUID for posting (required, paid plan)
 *   CN_MAX_CROSSPOST   — Max posts to crosspost per run (default: 3)
 *   CN_CHANNEL_ID      — Farcaster channel to post in (optional)
 *   CN_STATE_FILE      — Path to state file tracking crossposted IDs
 */

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID;
const MAX_CROSSPOST = Number(process.env.CN_MAX_CROSSPOST || '3');
const CHANNEL_ID = process.env.CN_CHANNEL_ID;
const STATE_FILE = process.env.CN_STATE_FILE || new URL('.crosspost-state.json', import.meta.url).pathname;

if (!NEYNAR_API_KEY) {
  console.error('NEYNAR_API_KEY required. Get one at https://neynar.com');
  process.exit(1);
}
if (!NEYNAR_SIGNER_UUID) {
  console.error('NEYNAR_SIGNER_UUID required (paid Neynar plan). See https://docs.neynar.com/docs/write-to-farcaster-with-neynar-managed-signers');
  process.exit(1);
}

function loadState(): Set<string> {
  try {
    const data = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    return new Set(data.posted || []);
  } catch {
    return new Set();
  }
}

function saveState(posted: Set<string>) {
  const ids = [...posted].slice(-500);
  writeFileSync(STATE_FILE, JSON.stringify({ posted: ids, updated: new Date().toISOString() }));
}

async function castToFarcaster(text: string, embedUrl?: string) {
  const body: any = {
    signer_uuid: NEYNAR_SIGNER_UUID,
    text,
  };
  if (embedUrl) body.embeds = [{ url: embedUrl }];
  if (CHANNEL_ID) body.channel_id = CHANNEL_ID;

  const response = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': NEYNAR_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Neynar ${response.status}: ${err}`);
  }
  return response.json();
}

async function main() {
  const feedResponse = await fetch(`${BASE_URL}/?p=1`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!feedResponse.ok) {
    console.error('CN feed error:', feedResponse.status, await feedResponse.text());
    return;
  }

  const feedData = await feedResponse.json();
  if (!feedData.posts || feedData.posts.length === 0) {
    console.log('No posts on CN feed.');
    return;
  }

  const posted = loadState();
  let crossposted = 0;
  let attempts = 0;

  for (const post of feedData.posts) {
    if (crossposted >= MAX_CROSSPOST) break;
    if (attempts >= MAX_CROSSPOST * 2) break; // stop after too many failures
    if (posted.has(post.id)) continue;

    const agentName = post.agent?.name || post.agent?.id?.split(':').pop() || 'unknown';
    const cnLink = `${BASE_URL}/post/${post.id}`;
    const text = `${post.title}\n\nby ${agentName} on Clanker News`;

    attempts++;
    try {
      console.log(`Crossposting: "${post.title.substring(0, 60)}..."`);
      const result = await castToFarcaster(text, post.url || cnLink);
      posted.add(post.id);
      crossposted++;
      console.log(`  ✅ Cast posted`);
    } catch (err: any) {
      console.error(`  ❌ Failed: ${err.message}`);
      if (err.message.includes('429')) {
        console.error('  Rate limited — stopping.');
        break;
      }
    }
  }

  saveState(posted);
  console.log(`\nCrossposted ${crossposted} posts. ${posted.size} total tracked.`);
}

main().catch(console.error);
