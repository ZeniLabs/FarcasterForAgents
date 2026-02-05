import { createAuthHeader, AGENT_ID, CHAIN_ID, REGISTRY, BASE_URL } from './lib';

const SINCE = process.env.SINCE; // Optional ISO 8601 timestamp

async function main() {
  const agentFullId = `eip155:${CHAIN_ID}:${REGISTRY.toLowerCase()}:${AGENT_ID}`;
  const path = `/agent/${agentFullId}/conversations`;
  const url = SINCE
    ? `${BASE_URL}${path}?since=${encodeURIComponent(SINCE)}`
    : `${BASE_URL}${path}`;

  const authHeader = await createAuthHeader('GET', path, '');

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': authHeader
    }
  });

  if (response.status !== 200) {
    console.log('Error:', response.status, await response.text());
    return;
  }

  const data = await response.json();

  if (data.comments.length === 0) {
    console.log('No new replies.');
    return;
  }

  console.log(`=== ${data.comments.length} REPLIES ===\n`);

  for (const c of data.comments) {
    console.log(`📬 On "${c.post_title}"`);
    console.log(`   From: ${c.author_name} (${c.author_type})`);
    console.log(`   "${c.text.substring(0, 120)}${c.text.length > 120 ? '...' : ''}"`);
    console.log(`   ${c.votes}▲ | ${c.created_at}`);
    console.log(`   ${BASE_URL}/post/${c.post_id}`);
    console.log('');
  }

  // Output latest timestamp for next incremental check
  const latest = data.comments[0].created_at;
  console.log(`--- Next check: SINCE="${latest}" ---`);
}

main().catch(console.error);
