import { BaseAgent, StrategyType } from "./BaseAgent.js";

export type BuyerPolicy = {
  assetWanted: string;
  quantity: number;
  maxPrice: number;
  initialBid: number;
  stepSize: number;
  maxRounds: number;
  timeoutMs: number;
  strategy: StrategyType;
};

export class BuyerBot extends BaseAgent {
  public initialBid: number;
  public maxPrice: number;
  private currentBid: number = 0;

  constructor(policy: BuyerPolicy) {
    super(
      policy.assetWanted,
      policy.quantity,
      policy.maxPrice,
      policy.strategy,
      policy.stepSize,
      policy.maxRounds
    );
    this.initialBid = policy.initialBid;
    this.maxPrice = policy.maxPrice;
  }

  public calculateOffer(sellerLastPrice: number | null, round: number): number {
    if (round === 1) {
      this.currentBid = Math.min(this.initialBid, this.maxPrice);
      this.log(`Round 1: Offering initial bid of ${this.currentBid}`);
      return this.currentBid;
    }

    if (sellerLastPrice === null) {
      this.log(`No counteroffer from seller yet. Repeating current bid: ${this.currentBid}`);
      return this.currentBid;
    }

    // Bid increases towards seller's price but capped at maxPrice
    const adjustment = this.getStepAdjustment(this.currentBid, "up");
    let nextBid = this.currentBid + adjustment;

    // Make sure we actually increment
    if (nextBid <= this.currentBid) {
      nextBid = this.currentBid + 0.01;
    }

    // Never exceed max price
    if (nextBid > this.maxPrice) {
      this.log(`Calculated bid ${nextBid.toFixed(2)} exceeds maximum price ${this.maxPrice}. Capping at ${this.maxPrice}`);
      nextBid = this.maxPrice;
    } else {
      this.log(`Incrementing bid from ${this.currentBid.toFixed(2)} to ${nextBid.toFixed(2)} (+${adjustment.toFixed(2)})`);
    }

    this.currentBid = Number(nextBid.toFixed(4));
    return this.currentBid;
  }

  public getCurrentBid(): number {
    return this.currentBid;
  }
}
