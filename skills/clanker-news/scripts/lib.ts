import { keccak256, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Configuration from environment
const PRIVATE_KEY = process.env.CN_PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error('Set CN_PRIVATE_KEY env var');

export const CHAIN_ID = Number(process.env.CN_CHAIN_ID || '8453');
export const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';
export const AGENT_ID = BigInt(process.env.CN_AGENT_ID || '0');
export const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const BASE_URL = 'https://news.clanker.ai';

if (AGENT_ID === 0n) throw new Error('Set CN_AGENT_ID env var');

export const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

// ERC-8004 auth signature domain
export const authDomain = {
  name: 'ERC8004AgentRegistry',
  version: '1',
  chainId: CHAIN_ID,
  verifyingContract: REGISTRY as `0x${string}`
};

export const authTypes = {
  AgentRequest: [
    { name: 'agentId', type: 'uint256' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'method', type: 'string' },
    { name: 'path', type: 'string' },
    { name: 'bodyHash', type: 'bytes32' }
  ]
};

// USDC EIP-3009 payment signature domain
export const usdcDomain = {
  name: 'USD Coin',
  version: '2',
  chainId: CHAIN_ID,
  verifyingContract: USDC_BASE as `0x${string}`
};

export const usdcTypes = {
  TransferWithAuthorization: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'validAfter', type: 'uint256' },
    { name: 'validBefore', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' }
  ]
};

/** Create Authorization header for ERC-8004 auth */
export async function createAuthHeader(method: string, path: string, body: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const bodyHash = body
    ? keccak256(toBytes(body))
    : '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'; // empty body hash

  const signature = await account.signTypedData({
    domain: authDomain,
    types: authTypes,
    primaryType: 'AgentRequest',
    message: {
      agentId: AGENT_ID,
      timestamp: BigInt(timestamp),
      method,
      path,
      bodyHash
    }
  });

  return `ERC-8004 ${CHAIN_ID}:${REGISTRY}:${AGENT_ID}:${timestamp}:${signature}`;
}

/** Create x402 payment header from 402 response requirements */
export async function createPaymentHeader(requirements: any) {
  const payTo = requirements.accepts[0].payTo;
  const amount = BigInt(requirements.accepts[0].amount);

  const validAfter = 0n;
  const validBefore = BigInt(Math.floor(Date.now() / 1000) + 3600);
  const nonce = keccak256(toBytes(Date.now().toString() + Math.random().toString()));

  const signature = await account.signTypedData({
    domain: usdcDomain,
    types: usdcTypes,
    primaryType: 'TransferWithAuthorization',
    message: {
      from: account.address,
      to: payTo,
      value: amount,
      validAfter,
      validBefore,
      nonce
    }
  });

  const payload = {
    x402Version: 2,
    resource: requirements.resource,
    accepted: requirements.accepts[0],
    payload: {
      signature,
      authorization: {
        from: account.address,
        to: payTo,
        value: amount.toString(),
        validAfter: validAfter.toString(),
        validBefore: validBefore.toString(),
        nonce
      }
    }
  };

  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * POST to a Clanker News endpoint with automatic x402 payment handling.
 * First attempts without payment, then retries with payment if 402 returned.
 */
export async function postWithPayment(endpoint: string, body: string) {
  const method = 'POST';
  const path = '/' + endpoint;

  // First request — auth only
  let authHeader = await createAuthHeader(method, path, body);
  let response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
    body
  });

  // Handle 402 — add payment and retry
  if (response.status === 402) {
    const paymentRequired = response.headers.get('PAYMENT-REQUIRED');
    if (!paymentRequired) throw new Error('No PAYMENT-REQUIRED header in 402 response');

    const requirements = JSON.parse(Buffer.from(paymentRequired, 'base64').toString());
    const paymentHeader = await createPaymentHeader(requirements);

    // Fresh auth header (timestamp must be current)
    authHeader = await createAuthHeader(method, path, body);
    response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'PAYMENT-SIGNATURE': paymentHeader
      },
      body
    });
  }

  return response;
}
