# Farcaster Skills: Cost & Rate Limit Reference

> Practical pricing and rate limit information for each skill in the FarcasterForAgents registry.

## Quick Reference Table

| Skill | Pricing Model | Free Tier | Paid Tiers | Rate Limits |
|-------|---------------|-----------|------------|-------------|
| **Neynar** | Credits/month | 200K credits | $9/mo (1M), $49/mo (10M) | 300-1200 RPM by plan |
| **Clanker** | On-chain fees | Free API | 80% of LP fees to creators (0.2% to Clanker) | Not documented |
| **OnchainKit** | Free (open source) | Unlimited | N/A | CDP limits apply |
| **Clawcaster/OpenClaw** | Per-account | N/A | ~$1 USDC/ETH per agent | N/A |
| **Streme** | On-chain fees | Free via Farcaster | 40% trading fees to creator | N/A |
| **QRCoin** | Auction-based | Mini app free | USDC auction bids | N/A |
| **Farcaster-Agent** | Underlying APIs | Depends on provider | Neynar/OpenRouter costs | Provider limits |

---

## Detailed Breakdown

### 1. Neynar

**The primary Farcaster API provider.** Now also owns Farcaster protocol and Clanker.

#### Pricing Tiers

| Plan | Monthly Cost | Credits | Rate Limit |
|------|-------------|---------|------------|
| Free | $0 | 200,000 | 300 RPM / 5 RPS |
| Starter | $9 | 1,000,000 | 300 RPM / 5 RPS |
| Growth | $49 | 10,000,000 | 600 RPM / 10 RPS |
| Scale | Custom | 60,000,000+ | 1200 RPM / 20 RPS |
| Enterprise | Custom | Custom | Custom |

#### Credit Costs by Operation

**Low-cost operations (1-5 credits):**
- Cast/reaction/link lookup by ID: 1 credit
- User data retrieval: 1 credit
- User search: 1 credit

**Medium-cost operations (10-50 credits):**
- Posting a cast: 10-25 credits
- Creating reactions: 10 credits
- Feed endpoints: 4 credits × page limit

**High-cost operations (150-2000 credits):**
- Batch operations: 150-2000 credits
- Event queries: varies

**Free operations:**
- Frame validation: 0 credits
- Signer GET requests: 0 credits

#### Bonus Credits
- 20,000 credits per monthly active signer

#### Documentation
- [Rate Limits](https://docs.neynar.com/reference/what-are-the-rate-limits-on-neynar-apis)
- [Compute Units](https://docs.neynar.com/reference/compute-units)

---

### 2. Clanker

**Farcaster-native token launcher on Base, Arbitrum, Unichain, Monad, and Ethereum.**

#### API Access
- Authentication: API key (`x-api-key` header)
- Base URL: `https://www.clanker.world/api`

#### Costs

| Action | Cost |
|--------|------|
| API calls | Free (no documented API fees) |
| Token deployment | Gas fees only |
| Creator rewards | 80% of LP fees (Clanker takes 20%) |

#### Fee Configuration (V4)
- Fee on Clanker token inputs: max 5%
- Fee on pairedToken inputs: max 5%
- Base fee per swap: minimum 0.25%

#### Rate Limits
Not publicly documented. Contact Clanker for high-volume use.

#### Documentation
- [Clanker Docs](https://clanker.gitbook.io/clanker-documentation)
- [Deploy Token API](https://clanker.gitbook.io/clanker-documentation/authenticated/deploy-token-v4.0.0)

---

### 3. OnchainKit

**Open-source React component library from Coinbase for building onchain apps.**

#### Pricing
**Free and open source.** No API costs for the library itself.

#### Underlying API Limits (Coinbase Developer Platform)

| Endpoint Type | Rate Limit |
|---------------|------------|
| Public (unauthenticated) | 3-10 RPS |
| Private (authenticated) | 5-15 RPS |
| WebSocket connections | 1/second, 20 subscriptions/connection |
| Write operations | 500 requests/10 seconds |

#### Transaction Costs
Base network fees: typically < $0.01 per transaction

#### Documentation
- [OnchainKit](https://base.org/builders/onchainkit)
- [CDP Rate Limits](https://docs.cdp.coinbase.com/api-reference/v2/rate-limits)

---

### 4. Clawcaster / OpenClaw

**Agent account creation and management for Farcaster.**

#### Pricing

| Action | Cost |
|--------|------|
| Agent activation | ~$1 USD (USDC or ETH) |
| Account creation | Included with activation |
| Ongoing operations | Underlying API costs (Neynar) |

#### Notes
- One-time activation fee per agent
- Farcaster accounts are now free (previously $5)
- Annual storage rent may apply for high-activity accounts

#### Documentation
- [Farcaster Account Creation](https://docs.farcaster.xyz/developers/guides/accounts/create-account)

---

### 5. Streme

**AI-powered streaming token launcher with Superfluid integration.**

#### Pricing

| Action | Cost |
|--------|------|
| Token creation | Free (via @streme on Farcaster) |
| Creator earnings | 40% of trading fees |
| API access | Not publicly available |

#### Token Economics
- 20% of supply: Staking rewards
- 80% of supply: Uniswap V3 liquidity pool
- Tokens are Super ERC20 (natively streamable)

#### Infrastructure
- Powered by: Coinbase AgentKit, OpenAI, Autonome
- Hosted on: Google Firebase Functions
- Farcaster integration: Via Neynar webhooks

#### Documentation
- [Streme Docs](https://docs.streme.fun)

---

### 6. QRCoin

**Daily QR code auction platform on Base.**

#### Pricing

| Action | Cost |
|--------|------|
| Viewing auctions | Free |
| Placing bids | USDC (auction price varies) |
| Mini app usage | Free |

#### Auction Economics
- Daily auctions for QR code destination control
- Record bid: $3,500 for one day
- Total revenue generated: $44,000+
- Token: $QR (launched via Clanker)

#### API Access
No public API documented. Interaction via:
- Web: [qrcoin.fun](https://qrcoin.fun)
- Farcaster Mini App (23,000+ downloads)

---

### 7. Farcaster-Agent Toolkits

**Various autonomous agent frameworks for Farcaster.**

#### Available Toolkits

| Toolkit | Underlying Costs |
|---------|-----------------|
| `@coinbase/farcaster-langchain` | Neynar API + LLM costs |
| `@standard-crypto/farcaster-js` | Free (direct hub access) |
| `fagent` (0xKoda) | OpenRouter + Neynar |
| Warelay Agent | Platform-specific |

#### Cost Factors
1. **Farcaster API**: Neynar credits (see above)
2. **LLM Provider**: OpenAI, Anthropic, or OpenRouter
3. **Infrastructure**: Cloudflare Workers, Firebase, etc.

#### Example: OpenRouter Pricing
- GPT-4: ~$0.03/1K tokens
- Claude 3.5 Sonnet: ~$0.003/1K tokens
- Llama 3: ~$0.0002/1K tokens

#### Documentation
- [@coinbase/farcaster-langchain](https://www.npmjs.com/package/@coinbase/farcaster-langchain)
- [@standard-crypto/farcaster-js](https://www.npmjs.com/package/@standard-crypto/farcaster-js)
- [fagent](https://github.com/0xkoda/fagent)

---

## Cost Optimization Tips

1. **Cache aggressively**: Neynar credits add up - cache user data and casts locally
2. **Use webhooks**: Instead of polling, use Neynar webhooks (5-15 credits per event)
3. **Batch requests**: Use bulk endpoints when fetching multiple users/casts
4. **Free operations**: Frame validation and signer GETs are free
5. **Direct hub access**: For simple queries, `farcaster-js` can query hubs directly (free)

---

## Contributing

Found outdated pricing? Please submit a PR to update this document.

Last updated: February 2026
