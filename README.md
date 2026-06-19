# n8n-nodes-clio

[![npm version](https://img.shields.io/npm/v/n8n-nodes-clio.svg)](https://www.npmjs.com/package/n8n-nodes-clio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[n8n](https://n8n.io) community node for [Clio](https://www.clio.com) — the legal practice management platform used by 150,000+ law firms worldwide.

This node lets you automate contacts, matters, and notes directly from n8n workflows.
No more manual data entry: connect your intake forms, AI classification pipelines, and email systems to Clio in a single workflow.

> Built by [Beamreach](https://beamreach.ai/immigration-law-automation.html) — we help immigration law firms automate their client operations with n8n and AI.

---

## Supported operations

| Resource | Operations |
|----------|-----------|
| **Contact** | Create, Get, Get Many, Update |
| **Matter** | Create, Get, Get Many, Update |
| **Note** | Create, Get, Get Many |

### Authentication

- **OAuth2** (recommended for production) — Clio's standard OAuth2 authorization code flow
- **API Key** — for quick testing and server-to-server integrations

---

## Installation

### n8n Cloud / self-hosted (recommended)

1. Go to **Settings → Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-clio` and confirm

### npm (local or Docker)

```bash
npm install n8n-nodes-clio
```

Then restart n8n.

---

## Setup

### 1. Create a Clio app (OAuth2)

1. Log in to Clio → **Settings → API Keys → Developer Portal**
2. Click **Create an Application**
3. Set the redirect URI to your n8n OAuth callback:
   ```
   https://your-n8n-host.com/rest/oauth2-credential/callback
   ```
4. Copy your **Client ID** and **Client Secret**

### 2. Add credentials in n8n

1. In n8n, go to **Credentials → New**
2. Search for **Clio OAuth2**
3. Paste your Client ID and Client Secret
4. Click **Connect** — you'll be redirected to Clio to authorize
5. Done — the node will automatically refresh tokens

### API Key alternative

1. In Clio → **Settings → API Keys** → generate a key
2. In n8n credentials, choose **Clio API Key** and paste the key

---

## Example: Immigration intake workflow

This node powers the [Immigration Intake — AI Visa Classification + Clio](https://github.com/beamreach/beamreach-legal-automation-workflows) workflow:

```
Webhook → OpenAI (visa classification) → Clio Contact → Clio Matter → Clio Note → Email
```

The workflow accepts any intake form structure (Typeform, Jotform, custom survey), runs GPT-4o to classify the visa type and generate a document checklist, then creates everything in Clio automatically.

[Download the workflow →](https://github.com/beamreach/beamreach-legal-automation-workflows/tree/main/n8n-workflows/immigration-intake)

---

## Clio API reference

| Resource | Clio API v4 endpoint |
|----------|---------------------|
| Contacts | `GET/POST /api/v4/contacts.json` |
| Matters | `GET/POST /api/v4/matters.json` |
| Notes | `GET/POST /api/v4/notes.json` |

Full documentation: [app.clio.com/api/v4/documentation](https://app.clio.com/api/v4/documentation)

---

## Development

```bash
git clone https://github.com/beamreach/n8n-nodes-clio
cd n8n-nodes-clio
npm install
npm run build
```

To test locally with n8n:

```bash
# In the n8n-nodes-clio directory
npm link

# In your n8n installation directory
npm link n8n-nodes-clio
```

Then restart n8n — the Clio node will appear in the node list.

---

## Roadmap

- [ ] Document (upload / list)
- [ ] Task (create / complete)
- [ ] Calendar entry
- [ ] Bill / Invoice (read)
- [ ] Trigger nodes (webhook-based real-time updates)

PRs welcome.

---

## License

MIT © [Beamreach](https://beamreach.ai)

---

## About Beamreach

We build legal automation systems for immigration law firms. If you want this set up for your firm — including custom intake forms, Clio integration, and AI-powered case routing — [book a call](https://beamreach.ai/immigration-law-automation.html).
