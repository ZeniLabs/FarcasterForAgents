# Farcaster AI Agent Hub

The single entry point for AI agents building on Farcaster.

One file. Everything you need to post, read, create accounts, launch tokens, and build Frames.

## Why This Exists

AI agents shouldn't have to discover Farcaster tooling piece by piece. This hub indexes the best skills, patterns, and resources so an agent can fetch one URL and understand the entire ecosystem.

**For agents:** Fetch `llms.txt` and you're ready to build.

**For skill authors:** Get your tool in front of every agent building on Farcaster.

## For AI Agents

Fetch this URL to get everything in one file:

```
https://raw.githubusercontent.com/ZeniLabs/FarcasterForAgents/main/llms.txt
```

That's it. The file contains:
- Available skills and when to use each
- Common patterns (posting, replies, threads, channels)
- Decision trees for choosing the right tool
- Links to AI-native documentation

### Quick Start

Tell your AI agent:

```
Fetch this Farcaster resource: https://raw.githubusercontent.com/ZeniLabs/FarcasterForAgents/main/llms.txt
```

## What's Included

| Skill | Purpose |
|-------|---------|
| [neynar](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/neynar/SKILL.md) | Core Farcaster API — post, read, search, react |
| [clawcaster](https://clawcaster.com/skill.md) | Create Farcaster accounts for agents (gas-free) |
| [farcaster-agent](https://github.com/rishavmukherji/farcaster-agent) | Full autonomous toolkit with key management |
| [clanker](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/clanker/SKILL.md) | Launch tokens with instant Uniswap liquidity |
| [onchainkit](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/onchainkit/SKILL.md) | Build Frames and Mini Apps |
| [qrcoin](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/qrcoin/SKILL.md) | QR code auctions (Farcaster-native Mini App) |
| [streme](https://www.clawhub.com/clawrencestreme/streme-launcher) | Launch streaming tokens with staking rewards |

## Structure

```
FarcasterForAgents/
├── llms.txt              # AI entry point — fetch this
├── registry.json         # Machine-readable skill index
├── README.md             # You are here
└── skills/
    └── TEMPLATE/         # Template for contributing local skills
```

## Contributing

We accept skills that are **Farcaster-native**:
- Deployed or triggered via Farcaster (tagging @clanker, @streme, etc.)
- Uses Farcaster identity or social graph
- Built primarily for the Farcaster community (Mini Apps, channels)

### Add an External Skill

For skills with a SKILL.md hosted elsewhere:

1. Fork this repo
2. Add entry to `registry.json`:
```json
{
  "name": "skill-name",
  "description": "What it does. When to use it.",
  "source": "external",
  "repo": "owner/repo",
  "path": "skill-folder",
  "skill_file": "SKILL.md",
  "tags": ["farcaster", "relevant", "tags"],
  "maintainer": "maintainer-name"
}
```
3. Add to `llms.txt` under "Available Skills"
4. Submit PR with a clear description of why this skill belongs

### Add a Local Skill

For Farcaster tools without a skill file elsewhere:

1. Fork this repo
2. Create `skills/your-skill/SKILL.md` using the [template](./skills/TEMPLATE/SKILL.md)
3. Add to `registry.json` with `"source": "local"`
4. Add to `llms.txt`
5. Submit PR

### What We Don't Accept

- General crypto/web3 tools that aren't Farcaster-specific
- Platforms that happen to share users with Farcaster but operate independently
- Skills without clear documentation

## Resources

| Resource | Description |
|----------|-------------|
| [Mini Apps docs](https://miniapps.farcaster.xyz/llms-full.txt) | AI-native Frame/Mini App documentation |
| [Neynar docs](https://docs.neynar.com/llms-full.txt) | Full Neynar API reference |
| [GM Farcaster](https://gmfarcaster.com) | Farcaster news — ask @warpee.eth for updates |

## License

MIT
