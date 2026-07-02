import { AgentIdentity, Intent, NegotiationMessage, SettlementResult } from "./types.js";
import { UnicityAdapter } from "./UnicityAdapter.js";

export class LocalSimulationAdapter implements UnicityAdapter {
  private static intents: Intent[] = [];
  private static messages: NegotiationMessage[] = [];
  private static settlements: Map<string, SettlementResult> = new Map();

  async createOrLoadAgentIdentity(name: string, mnemonic?: string): Promise<AgentIdentity> {
    const formattedName = name.startsWith("@") ? name : `@${name}`;
    const cleanName = name.replace("@", "");
    const mockPubKey = "03" + Buffer.from(cleanName.padEnd(32, "x")).toString("hex").substring(0, 62);
    const mockAddress = `DIRECT://${mockPubKey}`;

    return {
      nametag: formattedName,
      publicKey: mockPubKey,
      address: mockAddress,
      mnemonic: mnemonic || "mock mnemonic phrase for local simulation mode runs"
    };
  }

  async createOrLoadWallet(agent: AgentIdentity): Promise<void> {
    // Simulated wallet load is a no-op
    return Promise.resolve();
  }

  async postIntent(intent: Intent): Promise<Intent> {
    const newIntent = {
      ...intent,
      id: intent.id || `intent_${Math.random().toString(36).substring(2, 11)}`,
      signature: `sig_${Math.random().toString(36).substring(2, 11)}`
    };
    LocalSimulationAdapter.intents.push(newIntent);
    return newIntent;
  }

  async searchMatchingIntents(intent: Intent): Promise<Intent[]> {
    // Search for compatible intents: opposite type, same asset, and overlapping prices
    return LocalSimulationAdapter.intents.filter(item => {
      // Exclude self
      if (item.createdBy.nametag === intent.createdBy.nametag) return false;
      // Match asset
      if (item.asset.toLowerCase() !== intent.asset.toLowerCase()) return false;
      // Match opposite type
      if (item.type === intent.type) return false;
      
      // Check price compatibility
      if (intent.type === "buy") {
        // Buyer wants maximum price >= seller's ask price
        return intent.price >= item.price;
      } else {
        // Seller wants minimum price <= buyer's bid price
        return intent.price <= item.price;
      }
    });
  }

  async sendDirectMessage(message: NegotiationMessage): Promise<void> {
    const newMessage = {
      ...message,
      id: message.id || `msg_${Math.random().toString(36).substring(2, 11)}`,
      signature: `sig_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: message.timestamp || new Date().toISOString()
    };
    LocalSimulationAdapter.messages.push(newMessage);
    return Promise.resolve();
  }

  async readDirectMessages(agent: AgentIdentity): Promise<NegotiationMessage[]> {
    const targetTag = agent.nametag;
    return LocalSimulationAdapter.messages.filter(
      msg => msg.to.nametag === targetTag || msg.from.nametag === targetTag
    );
  }

  async createEscrowOrAtomicSwap(params: {
    buyer: AgentIdentity;
    seller: AgentIdentity;
    asset: string;
    quantity: number;
    finalPrice: number;
  }): Promise<SettlementResult> {
    const escrowId = `escrow_${Math.random().toString(36).substring(2, 11)}`;
    const txId = `tx_${Buffer.from(Math.random().toString()).toString("hex").substring(0, 64)}`;
    
    const result: SettlementResult = {
      status: "simulated",
      txId,
      escrowId,
      finalPrice: params.finalPrice
    };
    LocalSimulationAdapter.settlements.set(escrowId, result);
    return result;
  }

  async validateSettlement(result: SettlementResult): Promise<SettlementResult> {
    if (!result.escrowId) {
      return { status: "failed", error: "Missing escrow ID" };
    }
    const record = LocalSimulationAdapter.settlements.get(result.escrowId);
    if (!record) {
      return { status: "failed", error: "Settlement record not found" };
    }
    return {
      ...record,
      status: "completed"
    };
  }

  // Helper to clear the simulation state for unit tests
  static clearState() {
    LocalSimulationAdapter.intents = [];
    LocalSimulationAdapter.messages = [];
    LocalSimulationAdapter.settlements.clear();
  }
}
