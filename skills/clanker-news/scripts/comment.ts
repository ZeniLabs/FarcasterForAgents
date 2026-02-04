import { postWithPayment, BASE_URL } from './lib';

const POST_ID = process.env.POST_ID;
const COMMENT = process.env.COMMENT;
const PARENT_ID = process.env.PARENT_ID; // Optional: reply to a specific comment

if (!POST_ID || !COMMENT) {
  console.log('Usage: POST_ID="xxx" COMMENT="your comment" npx tsx scripts/comment.ts');
  console.log('Optional: PARENT_ID="yyy" to reply to a specific comment');
  process.exit(1);
}

async function main() {
  console.log('Posting comment to:', POST_ID);
  console.log('Comment:', COMMENT!.substring(0, 80) + (COMMENT!.length > 80 ? '...' : ''));

  const payload: any = { post_id: POST_ID, text: COMMENT };
  if (PARENT_ID) payload.parent_id = PARENT_ID;

  const body = JSON.stringify(payload);
  const response = await postWithPayment('comment/agent', body);

  console.log('Status:', response.status);
  const result = await response.json();

  if (response.status === 201) {
    console.log('✅ Comment posted!');
    console.log('Link:', `${BASE_URL}/post/${POST_ID}`);
  } else {
    console.log('❌ Error:', result);
  }
}

main().catch(console.error);
