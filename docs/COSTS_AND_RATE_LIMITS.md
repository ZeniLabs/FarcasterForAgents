# Farcaster Skills: Cost & Rate Limit Reference

> **For AI Agents**: This document describes the costs and constraints that apply when executing Farcaster skills. Use this information to make informed decisions about which APIs to call, when to cache data, and how to stay within operational budgets.

## Quick Reference Table

| Skill | Cost Model | Constraints | Agent Decision Factors |
|-------|------------|-------------|------------------------|
| **Neynar** | Credits/month | 200K free credits, 300 RPM | Cache responses; batch requests when possible |
| **Clanker** | Gas fees only | No API rate limits documented | Free to query; deployment costs gas |
| **OnchainKit** | Free | CDP: 3-10 RPS | No cost; rate limit is the constraint |
| **Clawcaster/OpenClaw** | ~$1 per agent | One-time activation | Already activated = no additional cost |
| **Streme** | Gas fees | No public API | Must interact via Farcaster mention |
| **QRCoin** | USDC auction bids | Daily auctions | High cost; only bid if specifically requested |
| **Farcaster-Agent** | Underlying APIs | Neynar + LLM costs | Cost = Neynar credits + token costs |

---

## Neynar API Costs

**Primary Farcaster data provider.** Every Farcaster read/write operation consumes Neynar credits.

### Credit Budget

| Plan | Credits/Month | Rate Limit | Notes |
|------|---------------|------------|-------|
| Free | 200,000 | 300 RPM / 5 RPS | Sufficient for ~6,600 casts/month |
| Starter | 1,000,000 | 300 RPM / 5 RPS | $9/month |
| Growth | 10,000,000 | 600 RPM / 10 RPS | $49/month |

### Credit Cost Per Operation

**1-5 credits (low cost - execute freely):**
- Cast lookup by hash: 1 credit
- User profile lookup: 1 credit
- User search: 1 credit

**10-50 credits (medium cost - consider caching):**
- Posting a cast: 10-25 credits
- Creating a reaction (like/recast): 10 credits
- Feed pagination: 4 credits × items requested

**150-2000 credits (high cost - batch when possible):**
- Bulk user lookup: 150-2000 credits
- Event queries: varies

**0 credits (always free):**
- Frame validation
- Signer GET requests

### Agent Guidance
- **Before fetching user data**: Check if already cached from previous operations
- **When posting casts**: Single posts are cheap (10-25 credits); acceptable for routine operations
- **When fetching feeds**: Costs scale with page limit; request only what's needed
- **Bonus credits**: Each active signer grants +20,000 credits/month

---

## Clanker Token Deployment

**Farcaster-native token launcher.** API queries are free; deployment costs gas.

### Cost Structure

| Operation | Cost |
|-----------|------|
| API queries (token info, search) | Free |
| Token deployment | Gas fees (~$0.50-2 on Base) |
| Creator earnings | 80% of LP fees flow to creator |

### Agent Guidance
- **Querying token data**: No cost; query freely for research
- **Deploying tokens**: Only execute if explicitly requested; consumes ETH for gas
- **Rate limits**: None documented; high-volume use should be discussed with Clanker team

---

## OnchainKit

**Open-source React components.** The library itself is free; underlying CDP has rate limits.

### Constraints

| Endpoint Type | Rate Limit |
|---------------|------------|
| Public (unauthenticated) | 3-10 RPS |
| Private (authenticated) | 5-15 RPS |
| WebSocket connections | 1/second, max 20 subscriptions |

### Agent Guidance
- **Cost**: Zero API cost
- **Constraint**: Rate limits are the only factor; stay under 5 RPS to be safe
- **Transaction costs**: Base network fees (~$0.01) apply to on-chain operations

---

## Clawcaster / OpenClaw

**Agent account creation service.**

### Cost Structure

| Operation | Cost |
|-----------|------|
| Agent activation | ~$1 USD (one-time) |
| Subsequent operations | Neynar costs only |

### Agent Guidance
- **If already activated**: No additional OpenClaw costs; normal Neynar rates apply
- **New agent setup**: Requires ~$1 USDC/ETH for activation

---

## Streme

**AI-powered token launcher with streaming mechanics.**

### Cost Structure

| Operation | Cost |
|-----------|------|
| Token creation | Free (via @streme mention on Farcaster) |
| Creator earnings | 40% of trading fees |

### Agent Guidance
- **No public API**: Must interact by mentioning @streme on Farcaster
- **Cost to create**: Only Neynar credits for the cast; no direct Streme fees
- **Token distribution**: 20% staking rewards, 80% Uniswap liquidity

---

## QRCoin

**Daily QR code auction platform.**

### Cost Structure

| Operation | Cost |
|-----------|------|
| Viewing auctions | Free |
| Placing bids | USDC (varies; record bid was $3,500) |

### Agent Guidance
- **High cost action**: Only participate in auctions if explicitly requested
- **No API**: Interaction via web app or Farcaster mini app only

---

## LLM Costs (Farcaster-Agent Toolkits)

When using agent frameworks that include LLM calls:

| Provider/Model | Cost per 1K tokens |
|----------------|-------------------|
| GPT-4 | ~$0.03 |
| Claude 3.5 Sonnet | ~$0.003 |
| Llama 3 (via OpenRouter) | ~$0.0002 |

### Agent Guidance
- **Total cost** = Neynar credits + LLM tokens + any on-chain gas
- **Optimization**: Use smaller models for simple tasks; reserve GPT-4/Claude for complex reasoning

---

## Operational Guidelines

### When to Cache
- User profile data (changes infrequently)
- Cast content (immutable once posted)
- Token metadata (rarely changes)

### When to Query Fresh
- User follower counts (can change rapidly)
- Feed content (new casts constantly)
- Token prices (volatile)

### Budget Allocation Example
With 200K free Neynar credits:
- ~6,600 simple casts (at 30 credits each)
- ~40,000 user lookups (at 5 credits each)
- ~200,000 cast lookups (at 1 credit each)

Mix operations based on task requirements; prioritize caching to extend budget.

---

## Contributing

Outdated pricing information? Submit a PR to update this document.

Last updated: February 2026