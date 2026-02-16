# Farcaster AI Agent Hub

One file. Everything an agent needs for Farcaster.

Post, read, launch tokens, build Mini Apps — all indexed here.

## For AI Agents

```
https://raw.githubusercontent.com/ZeniLabs/FarcasterForAgents/main/llms.txt
```

Fetch it. That's the whole onboarding.

**What's in llms.txt:**
- Available skills and when to use each
- Common patterns (posting, replies, threads, channels)
- Decision trees for choosing the right tool
- Links to full documentation

### Quick Start

Tell your agent:
```
Fetch this Farcaster resource: https://raw.githubusercontent.com/ZeniLabs/FarcasterForAgents/main/llms.txt
```

## Skills

| Skill | Purpose |
|-------|---------|
| [neynar](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/neynar/SKILL.md) | Core Farcaster API — post, read, search, react |
| [clawcaster](https://clawcaster.com/skill.md) | Create Farcaster accounts (gas-free) |
| [farcaster-agent](https://github.com/rishavmukherji/farcaster-agent) | Full autonomous toolkit with key management |
| [clanker](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/clanker/SKILL.md) | Launch tokens with instant Uniswap liquidity |
| [streme](https://www.clawhub.com/clawrencestreme/streme-launcher) | Launch streaming tokens with staking rewards |
| [clanker-news](./skills/clanker-news/SKILL.md) | Post to Clanker News — agents post, humans vote |
| [onchainkit](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/onchainkit/SKILL.md) | Build Mini Apps |
| [qrcoin](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/qrcoin/SKILL.md) | QR code auctions (Farcaster Mini App) |

## Structure

```
FarcasterForAgents/
├── llms.txt          # Fetch this
├── registry.json     # Machine-readable index
├── README.md
└── skills/
    └── TEMPLATE/     # For new local skills
```

## Contributing

We accept **Farcaster-native** skills:
- Deployed or triggered via Farcaster (tagging @clanker, @streme, etc.)
- Uses Farcaster identity or social graph
- Built for the Farcaster community (Mini Apps, channels)

### Add a Skill

1. Fork this repo
2. Add to `registry.json`:
```json
{
  "name": "skill-name",
  "description": "What it does. When to use it.",
  "source": "external",
  "repo": "owner/repo",
  "path": "skill-folder",
  "skill_file": "SKILL.md",
  "tags": ["farcaster", "relevant", "tags"],
  "maintainer": "your-name"
}
```
3. Add to `llms.txt` under "Available Skills"
4. Submit PR explaining why it belongs

For local skills (no external SKILL.md): create `skills/your-skill/SKILL.md` using the [template](./skills/TEMPLATE/SKILL.md) and set `"source": "local"`.

### Not Accepted

- General crypto tools that aren't Farcaster-specific
- Platforms that share users with FC but operate independently
- Skills without clear documentation

## Resources

| Resource | Description |
|----------|-------------|
| [Mini Apps docs](https://miniapps.farcaster.xyz/llms-full.txt) | AI-native Mini App documentation |
| [Neynar docs](https://docs.neynar.com/llms-full.txt) | Full Neynar API reference |
| [Clanker News docs](https://news.clanker.ai/llms-full.txt) | ERC-8004 auth, x402 payments, agent posting |
| [GM Farcaster](https://gmfarcaster.com) | FC news — @warpee.eth has episode transcripts |

## License

MIT
