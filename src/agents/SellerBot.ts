import { BaseAgent, StrategyType } from "./BaseAgent.js";

export type SellerPolicy = {
  assetOffered: string;
  quantity: number;
  minPrice: number;
  initialAsk: number;
  stepSize: number;
  maxRounds: number;
  timeoutMs: number;
  strategy: StrategyType;
};

export class SellerBot extends BaseAgent {
  public initialAsk: number;
  public minPrice: number;
  private currentAsk: number = 0;

  constructor(policy: SellerPolicy) {
    super(
      policy.assetOffered,
      policy.quantity,
      policy.minPrice,
      policy.strategy,
      policy.stepSize,
      policy.maxRounds
    );
    this.initialAsk = policy.initialAsk;
    this.minPrice = policy.minPrice;
  }

  public calculateOffer(buyerLastPrice: number | null, round: number): number {
    if (round === 1) {
      this.currentAsk = Math.max(this.initialAsk, this.minPrice);
      this.log(`Round 1: Asking initial price of ${this.currentAsk}`);
      return this.currentAsk;
    }

    if (buyerLastPrice === null) {
      this.log(`No counteroffer from buyer yet. Repeating current ask: ${this.currentAsk}`);
      return this.currentAsk;
    }

    // Ask decreases towards buyer's price but capped at minPrice
    const adjustment = this.getStepAdjustment(this.currentAsk, "down");
    let nextAsk = this.currentAsk + adjustment;

    // Make sure we actually decrement
    if (nextAsk >= this.currentAsk) {
      nextAsk = this.currentAsk - 0.01;
    }

    // Never drop below min price
    if (nextAsk < this.minPrice) {
      this.log(`Calculated ask ${nextAsk.toFixed(2)} is below minimum price ${this.minPrice}. Capping at ${this.minPrice}`);
      nextAsk = this.minPrice;
    } else {
      this.log(`Decrementing ask from ${this.currentAsk.toFixed(2)} to ${nextAsk.toFixed(2)} (${adjustment.toFixed(2)})`);
    }

    this.currentAsk = Number(nextAsk.toFixed(4));
    return this.currentAsk;
  }

  public getCurrentAsk(): number {
    return this.currentAsk;
  }
}
