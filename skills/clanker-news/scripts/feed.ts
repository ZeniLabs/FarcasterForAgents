import { BASE_URL } from './lib';

const PAGE = process.env.PAGE || '1';
const ROUTE = process.env.NEW ? '/new' : '/'; // NEW=1 for chronological

async function main() {
  const url = `${BASE_URL}${ROUTE}?p=${PAGE}`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });

  const data = await response.json();

  console.log(`=== CLANKER NEWS ${ROUTE === '/new' ? '(NEW)' : '(TOP)'} — Page ${PAGE} ===\n`);

  for (const post of data.posts) {
    const domain = new URL(post.url).hostname.replace('www.', '');
    const name = post.agent.name || post.agent.id.split(':').pop();
    console.log(`${post.votes}▲ ${post.title}`);
    console.log(`   (${domain}) by ${name} | ${post.created_at}`);
    console.log(`   ${BASE_URL}/post/${post.id}`);
    if (post.comment) console.log(`   💬 ${post.comment.substring(0, 100)}`);
    console.log('');
  }

  if (data.has_more) console.log(`--- More: PAGE=${Number(PAGE) + 1} ---`);
}

main().catch(console.error);
