import { AgentIdentity } from "../lib/unicity/types.js";

export type StrategyType = "conservative" | "normal" | "aggressive";

export abstract class BaseAgent {
  public identity!: AgentIdentity;
  public asset: string;
  public quantity: number;
  public limitPrice: number;
  public strategy: StrategyType;
  public stepSize: number;
  public maxRounds: number;
  public logs: string[] = [];

  constructor(
    asset: string,
    quantity: number,
    limitPrice: number,
    strategy: StrategyType = "normal",
    stepSize: number = 0.05,
    maxRounds: number = 10
  ) {
    this.asset = asset;
    this.quantity = quantity;
    this.limitPrice = limitPrice;
    this.strategy = strategy;
    this.stepSize = stepSize;
    this.maxRounds = maxRounds;
  }

  public setIdentity(identity: AgentIdentity) {
    this.identity = identity;
    this.log(`Agent initialized: ${identity.nametag} | Address: ${identity.address}`);
  }

  public log(msg: string) {
    const timestamp = new Date().toISOString().substring(11, 19);
    const logStr = `[${timestamp}] ${msg}`;
    this.logs.push(logStr);
    console.log(`[${this.identity?.nametag || "Agent"}] ${logStr}`);
  }

  public getStepAdjustment(currentPrice: number, direction: "up" | "down"): number {
    // Strategy controls how quickly price moves:
    // - conservative: small moves (50% of stepSize)
    // - normal: normal moves (100% of stepSize)
    // - aggressive: bigger moves (150% of stepSize)
    let modifier = 1.0;
    if (this.strategy === "conservative") modifier = 0.5;
    if (this.strategy === "aggressive") modifier = 1.5;

    const baseMove = currentPrice * this.stepSize * modifier;
    return direction === "up" ? baseMove : -baseMove;
  }

  abstract calculateOffer(opponentLastPrice: number | null, round: number): number;
}
