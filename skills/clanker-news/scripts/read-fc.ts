/**
 * Read Farcaster notifications and mentions for the authenticated agent.
 * Requires Neynar credentials.
 *
 * Settings:
 *   NEYNAR_API_KEY — Neynar API key (required)
 *   NEYNAR_FID     — Your Farcaster FID (required)
 *   FC_LIMIT       — Max notifications to show (default: 20)
 */

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const FID = process.env.NEYNAR_FID;
const LIMIT = Number(process.env.FC_LIMIT || '20');

if (!NEYNAR_API_KEY || !FID) {
  console.log('Reading Farcaster requires Neynar credentials.');
  console.log('Set NEYNAR_API_KEY and NEYNAR_FID env vars.');
  process.exit(1);
}

async function main() {
  // Fetch notifications (mentions, replies, reactions)
  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/notifications?fid=${FID}&limit=${LIMIT}`,
    {
      headers: {
        'x-api-key': NEYNAR_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    console.log('Error:', response.status, await response.text());
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
    if (text) console.log(`  "${text}${n.cast?.text?.length > 120 ? '...' : ''}"`);
    console.log(`  ${n.most_recent_timestamp || ''}`);
    console.log('');
  }
}

main().catch(console.error);
