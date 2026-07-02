import { describe, it, expect, beforeEach } from "vitest";
import { AgentRunner } from "../src/agents/AgentRunner.js";
import { BuyerPolicy } from "../src/agents/BuyerBot.js";
import { SellerPolicy } from "../src/agents/SellerBot.js";
import { LocalSimulationAdapter } from "../src/lib/unicity/LocalSimulationAdapter.js";
import { DealStore } from "../src/lib/storage/store.js";

describe("DealBot AgentRunner E2E Simulation", () => {
  beforeEach(() => {
    LocalSimulationAdapter.clearState();
    DealStore.clearStore();
  });

  it("should run complete negotiation and save record to DealStore", async () => {
    const buyerPolicy: BuyerPolicy = {
      assetWanted: "USDU",
      quantity: 5,
      maxPrice: 10.0,
      initialBid: 8.0,
      stepSize: 0.05,
      maxRounds: 5,
      timeoutMs: 30000,
      strategy: "normal"
    };

    const sellerPolicy: SellerPolicy = {
      assetOffered: "USDU",
      quantity: 5,
      minPrice: 9.0,
      initialAsk: 11.0,
      stepSize: 0.05,
      maxRounds: 5,
      timeoutMs: 30000,
      strategy: "normal"
    };

    const result = await AgentRunner.run(buyerPolicy, sellerPolicy, true, "deal_test_runner");

    expect(result.id).toBe("deal_test_runner");
    expect(result.status).toBe("completed");
    expect(result.settlementStatus).toBe("completed");
    expect(result.asset).toBe("USDU");
    expect(result.quantity).toBe(5);
    expect(result.finalPrice).toBeDefined();

    // Verify DealStore persistence
    const saved = DealStore.getDeal("deal_test_runner");
    expect(saved).toBeDefined();
    expect(saved?.status).toBe("completed");
    expect(saved?.timeline.length).toBeGreaterThan(0);
    expect(saved?.transcript.length).toBeGreaterThan(0);
  });
});
