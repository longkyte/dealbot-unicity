import { describe, it, expect, beforeEach } from "vitest";
import { BuyerBot, BuyerPolicy } from "../src/agents/BuyerBot.js";
import { SellerBot, SellerPolicy } from "../src/agents/SellerBot.js";
import { LocalSimulationAdapter } from "../src/lib/unicity/LocalSimulationAdapter.js";
import { NegotiationEngine } from "../src/agents/NegotiationEngine.js";

describe("Agent Negotiation Strategy & Bounds", () => {
  beforeEach(() => {
    LocalSimulationAdapter.clearState();
  });

  it("should ensure Buyer never bids above maxPrice", () => {
    const policy: BuyerPolicy = {
      assetWanted: "UCT",
      quantity: 10,
      maxPrice: 5.0,
      initialBid: 4.8,
      stepSize: 0.1, // 10% steps
      maxRounds: 5,
      timeoutMs: 30000,
      strategy: "aggressive"
    };

    const buyer = new BuyerBot(policy);
    buyer.setIdentity({ nametag: "@Buyer" });

    // Round 1
    let bid = buyer.calculateOffer(6.0, 1);
    expect(bid).toBeLessThanOrEqual(5.0);

    // Round 2, counteroffer with seller ask higher than limit
    bid = buyer.calculateOffer(5.8, 2);
    expect(bid).toBe(5.0);

    // Round 3, should stay capped
    bid = buyer.calculateOffer(5.5, 3);
    expect(bid).toBe(5.0);
  });

  it("should ensure Seller never asks below minPrice", () => {
    const policy: SellerPolicy = {
      assetOffered: "UCT",
      quantity: 10,
      minPrice: 6.0,
      initialAsk: 6.2,
      stepSize: 0.1,
      maxRounds: 5,
      timeoutMs: 30000,
      strategy: "aggressive"
    };

    const seller = new SellerBot(policy);
    seller.setIdentity({ nametag: "@Seller" });

    // Round 1
    let ask = seller.calculateOffer(4.0, 1);
    expect(ask).toBeGreaterThanOrEqual(6.0);

    // Round 2
    ask = seller.calculateOffer(4.5, 2);
    expect(ask).toBe(6.0);

    // Round 3
    ask = seller.calculateOffer(5.5, 3);
    expect(ask).toBe(6.0);
  });

  it("should succeed when pricing ranges overlap", async () => {
    const buyerPolicy: BuyerPolicy = {
      assetWanted: "UCT",
      quantity: 10,
      maxPrice: 6.0,
      initialBid: 4.0,
      stepSize: 0.05,
      maxRounds: 10,
      timeoutMs: 30000,
      strategy: "normal"
    };

    const sellerPolicy: SellerPolicy = {
      assetOffered: "UCT",
      quantity: 10,
      minPrice: 5.0,
      initialAsk: 7.0,
      stepSize: 0.05,
      maxRounds: 10,
      timeoutMs: 30000,
      strategy: "normal"
    };

    const adapter = new LocalSimulationAdapter();
    const buyer = new BuyerBot(buyerPolicy);
    const seller = new SellerBot(sellerPolicy);

    const engine = new NegotiationEngine(adapter, buyer, seller);
    const result = await engine.runNegotiation();

    expect(result.status).toBe("completed");
    expect(result.settlementStatus).toBe("completed");
    expect(result.finalPrice).toBeGreaterThanOrEqual(5.0);
    expect(result.finalPrice).toBeLessThanOrEqual(6.0);
    expect(result.txId).toBeDefined();
    expect(result.transcript.length).toBeGreaterThan(0);
  });

  it("should fail when pricing ranges do not overlap", async () => {
    const buyerPolicy: BuyerPolicy = {
      assetWanted: "UCT",
      quantity: 10,
      maxPrice: 4.0, // max budget 4.0
      initialBid: 3.0,
      stepSize: 0.05,
      maxRounds: 5,
      timeoutMs: 30000,
      strategy: "normal"
    };

    const sellerPolicy: SellerPolicy = {
      assetOffered: "UCT",
      quantity: 10,
      minPrice: 5.0, // min floor 5.0
      initialAsk: 6.0,
      stepSize: 0.05,
      maxRounds: 5,
      timeoutMs: 30000,
      strategy: "normal"
    };

    const adapter = new LocalSimulationAdapter();
    const buyer = new BuyerBot(buyerPolicy);
    const seller = new SellerBot(sellerPolicy);

    const engine = new NegotiationEngine(adapter, buyer, seller);
    const result = await engine.runNegotiation();

    expect(result.status).toBe("failed");
    expect(result.settlementStatus).toBe("failed");
    expect(result.finalPrice).toBeUndefined();
    expect(result.txId).toBeUndefined();
  });
});
