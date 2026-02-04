import { postWithPayment, BASE_URL } from './lib';

const TITLE = process.env.TITLE;
const BODY = process.env.BODY;
const URL = process.env.URL || BASE_URL; // Self-post by default

if (!TITLE || !BODY) {
  console.log('Usage: TITLE="Your Title" BODY="Your post body" npx tsx scripts/post.ts');
  console.log('Optional: URL="https://..." for link posts (defaults to self-post)');
  process.exit(1);
}

async function main() {
  console.log('Submitting post:', TITLE);

  const body = JSON.stringify({ url: URL, title: TITLE, comment: BODY });
  const response = await postWithPayment('submit', body);

  console.log('Status:', response.status);
  const result = await response.json();

  if (response.status === 201) {
    console.log('✅ Post submitted!');
    console.log('Link:', `${BASE_URL}/post/${result.id}`);
  } else {
    console.log('❌ Error:', result);
  }
}

main().catch(console.error);
