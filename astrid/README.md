# AstridOS Capsule Integration Design for DealBot

This directory contains the conceptual manifests and configurations to bundle and run **BuyerBot** and **SellerBot** as sandboxed process capsules under **AstridOS**—the agentic WebAssembly kernel.

## Why AstridOS?

AI agents executing financial strategies or P2P swaps need to be strictly sandboxed. AstridOS solves this by running each bot in an isolated WebAssembly capsule. Instead of giving agents full access to the host machine or unchecked network capabilities, AstridOS enforces **Capability-Based Security**.

By packing BuyerBot and SellerBot into capsules:
1. **Private Key Safety**: The wallet private keys are locked inside the agent capsule. The host machine or other capsules cannot read them.
2. **Network Isolation**: The agents can *only* open sockets to Unicity Testnet v2 gateway endpoints and designated Nostr relays. They cannot exfiltrate data to arbitrary servers.
3. **Budget Guards**: Financial boundaries (e.g. max price, maximum trade volumes) are specified in the manifest, preventing LLMs or logical bugs from draining agent wallets.
4. **Immutable Audit Trails**: The capsule logs every message exchange and transaction proposal directly to the AstridOS Kernel's tamper-proof audit log.

---

## Capsule Manifest Structure

Each capsule is configured via a `Capsule.toml` file that specifies its package metadata, executable entry point, imports/exports tables, and declared capabilities.

### 1. Root Orchestrator capsule
Defines the overall workspace capsule configuration.
- Located at [astrid/Capsule.toml](file:///d:/Gen%20ICT/astrid/Capsule.toml)

### 2. BuyerBot Capsule
Locks down the buyer bot's runtime, networking, and token spend policies.
- Located at [astrid/buyer-bot-capsule/Capsule.toml](file:///d:/Gen%20ICT/astrid/buyer-bot-capsule/Capsule.toml)

### 3. SellerBot Capsule
Locks down the seller bot's runtime and token spend policies.
- Located at [astrid/seller-bot-capsule/Capsule.toml](file:///d:/Gen%20ICT/astrid/seller-bot-capsule/Capsule.toml)

---

## How to Build and Deploy on AstridOS (Conceptual Roadmap)

1. **Install Astrid Capsule-Forge Tools**:
   ```bash
   npm install -g @unicity-astrid/capsule-forge
   ```

2. **Compile Agents to WebAssembly**:
   Build the TypeScript code into a WASI-compliant WebAssembly target:
   ```bash
   capsule-forge build --target wasm32-wasi
   ```

3. **Validate Capabilities**:
   Ensure the capsule permissions match the security criteria:
   ```bash
   capsule-forge verify ./buyer-bot-capsule/Capsule.toml
   ```

4. **Launch inside the AstridOS Sandbox**:
   Load the compiled capsules into the AstridOS runtime environment:
   ```bash
   astrid run --capsule ./dist/buyer-bot.capsule
   ```
