/**
 * Read Farcaster notifications and mentions for the authenticated agent.
 *
 * REQUIRES PAID NEYNAR PLAN — notifications endpoint is not on free tier.
 * See: https://neynar.com/#pricing
 *
 * Env vars:
 *   NEYNAR_API_KEY — Neynar API key (required)
 *   NEYNAR_FID     — Your Farcaster FID (required)
 *   FC_LIMIT       — Max notifications to show (default: 20)
 */

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const FID = process.env.NEYNAR_FID;
const LIMIT = Number(process.env.FC_LIMIT || '20');

if (!NEYNAR_API_KEY) {
  console.error('NEYNAR_API_KEY required. Get one at https://neynar.com');
  process.exit(1);
}
if (!FID) {
  console.error('NEYNAR_FID required. This is your Farcaster ID number.');
  process.exit(1);
}

async function main() {
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/notifications?fid=${FID}&limit=${LIMIT}`,
    { headers: { 'x-api-key': NEYNAR_API_KEY! } }
  );

  if (response.status === 402) {
    console.error('Notifications require a paid Neynar plan.');
    console.error('See https://neynar.com/#pricing to upgrade.');
    process.exit(1);
  }

  if (!response.ok) {
    console.error('Error:', response.status, await response.text());
    return;
  }

  const data = await response.json();

  if (!data.notifications || data.notifications.length === 0) {
    console.log('No notifications.');
    return;
  }

  console.log(`=== ${data.notifications.length} FARCASTER NOTIFICATIONS ===\n`);

  for (const n of data.notifications) {
    const type = n.type.toUpperCase();
    const author = n.cast?.author?.username || n.user?.username || 'unknown';
    const text = n.cast?.text?.substring(0, 120) || '';

    console.log(`[${type}] @${author}`);
    if (text) console.log(`  "${text}${(n.cast?.text?.length || 0) > 120 ? '...' : ''}"`);
    console.log(`  ${n.most_recent_timestamp || ''}`);
    console.log('');
  }
}

main().catch(console.error);
