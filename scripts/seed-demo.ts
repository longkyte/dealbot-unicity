import { DealStore } from "../src/lib/storage/store.js";
import { DealRecord } from "../src/agents/NegotiationEngine.js";
import { ConsoleLogger } from "../src/lib/utils/logger.js";

async function main() {
  ConsoleLogger.info("Seed", "Seeding database with demo deal history...");

  DealStore.clearStore();

  const mockDeal1: DealRecord = {
    id: "deal_demo_success",
    status: "completed",
    buyer: {
      nametag: "@NexusBuyer",
      publicKey: "03a111111111111111111111111111111111111111111111111111111111111111",
      address: "DIRECT://03a111111111111111111111111111111111111111111111111111111111111111"
    },
    seller: {
      nametag: "@AtlasSeller",
      publicKey: "03b222222222222222222222222222222222222222222222222222222222222222",
      address: "DIRECT://03b222222222222222222222222222222222222222222222222222222222222222"
    },
    asset: "UCT",
    quantity: 50,
    initialBid: 4.0,
    initialAsk: 6.0,
    maxPrice: 5.5,
    minPrice: 4.5,
    finalPrice: 5.0,
    settlementStatus: "completed",
    txId: "tx_018cf41f87b295cda2c1ef4a87ad92b23a789c19b02fcabde8aef172bdaef1d92a",
    escrowId: "escrow_demo_success",
    timeline: [
      { time: "2026-07-02T08:00:00.000Z", event: "Initializing agent wallets and identities...", type: "init" },
      { time: "2026-07-02T08:00:01.000Z", event: "Agent wallets loaded. Posting signed intents...", type: "intent" },
      { time: "2026-07-02T08:00:02.000Z", event: "Buyer posted intent to buy 50 UCT at max 5.5", type: "intent" },
      { time: "2026-07-02T08:00:03.000Z", event: "Seller posted intent to sell 50 UCT at min 4.5", type: "intent" },
      { time: "2026-07-02T08:00:04.000Z", event: "Discovery completed: counterparty discovered.", type: "discovery" },
      { time: "2026-07-02T08:00:05.000Z", event: "--- Negotiation Round 1 ---", type: "round" },
      { time: "2026-07-02T08:00:06.000Z", event: "Buyer: Sent initial bid of 4.0", type: "dm" },
      { time: "2026-07-02T08:00:07.000Z", event: "Seller: Sent initial ask of 6.0", type: "dm" },
      { time: "2026-07-02T08:00:08.000Z", event: "--- Negotiation Round 2 ---", type: "round" },
      { time: "2026-07-02T08:00:09.000Z", event: "Buyer: Raised bid to 4.4", type: "dm" },
      { time: "2026-07-02T08:00:10.000Z", event: "Seller: Decreased ask to 5.6", type: "dm" },
      { time: "2026-07-02T08:00:11.000Z", event: "--- Negotiation Round 3 ---", type: "round" },
      { time: "2026-07-02T08:00:12.000Z", event: "Buyer: Raised bid to 4.8", type: "dm" },
      { time: "2026-07-02T08:00:13.000Z", event: "Seller: Decreased ask to 5.2", type: "dm" },
      { time: "2026-07-02T08:00:14.000Z", event: "--- Negotiation Round 4 ---", type: "round" },
      { time: "2026-07-02T08:00:15.000Z", event: "Buyer: Raised bid to 5.0", type: "dm" },
      { time: "2026-07-02T08:00:16.000Z", event: "Seller ask (5.2) meets buyer bid (5.0) within margin. Agreement reached!", type: "agreement" },
      { time: "2026-07-02T08:00:17.000Z", event: "Price agreed: 5.0 UCT. Executing atomic swap...", type: "settlement_start" },
      { time: "2026-07-02T08:00:18.000Z", event: "Escrow contract deployed. Submitting transaction to Testnet v2...", type: "settlement_pending" },
      { time: "2026-07-02T08:00:20.000Z", event: "Settlement successfully verified! Transaction ID: tx_018cf41f87b295cda2c1ef4a87ad92b23a789c19b02fcabde8aef172bdaef1d92a", type: "success" }
    ],
    transcript: [
      {
        id: "msg_b_1",
        from: { nametag: "@NexusBuyer" },
        to: { nametag: "@AtlasSeller" },
        round: 1,
        kind: "offer",
        price: 4.0,
        text: "I offer 4.0 per unit for 50 UCT.",
        timestamp: "2026-07-02T08:00:06.000Z"
      },
      {
        id: "msg_s_1",
        from: { nametag: "@AtlasSeller" },
        to: { nametag: "@NexusBuyer" },
        round: 1,
        kind: "offer",
        price: 6.0,
        text: "I ask 6.0 per unit for 50 UCT.",
        timestamp: "2026-07-02T08:00:07.000Z"
      },
      {
        id: "msg_b_2",
        from: { nametag: "@NexusBuyer" },
        to: { nametag: "@AtlasSeller" },
        round: 2,
        kind: "counteroffer",
        price: 4.4,
        text: "I can increase my bid to 4.4.",
        timestamp: "2026-07-02T08:00:09.000Z"
      },
      {
        id: "msg_s_2",
        from: { nametag: "@AtlasSeller" },
        to: { nametag: "@NexusBuyer" },
        round: 2,
        kind: "counteroffer",
        price: 5.6,
        text: "I can lower my ask to 5.6.",
        timestamp: "2026-07-02T08:00:10.000Z"
      },
      {
        id: "msg_b_3",
        from: { nametag: "@NexusBuyer" },
        to: { nametag: "@AtlasSeller" },
        round: 3,
        kind: "counteroffer",
        price: 4.8,
        text: "Let's do 4.8. That is close.",
        timestamp: "2026-07-02T08:00:12.000Z"
      },
      {
        id: "msg_s_3",
        from: { nametag: "@AtlasSeller" },
        to: { nametag: "@NexusBuyer" },
        round: 3,
        kind: "counteroffer",
        price: 5.2,
        text: "My counteroffer is 5.2.",
        timestamp: "2026-07-02T08:00:13.000Z"
      },
      {
        id: "msg_b_4",
        from: { nametag: "@NexusBuyer" },
        to: { nametag: "@AtlasSeller" },
        round: 4,
        kind: "counteroffer",
        price: 5.0,
        text: "I offer 5.0. Midpoint of our bounds.",
        timestamp: "2026-07-02T08:00:15.000Z"
      }
    ]
  };

  const mockDeal2: DealRecord = {
    id: "deal_demo_failed",
    status: "failed",
    buyer: {
      nametag: "@ConservativeBuyer",
      publicKey: "03c333333333333333333333333333333333333333333333333333333333333333",
      address: "DIRECT://03c333333333333333333333333333333333333333333333333333333333333333"
    },
    seller: {
      nametag: "@GreedySeller",
      publicKey: "03d444444444444444444444444444444444444444444444444444444444444444",
      address: "DIRECT://03d444444444444444444444444444444444444444444444444444444444444444"
    },
    asset: "UCT",
    quantity: 10,
    initialBid: 2.0,
    initialAsk: 8.0,
    maxPrice: 3.0,
    minPrice: 7.0,
    settlementStatus: "failed",
    timeline: [
      { time: "2026-07-02T08:10:00.000Z", event: "Initializing agent wallets...", type: "init" },
      { time: "2026-07-02T08:10:01.000Z", event: "Wallets ready. Posting intents...", type: "intent" },
      { time: "2026-07-02T08:10:02.000Z", event: "Discovery check: counterparty found.", type: "discovery" },
      { time: "2026-07-02T08:10:03.000Z", event: "--- Negotiation Round 1 ---", type: "round" },
      { time: "2026-07-02T08:10:04.000Z", event: "Buyer: Offered 2.0", type: "dm" },
      { time: "2026-07-02T08:10:05.000Z", event: "Seller: Asked 8.0", type: "dm" },
      { time: "2026-07-02T08:10:06.000Z", event: "--- Negotiation Round 2 ---", type: "round" },
      { time: "2026-07-02T08:10:07.000Z", event: "Buyer: Offered 2.5", type: "dm" },
      { time: "2026-07-02T08:10:08.000Z", event: "Seller: Asked 7.5", type: "dm" },
      { time: "2026-07-02T08:10:09.000Z", event: "--- Negotiation Round 3 ---", type: "round" },
      { time: "2026-07-02T08:10:10.000Z", event: "Buyer: Calculated bid 3.0 (Capped at Max Price 3.0)", type: "dm" },
      { time: "2026-07-02T08:10:11.000Z", event: "Seller: Calculated ask 7.0 (Capped at Min Price 7.0)", type: "dm" },
      { time: "2026-07-02T08:10:12.000Z", event: "Limits reached without convergence (Buyer bid 3.0 < Seller ask 7.0).", type: "fail" },
      { time: "2026-07-02T08:10:13.000Z", event: "Negotiation terminated. Deal failed.", type: "fail" }
    ],
    transcript: [
      {
        id: "msg_bf_1",
        from: { nametag: "@ConservativeBuyer" },
        to: { nametag: "@GreedySeller" },
        round: 1,
        kind: "offer",
        price: 2.0,
        text: "I offer 2.0 per unit.",
        timestamp: "2026-07-02T08:10:04.000Z"
      },
      {
        id: "msg_sf_1",
        from: { nametag: "@GreedySeller" },
        to: { nametag: "@ConservativeBuyer" },
        round: 1,
        kind: "offer",
        price: 8.0,
        text: "I ask 8.0 per unit.",
        timestamp: "2026-07-02T08:10:05.000Z"
      },
      {
        id: "msg_bf_2",
        from: { nametag: "@ConservativeBuyer" },
        to: { nametag: "@GreedySeller" },
        round: 2,
        kind: "counteroffer",
        price: 2.5,
        text: "I can increase to 2.5.",
        timestamp: "2026-07-02T08:10:07.000Z"
      },
      {
        id: "msg_sf_2",
        from: { nametag: "@GreedySeller" },
        to: { nametag: "@ConservativeBuyer" },
        round: 2,
        kind: "counteroffer",
        price: 7.5,
        text: "I can decrease to 7.5.",
        timestamp: "2026-07-02T08:10:08.000Z"
      },
      {
        id: "msg_bf_3",
        from: { nametag: "@ConservativeBuyer" },
        to: { nametag: "@GreedySeller" },
        round: 3,
        kind: "counteroffer",
        price: 3.0,
        text: "My final maximum offer is 3.0.",
        timestamp: "2026-07-02T08:10:10.000Z"
      },
      {
        id: "msg_sf_3",
        from: { nametag: "@GreedySeller" },
        to: { nametag: "@ConservativeBuyer" },
        round: 3,
        kind: "counteroffer",
        price: 7.0,
        text: "My final minimum ask is 7.0.",
        timestamp: "2026-07-02T08:10:11.000Z"
      }
    ]
  };

  DealStore.saveDeal(mockDeal1);
  DealStore.saveDeal(mockDeal2);

  ConsoleLogger.success("Seed", "Seeding complete! 2 demo deals added to db.json.");
}

main().catch(console.error);
