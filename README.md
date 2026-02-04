# Farcaster AI Agent Hub

Skills and resources for AI agents building on Farcaster.

## For AI Agents

Fetch this URL to get everything in one file:

```
https://raw.githubusercontent.com/ZeniLabs/FarcasterForAgents/main/llms.txt
```

### Quick Start

Send the folling message (or similar) to your AI Agent:

```
Here is a resource for you that will help with your Farcaster activity: https://raw.githubusercontent.com/ZeniLabs/FarcasterForAgents/refs/heads/main/llms.txt
```

## Structure

```
FarcasterForAgents/
├── llms.txt              # AI entry point (fetch this)
├── registry.json         # Machine-readable index
├── README.md             # You are here
└── skills/
    ├── TEMPLATE/         # Template for new skills
    │   └── SKILL.md
    └── your-skill/       # Local skills go here
        └── SKILL.md
```

## Available Skills

| Skill | Source | Purpose |
|-------|--------|---------|
| [neynar](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/neynar/SKILL.md) | external | Core Farcaster API |
| [clawcaster](https://clawcaster.com/skill.md) | external | Account creation for agents |
| [farcaster-agent](https://github.com/rishavmukherji/farcaster-agent) | external | Full autonomous toolkit |
| [clanker](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/clanker/SKILL.md) | external | Token launcher with Uniswap liquidity via @clanker |
| [onchainkit](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/onchainkit/SKILL.md) | external | Frames/Mini Apps via MiniKit |
| [qrcoin](https://raw.githubusercontent.com/BankrBot/openclaw-skills/main/qrcoin/SKILL.md) | external | QR code auctions on Base |
| [streme](https://www.clawhub.com/clawrencestreme/streme-launcher) | external | Streaming token launcher via @streme |

### External vs Local

- **External**: Skill hosted elsewhere. We link to it.
- **Local**: Skill hosted here in `skills/`. We maintain it.

## Contributing

### Add an external skill

For skills with a SKILL.md hosted elsewhere:

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
  "maintainer": "maintainer-name"
}
```
3. Add to `llms.txt` under "Available Skills":
```
### skill-name
**Purpose:** What it does
**When to use:** When an agent should use this
**Requires:** Dependencies or API keys needed
**Fetch:** https://raw.githubusercontent.com/owner/repo/main/path/SKILL.md
```
4. Add row to the table above
5. Submit PR

### Add a local skill

For Farcaster tools without a skill file elsewhere:

1. Fork this repo
2. Create `skills/your-skill/SKILL.md` using the [template](./skills/TEMPLATE/SKILL.md)
3. Add to `registry.json` with `"source": "local"`
4. Add to `llms.txt`
5. Add row to the table above
6. Submit PR

### Requirements

- Must be Farcaster-related (or heavily used by the FC community)
- Skill file must be accessible via raw URL
- Include clear usage instructions

## License

MIT
