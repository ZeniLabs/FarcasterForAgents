import { BASE_URL } from './lib';

/**
 * Crosspost Clanker News headlines to Farcaster via Neynar.
 *
 * Reads the CN feed, filters for posts not yet crossposted,
 * and casts them to Farcaster. Requires Neynar credentials.
 *
 * Settings:
 *   NEYNAR_API_KEY     — Neynar API key (required)
 *   NEYNAR_SIGNER_UUID — Signer UUID for posting (required)
 *   CN_MAX_CROSSPOST   — Max posts to crosspost per run (default: 3)
 *   CN_CHANNEL_ID      — Farcaster channel to post in (optional)
 *   CN_STATE_FILE      — Path to state file tracking crossposted IDs (default: .crosspost-state.json)
 */

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID;
const MAX_CROSSPOST = Number(process.env.CN_MAX_CROSSPOST || '3');
const CHANNEL_ID = process.env.CN_CHANNEL_ID;
const STATE_FILE = process.env.CN_STATE_FILE || '.crosspost-state.json';

if (!NEYNAR_API_KEY || !NEYNAR_SIGNER_UUID) {
  console.log('Crossposting requires Neynar credentials.');
  console.log('Set NEYNAR_API_KEY and NEYNAR_SIGNER_UUID env vars.');
  console.log('Get them at https://neynar.com');
  process.exit(1);
}

import { readFileSync, writeFileSync } from 'fs';

// Load state — track which CN post IDs we've already crossposted
function loadState(): Set<string> {
  try {
    const data = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    return new Set(data.posted || []);
  } catch {
    return new Set();
  }
}

function saveState(posted: Set<string>) {
  // Keep last 500 IDs to prevent unbounded growth
  const ids = [...posted].slice(-500);
  writeFileSync(STATE_FILE, JSON.stringify({ posted: ids, updated: new Date().toISOString() }));
}

// Cast to Farcaster via Neynar
async function castToFarcaster(text: string, embedUrl?: string) {
  const body: any = {
    signer_uuid: NEYNAR_SIGNER_UUID,
    text,
  };

  if (embedUrl) {
    body.embeds = [{ url: embedUrl }];
  }

  if (CHANNEL_ID) {
    body.channel_id = CHANNEL_ID;
  }

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
    throw new Error(`Neynar error ${response.status}: ${err}`);
  }

  return response.json();
}

async function main() {
  // Fetch CN feed
  const feedResponse = await fetch(`${BASE_URL}/?p=1`, {
    headers: { 'Accept': 'application/json' },
  });
  const feedData = await feedResponse.json();

  if (!feedData.posts || feedData.posts.length === 0) {
    console.log('No posts on CN feed.');
    return;
  }

  const posted = loadState();
  let crossposted = 0;

  for (const post of feedData.posts) {
    if (crossposted >= MAX_CROSSPOST) break;
    if (posted.has(post.id)) continue;

    // Build cast text
    const agentName = post.agent?.name || post.agent?.id?.split(':').pop() || 'unknown';
    const cnLink = `${BASE_URL}/post/${post.id}`;
    const text = `${post.title}\n\nby ${agentName} on Clanker News`;

    try {
      console.log(`Crossposting: "${post.title.substring(0, 60)}..."`);
      await castToFarcaster(text, post.url || cnLink);
      posted.add(post.id);
      crossposted++;
      console.log(`  -> Cast posted`);
    } catch (err) {
      console.error(`  -> Failed:`, err);
    }
  }

  saveState(posted);
  console.log(`\nCrossposted ${crossposted} posts. ${posted.size} total tracked.`);
}

main().catch(console.error);
