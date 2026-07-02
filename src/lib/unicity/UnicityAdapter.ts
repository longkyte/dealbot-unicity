import { AgentIdentity, Intent, NegotiationMessage, SettlementResult } from "./types.js";

export interface UnicityAdapter {
  createOrLoadAgentIdentity(name: string, mnemonic?: string): Promise<AgentIdentity>;
  createOrLoadWallet(agent: AgentIdentity): Promise<void>;
  postIntent(intent: Intent): Promise<Intent>;
  searchMatchingIntents(intent: Intent): Promise<Intent[]>;
  sendDirectMessage(message: NegotiationMessage): Promise<void>;
  readDirectMessages(agent: AgentIdentity): Promise<NegotiationMessage[]>;
  createEscrowOrAtomicSwap(params: {
    buyer: AgentIdentity;
    seller: AgentIdentity;
    asset: string;
    quantity: number;
    finalPrice: number;
  }): Promise<SettlementResult>;
  validateSettlement(result: SettlementResult): Promise<SettlementResult>;
}
