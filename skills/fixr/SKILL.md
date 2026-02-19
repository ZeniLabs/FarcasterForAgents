---
name: fixr
description: "Autonomous AI agent API on Base. Security audits, rug detection, token analysis, wallet intelligence, reputation scoring, GitHub analysis, sentiment tracking, builder leaderboards, image/video generation. Access via x402 micropayments ($0.01 USDC) or FIXR token staking."
metadata: { "openclaw": { "emoji": "🔧", "requires": { "bins": [] } } }
---

# Fixr

Autonomous AI agent with a public API for security, intelligence, and content generation. All endpoints live at `https://agent.fixr.nexus/api/v1/`.

## Prerequisites

One of:
- **x402 payment**: USDC on Base, Solana, or Monad ($0.01 per call)
- **FIXR staking**: Stake FIXR tokens on Base for rate-limited free access

No API key required. Authentication is on-chain.

## Access Tiers

| Tier | Requirement | Rate Limit |
|------|-------------|------------|
| Free | None | 10 req/min |
| Builder | 1M+ FIXR staked | 20 req/min |
| Pro | 10M+ FIXR staked | 50 req/min |
| Elite | 50M+ FIXR staked or x402 payment | Unlimited |

## Payment Headers

```bash
# Option 1: x402 on Base — send $0.01 USDC, pass tx hash
X-Payment-TxHash: 0x...
X-Payment-Chain: base

# Option 2: x402 on Solana
X-Payment-TxHash: <signature>
X-Payment-Chain: solana

# Option 3: Obol on Monad — pay via bonding curve router
X-Payment-Nonce: 0x...
X-Payment-Chain: monad

# Option 4: Staking — pass wallet, rate limited by tier
X-Wallet-Address: 0x...
```

## Payment Constants

| Chain | Token | Recipient/Router |
|-------|-------|-----------------|
| Base (8453) | USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | `0xBe2Cc1861341F3b058A3307385BEBa84167b3fa4` |
| Solana | USDC `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | `96vRDBvjR2FhtzH5WtawLWdLh1dFmZjnY4DEsmjaEvuU` |
| Monad (143) | USDC via Obol Router `0x873830D10E06b6BE85337B50D6b4b76E9f79Cf1F` | curveId: 0 |

Staking contract (Base): `0x39DbBa2CdAF7F668816957B023cbee1841373F5b`

## Quick Reference

```bash
BASE="https://agent.fixr.nexus/api/v1"

# Security audit a contract
curl -X POST "$BASE/security/audit" \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Address: 0xYOUR_WALLET" \
  -d '{"address": "0xCONTRACT", "network": "base"}'

# Rug detection for a token
curl "$BASE/rug/detect/0xTOKEN?network=base" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# Wallet intelligence
curl -X POST "$BASE/wallet/intel" \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Address: 0xYOUR_WALLET" \
  -d '{"address": "0xTARGET", "network": "base"}'

# Token analysis
curl -X POST "$BASE/token/analyze" \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Address: 0xYOUR_WALLET" \
  -d '{"address": "0xTOKEN", "network": "base", "format": "full"}'

# Farcaster sentiment for a token
curl "$BASE/sentiment/DEGEN" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# Reputation: Ethos score by FID
curl "$BASE/reputation/ethos/3" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# Reputation: Talent Protocol by wallet
curl "$BASE/reputation/talent/0xWALLET" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# GitHub repo analysis
curl -X POST "$BASE/github/analyze" \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Address: 0xYOUR_WALLET" \
  -d '{"owner": "uniswap", "repo": "v4-core"}'

# Builder profile (by FID or username)
curl "$BASE/builder/3" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# Top builders leaderboard
curl "$BASE/builders/top?limit=20&period=7d" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# Recent shipped projects
curl "$BASE/ships/recent?limit=10" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# Trending topics on Farcaster
curl "$BASE/trending/topics?limit=10" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# Recent rug incidents
curl "$BASE/rug/recent?limit=20" \
  -H "X-Wallet-Address: 0xYOUR_WALLET"

# AI image generation
curl -X POST "$BASE/generate/image" \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Address: 0xYOUR_WALLET" \
  -d '{"prompt": "cyberpunk city at sunset", "style": "digital art"}'

# AI video generation
curl -X POST "$BASE/generate/video" \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Address: 0xYOUR_WALLET" \
  -d '{"prompt": "ocean waves on a beach", "duration": 5}'

# Check your access tier
curl "https://agent.fixr.nexus/api/access/tier?wallet=0xYOUR_WALLET"

# Get payment info (chains, addresses, pricing)
curl "https://agent.fixr.nexus/api/access/payment"
```

## Available Endpoints

### Security & Risk

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/security/audit` | Smart contract security audit |
| POST | `/wallet/intel` | Wallet intelligence and risk scoring |
| GET | `/rug/detect/:address` | Rug detection for a token |
| GET | `/rug/recent` | Recent rug incidents |

### Token & Market

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/token/analyze` | Comprehensive token analysis |
| GET | `/sentiment/:symbol` | Farcaster sentiment for a token |

### Reputation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reputation/ethos/:fid` | Ethos reputation score by Farcaster FID |
| GET | `/reputation/talent/:wallet` | Talent Protocol score by wallet |

### Builder Intelligence

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/builder/:id` | Builder profile (FID or username) |
| GET | `/builders/top` | Top builders leaderboard |
| GET | `/ships/recent` | Recently shipped projects |
| GET | `/trending/topics` | Trending topics on Farcaster |

### Code Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/github/analyze` | GitHub repository analysis |

### Content Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate/image` | AI image generation (Gemini) |
| POST | `/generate/video` | AI video generation (WaveSpeed) |

## Request/Response Shapes

### Security Audit
```json
// Request
{ "address": "0x...", "network": "base" }

// Response
{ "success": true, "audit": { "address": "0x...", "network": "base", ... } }
```

### Token Analysis
```json
// Request
{ "address": "0x...", "network": "base", "format": "full" }

// Response
{ "success": true, "report": { ... }, "formatted": "..." }
```

### Wallet Intel
```json
// Request
{ "address": "0x...", "network": "base" }

// Response
{ "success": true, "wallet": "0x...", "intel": { ... } }
```

## Error Responses

| Code | Meaning |
|------|---------|
| 400 | Bad request (missing/invalid params) |
| 402 | Payment required (includes x402 options) |
| 429 | Rate limit exceeded (includes tier info) |
| 500 | Server error |

402 responses include payment instructions:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "x402": {
    "pricePerCall": "$0.01 USDC",
    "chains": { "base": { ... }, "solana": { ... }, "monad": { ... } }
  }
}
```

## Skill Chaining

| Flow | What it does |
|------|-------------|
| `fixr → neynar` | Audit a contract, post findings to Farcaster |
| `fixr → clanker-news` | Analyze a token, submit report to Clanker News |
| `neynar → fixr` | Read Farcaster mentions, analyze mentioned tokens |

## ERC-8004 Identity

Fixr is registered on the ERC-8004 Agent Registry:
- Agent #22820 (Ethereum, Base, Arbitrum)
- Registry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`

## Links

- Agent: https://agent.fixr.nexus
- Site: https://fixr.nexus
- Farcaster: [@fixr](https://farcaster.xyz/fixr)
- GitHub: https://github.com/the-fixr

## Maintainer

Fixr — https://fixr.nexus
