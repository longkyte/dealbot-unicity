import { UnicityAdapter } from "../lib/unicity/UnicityAdapter.js";
import { AgentIdentity, Intent, NegotiationMessage, SettlementResult } from "../lib/unicity/types.js";
import { BuyerBot } from "./BuyerBot.js";
import { SellerBot } from "./SellerBot.js";

export interface DealRecord {
  id: string;
  status: "active" | "completed" | "failed";
  buyer: AgentIdentity;
  seller: AgentIdentity;
  asset: string;
  quantity: number;
  initialBid: number;
  initialAsk: number;
  maxPrice: number;
  minPrice: number;
  finalPrice?: number;
  settlementStatus: SettlementResult["status"];
  txId?: string;
  escrowId?: string;
  timeline: { time: string; event: string; type: string }[];
  transcript: NegotiationMessage[];
}

export class NegotiationEngine {
  private adapter: UnicityAdapter;
  private buyerBot: BuyerBot;
  private sellerBot: SellerBot;
  private dealRecord: DealRecord;
  private onStateChange?: (deal: DealRecord) => void;

  constructor(
    adapter: UnicityAdapter,
    buyerBot: BuyerBot,
    sellerBot: SellerBot,
    dealId?: string,
    onStateChange?: (deal: DealRecord) => void
  ) {
    this.adapter = adapter;
    this.buyerBot = buyerBot;
    this.sellerBot = sellerBot;
    this.onStateChange = onStateChange;

    this.dealRecord = {
      id: dealId || `deal_${Math.random().toString(36).substring(2, 11)}`,
      status: "active",
      buyer: {} as AgentIdentity,
      seller: {} as AgentIdentity,
      asset: buyerBot.asset,
      quantity: buyerBot.quantity,
      initialBid: buyerBot.initialBid,
      initialAsk: sellerBot.initialAsk,
      maxPrice: buyerBot.maxPrice,
      minPrice: sellerBot.minPrice,
      settlementStatus: "pending",
      timeline: [],
      transcript: []
    };
  }

  private addTimelineEvent(event: string, type: string = "info") {
    const time = new Date().toISOString();
    this.dealRecord.timeline.push({ time, event, type });
    this.buyerBot.log(`Timeline: ${event}`);
    this.sellerBot.log(`Timeline: ${event}`);
    if (this.onStateChange) this.onStateChange(this.dealRecord);
  }

  public getRecord(): DealRecord {
    return this.dealRecord;
  }

  public async runNegotiation(): Promise<DealRecord> {
    try {
      this.addTimelineEvent("Initializing agent wallets and identities...", "init");

      // 1. Setup Identities
      const buyerId = await this.adapter.createOrLoadAgentIdentity(
        this.buyerBot.identity?.nametag || "BuyerBot",
        this.buyerBot.identity?.mnemonic
      );
      this.buyerBot.setIdentity(buyerId);
      this.dealRecord.buyer = buyerId;

      const sellerId = await this.adapter.createOrLoadAgentIdentity(
        this.sellerBot.identity?.nametag || "SellerBot",
        this.sellerBot.identity?.mnemonic
      );
      this.sellerBot.setIdentity(sellerId);
      this.dealRecord.seller = sellerId;

      this.addTimelineEvent("Wallets loaded. Posting signed trading intents...", "intent");

      // 2. Post intents
      const buyerIntent: Intent = {
        id: "",
        type: "buy",
        asset: this.buyerBot.asset,
        quantity: this.buyerBot.quantity,
        price: this.buyerBot.maxPrice,
        createdBy: buyerId,
        expiresAt: ""
      };
      const postedBuyerIntent = await this.adapter.postIntent(buyerIntent);
      this.addTimelineEvent(`Buyer intent posted. ID: ${postedBuyerIntent.id}`, "intent");

      const sellerIntent: Intent = {
        id: "",
        type: "sell",
        asset: this.sellerBot.asset,
        quantity: this.sellerBot.quantity,
        price: this.sellerBot.minPrice,
        createdBy: sellerId,
        expiresAt: ""
      };
      const postedSellerIntent = await this.adapter.postIntent(sellerIntent);
      this.addTimelineEvent(`Seller intent posted. ID: ${postedSellerIntent.id}`, "intent");

      // 3. Counterparty discovery
      this.addTimelineEvent("Discovering matching counterparties on Unicity market...", "discovery");
      const matches = await this.adapter.searchMatchingIntents(postedBuyerIntent);
      
      const hasMatch = matches.some(item => item.createdBy.nametag === sellerId.nametag);
      if (hasMatch) {
        this.addTimelineEvent(`Compatible counterparty found: ${sellerId.nametag}`, "discovery");
      } else {
        // If range overlaps, we force matching for the demo/simulation
        if (this.buyerBot.maxPrice >= this.sellerBot.minPrice) {
          this.addTimelineEvent(`No public counterparty indexed, but prices overlap. Starting negotiation directly...`, "discovery");
        } else {
          this.addTimelineEvent(`Price range mismatch (Buyer max: ${this.buyerBot.maxPrice} < Seller min: ${this.sellerBot.minPrice}). Negotiation cannot converge.`, "fail");
          this.dealRecord.status = "failed";
          this.dealRecord.settlementStatus = "failed";
          this.addTimelineEvent("Negotiation terminated due to incompatible limits.", "fail");
          return this.dealRecord;
        }
      }

      this.addTimelineEvent("Starting direct message negotiation...", "negotiation");

      // 4. Negotiation Loop
      let buyerLastBid: number | null = null;
      let sellerLastAsk: number | null = null;
      let round = 1;
      let agreed = false;
      let finalPrice = 0;

      const maxRounds = Math.min(this.buyerBot.maxRounds, this.sellerBot.maxRounds);

      while (round <= maxRounds) {
        this.addTimelineEvent(`--- Negotiation Round ${round} ---`, "round");

        // Buyer calculates offer
        const bid = this.buyerBot.calculateOffer(sellerLastAsk, round);
        buyerLastBid = bid;

        const buyerMsg: NegotiationMessage = {
          id: `msg_b_${round}_${Math.random().toString(36).substring(2, 5)}`,
          from: buyerId,
          to: sellerId,
          intentId: postedBuyerIntent.id,
          round,
          kind: round === 1 ? "offer" : "counteroffer",
          price: bid,
          text: `I offer ${bid} per unit for ${this.buyerBot.quantity} ${this.buyerBot.asset}.`,
          timestamp: new Date().toISOString()
        };

        await this.adapter.sendDirectMessage(buyerMsg);
        this.dealRecord.transcript.push(buyerMsg);
        this.addTimelineEvent(`Buyer: Sent bid of ${bid}`, "dm");

        // Check if agreement is reached immediately (e.g. buyer bid matches/exceeds seller last ask)
        if (sellerLastAsk !== null && bid >= sellerLastAsk) {
          agreed = true;
          finalPrice = Number(((bid + sellerLastAsk) / 2).toFixed(4));
          this.addTimelineEvent(`Buyer bid (${bid}) meets or exceeds seller ask (${sellerLastAsk}). Agreement reached!`, "agreement");
          break;
        }

        // Seller calculates ask
        const ask = this.sellerBot.calculateOffer(buyerLastBid, round);
        sellerLastAsk = ask;

        const sellerMsg: NegotiationMessage = {
          id: `msg_s_${round}_${Math.random().toString(36).substring(2, 5)}`,
          from: sellerId,
          to: buyerId,
          intentId: postedSellerIntent.id,
          round,
          kind: round === 1 ? "offer" : "counteroffer",
          price: ask,
          text: `I ask ${ask} per unit for ${this.sellerBot.quantity} ${this.sellerBot.asset}.`,
          timestamp: new Date().toISOString()
        };

        await this.adapter.sendDirectMessage(sellerMsg);
        this.dealRecord.transcript.push(sellerMsg);
        this.addTimelineEvent(`Seller: Sent ask of ${ask}`, "dm");

        // Check agreement again
        if (buyerLastBid >= ask) {
          agreed = true;
          finalPrice = Number(((buyerLastBid + ask) / 2).toFixed(4));
          this.addTimelineEvent(`Seller ask (${ask}) meets or falls below buyer bid (${buyerLastBid}). Agreement reached!`, "agreement");
          break;
        }

        round++;
        // Small delay to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (agreed) {
        this.dealRecord.finalPrice = finalPrice;
        this.addTimelineEvent(`Price agreed: ${finalPrice} (Midpoint). Executing atomic swap settlement...`, "settlement_start");

        // 5. Escrow and Swap Settlement
        const settlement = await this.adapter.createEscrowOrAtomicSwap({
          buyer: buyerId,
          seller: sellerId,
          asset: this.buyerBot.asset,
          quantity: this.buyerBot.quantity,
          finalPrice
        });

        this.dealRecord.settlementStatus = settlement.status;
        this.dealRecord.txId = settlement.txId;
        this.dealRecord.escrowId = settlement.escrowId;
        this.addTimelineEvent(`Escrow created. ID: ${settlement.escrowId}. Submitting swap transaction to Unicity Testnet v2...`, "settlement_pending");

        // Verify settlement on chain
        const finalSettlement = await this.adapter.validateSettlement(settlement);
        this.dealRecord.settlementStatus = finalSettlement.status;
        this.dealRecord.status = finalSettlement.status === "completed" ? "completed" : "failed";
        this.dealRecord.txId = finalSettlement.txId || this.dealRecord.txId;

        if (this.dealRecord.status === "completed") {
          this.addTimelineEvent(`Settlement successfully verified! Transaction ID: ${this.dealRecord.txId}`, "success");
        } else {
          this.addTimelineEvent(`Settlement failed: ${finalSettlement.error || "Unknown validation error."}`, "fail");
        }
      } else {
        this.dealRecord.status = "failed";
        this.dealRecord.settlementStatus = "failed";
        this.addTimelineEvent(`Negotiation reached limit of ${maxRounds} rounds without agreement. Terminating negotiation.`, "fail");
      }

    } catch (error: any) {
      this.dealRecord.status = "failed";
      this.dealRecord.settlementStatus = "failed";
      this.addTimelineEvent(`Error during autonomous negotiation execution: ${error.message || error}`, "error");
    }

    return this.dealRecord;
  }
}
