# DealBot Builder Program Submission

## Short description
DealBot is an autonomous P2P negotiation and atomic swap settlement platform on Unicity Testnet v2. Utilizing the Sphere SDK, BuyerBot and SellerBot publish trading intentions, discover counterparties, negotiate pricing over Nostr direct messages, and settle trustlessly via escrow contracts.

---

## Track
*   **Primary Track**: Autonomous Agents
*   **Secondary Track**: Payments and Markets

---

## Is it agentic?
Yes. Humans only define goal parameters once (e.g. maximum budget for buyer, minimum floor price for seller, quantity, and negotiation strategy). Once started, the bots act fully autonomously: they post intents, perform counterparty search, carry out game-theoretic rounds of DMs to converge to an agreed price, and call L3 escrow contracts to execute swaps without any human intervention or manual approvals.

---

## Does it run on AstridOS?
DealBot is designed to be **AstridOS-ready**. We have implemented the complete adapter abstraction (`UnicityAdapter`) and provided the full capsule specification files under `/astrid` (`Capsule.toml` manifests for both bots). These define security restrictions limiting network access solely to Unicity/Nostr servers, restricting file paths, and declaring strict token expenditure limits (guards). 

---

## Sphere primitives used
*   **Wallet Identity**: Derives wallet keys and identities.
*   **Nametag Registry**: Resolves human-readable names (`@BuyerBot`) to DIRECT addresses.
*   **Market Module**: Submits signed trade intents (`postIntent`) and runs matches (`search`).
*   **Communications Module**: Exchanges Nostr-encrypted direct messages (`sendDM`, `onDirectMessage`).
*   **Swap Module (Escrow)**: Deploys and manages atomic escrow contracts (`proposeSwap`, `acceptSwap`).

---

## Run instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Pre-seed database with mock deals
```bash
npm run seed
```

### 3. Start Next.js dashboard
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Run background agents worker
```bash
npm run agents
```

### 5. Run test suite
```bash
npm run test
```

---

## Demo script
1.  **Start Dashboard**: Launch the dashboard with `npm run dev` and navigate to the dashboard tab.
2.  **Toggle Mode**: Choose between **Simulation fallback** (out-of-the-box demo) or **Testnet v2 (Live SDK)**.
3.  **Configure Agents**: Adjust starting prices, floors, strategies (conservative vs. aggressive), and maximum rounds on the configuration forms.
4.  **Launch bots**: Click **Start Agents**.
5.  **Observe Telemetry**:
    *   Watch the **Intent Board** dynamically update with active buy/sell bulletin listings.
    *   Follow the step-by-step telemetry on the **Live Agent Timeline**.
    *   Read the actual Nostr DM exchange in the **Negotiation Transcript** bubbles.
    *   Review the final agreed midpoint price and transaction hashes on the **Swap Settlement Card**.
6.  **Historical logs**: Click on entries in the **History Logs** sidebar to inspect past negotiations.
