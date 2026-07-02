import { DealStore } from "../lib/storage/store.js";
import { LocalSimulationAdapter } from "../lib/unicity/LocalSimulationAdapter.js";
import { SphereSdkAdapter } from "../lib/unicity/SphereSdkAdapter.js";
import { UnicityAdapter } from "../lib/unicity/UnicityAdapter.js";
import { BuyerBot, BuyerPolicy } from "./BuyerBot.js";
import { DealRecord, NegotiationEngine } from "./NegotiationEngine.js";
import { SellerBot, SellerPolicy } from "./SellerBot.js";

export class AgentRunner {
  public static async run(
    buyerPolicy: BuyerPolicy,
    sellerPolicy: SellerPolicy,
    isSimulation: boolean = true,
    dealId?: string
  ): Promise<DealRecord> {
    // Select the adapter: either simulated or live Sphere SDK
    const adapter: UnicityAdapter = isSimulation
      ? new LocalSimulationAdapter()
      : new SphereSdkAdapter();

    const buyer = new BuyerBot(buyerPolicy);
    const seller = new SellerBot(sellerPolicy);

    // Initial setup of placeholder identities
    buyer.identity = { nametag: "@BuyerBot", mnemonic: process.env.UNICITY_MNEMONIC };
    seller.identity = { nametag: "@SellerBot" };

    const engine = new NegotiationEngine(adapter, buyer, seller, dealId, (state: DealRecord) => {
      // Callback persists state changes in real time for dashboard UI monitoring
      DealStore.saveDeal(state);
    });

    // Run the negotiation and persist the final outcome
    const result = await engine.runNegotiation();
    DealStore.saveDeal(result);
    return result;
  }
}
