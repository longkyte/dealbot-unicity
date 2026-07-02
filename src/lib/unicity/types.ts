export interface AgentIdentity {
  nametag: string;
  publicKey?: string;
  address?: string;
  mnemonic?: string; // Optional: seed phrase for loading agent wallets in CLI
}

export interface Intent {
  id: string;
  type: "buy" | "sell";
  asset: string;
  quantity: number;
  price: number;
  createdBy: AgentIdentity;
  expiresAt: string;
  signature?: string;
}

export interface NegotiationMessage {
  id: string;
  from: AgentIdentity;
  to: AgentIdentity;
  intentId?: string;
  round: number;
  kind: "offer" | "counteroffer" | "accept" | "reject" | "settlement";
  price?: number;
  text: string;
  timestamp: string;
  signature?: string;
}

export interface SettlementResult {
  status: "pending" | "completed" | "failed" | "simulated";
  txId?: string;
  escrowId?: string;
  error?: string;
  finalPrice?: number;
}
