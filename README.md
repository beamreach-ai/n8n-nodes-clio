# @beamreach/n8n-nodes-clio

[![npm version](https://img.shields.io/npm/v/@beamreach/n8n-nodes-clio.svg)](https://www.npmjs.com/package/@beamreach/n8n-nodes-clio)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[n8n](https://n8n.io) community node for [Clio](https://www.clio.com) — the legal practice management platform used by 150,000+ law firms worldwide.

Automate contacts, matters, and notes directly from n8n workflows. Connect intake forms, AI classification pipelines, and email systems to Clio without writing API code.

> Built by [Beamreach](https://beamreach.ai/immigration-law-automation.html) — we help immigration law firms automate their client operations with n8n and AI.

---

## Supported operations

| Resource | Operations |
|----------|-----------|
| **Contact** | Create, Get, Get Many, Update |
| **Matter** | Create, Get, Get Many, Update |
| **Note** | Create, Get, Get Many |

---

## Installation

### n8n Cloud / self-hosted

1. Go to **Settings → Community Nodes**
2. Select **Install**
3. Enter `@beamreach/n8n-nodes-clio` and confirm
4. Restart n8n if prompted

### Docker / npm

```bash
npm install @beamreach/n8n-nodes-clio
```

Restart n8n after installing.

---

## Setup

### Step 1 — Create a Clio developer app

1. Go to [developers.clio.com](https://developers.clio.com) (or **Clio → Settings → Developer Portal**)
2. Click **Create an Application**
3. Add your n8n callback URL as a **Redirect URI**:
   ```
   https://your-n8n-host.com/rest/oauth2-credential/callback
   ```
   For local testing: `http://127.0.0.1:5678/rest/oauth2-credential/callback`
   > Clio only accepts HTTPS URIs or `http://127.0.0.1` — `http://localhost` is rejected.
4. Under **Permissions**, enable **Read + Write** for:
   - **Contacts** (includes contact notes)
   - **Matters** (includes matter notes and practice areas)
5. Save and copy your **Client ID** and **Client Secret**

### Step 2 — Add credentials in n8n

1. In n8n → **Credentials → New** → search **Clio OAuth2**
2. Select your **Region**:
   - **North America** — if your Clio URL is `app.clio.com`
   - **Europe** — if your Clio URL is `eu.app.clio.com`
3. Paste your **Client ID** and **Client Secret**
4. Click **Connect my account** — authorize in the Clio popup
5. Done — tokens refresh automatically

---

## Example workflow

This node powers the [Immigration Intake — AI Visa Classification + Clio](https://github.com/beamreach-ai/beamreach-legal-automation-workflows/tree/main/n8n-workflows/immigration-intake) workflow:

```
Intake form → Webhook → GPT-4o (visa classification) → Clio Contact → Clio Matter → Clio Note → Confirmation email
```

Accepts any intake form structure (Typeform, Jotform, custom survey). GPT-4o classifies the visa type and generates a document checklist; everything lands in Clio automatically.

[Download the workflow →](https://github.com/beamreach-ai/beamreach-legal-automation-workflows/tree/main/n8n-workflows/immigration-intake)

---

## Clio API reference

| Resource | Endpoint |
|----------|----------|
| Contacts | `GET/POST /api/v4/contacts.json` |
| Matters | `GET/POST /api/v4/matters.json` |
| Notes | `GET/POST /api/v4/notes.json` |

- North America: `https://app.clio.com/api/v4/`
- Europe: `https://eu.app.clio.com/api/v4/`

Full docs: [app.clio.com/api/v4/documentation](https://app.clio.com/api/v4/documentation)

---

## Development

```bash
git clone https://github.com/beamreach-ai/n8n-nodes-clio
cd n8n-nodes-clio
npm install
npm run build
```

To test locally, link into your n8n instance:

```bash
npm link
# in your n8n directory:
npm link @beamreach/n8n-nodes-clio
```

Restart n8n — the Clio node appears in the node list.

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

We build legal automation systems for immigration law firms. If you want this deployed for your firm — custom intake forms, Clio integration, AI-powered case routing — [book a call](https://beamreach.ai/immigration-law-automation.html).
