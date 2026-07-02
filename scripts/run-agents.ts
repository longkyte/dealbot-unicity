import dotenv from "dotenv";
import { AgentRunner } from "../src/agents/AgentRunner.js";
import { BuyerPolicy } from "../src/agents/BuyerBot.js";
import { SellerPolicy } from "../src/agents/SellerBot.js";
import { ConsoleLogger } from "../src/lib/utils/logger.js";

dotenv.config();

async function main() {
  ConsoleLogger.info("DealBot", "Starting autonomous background agent negotiation...");

  const isSimulation = process.env.DEALBOT_SIMULATION !== "false";
  ConsoleLogger.info("DealBot", `Running mode: ${isSimulation ? "LOCAL SIMULATION" : "REAL UNICITY TESTNET V2"}`);

  // Configure sample policies
  const buyerPolicy: BuyerPolicy = {
    assetWanted: "UCT",
    quantity: 10,
    maxPrice: 5.5,
    initialBid: 3.5,
    stepSize: 0.05, // 5% adjustments
    maxRounds: 8,
    timeoutMs: 60000,
    strategy: "normal"
  };

  const sellerPolicy: SellerPolicy = {
    assetOffered: "UCT",
    quantity: 10,
    minPrice: 4.5,
    initialAsk: 6.5,
    stepSize: 0.05,
    maxRounds: 8,
    timeoutMs: 60000,
    strategy: "normal"
  };

  try {
    ConsoleLogger.info("DealBot", `BuyerBot config: Initial Bid: ${buyerPolicy.initialBid} | Max Price: ${buyerPolicy.maxPrice}`);
    ConsoleLogger.info("DealBot", `SellerBot config: Initial Ask: ${sellerPolicy.initialAsk} | Min Price: ${sellerPolicy.minPrice}`);

    const result = await AgentRunner.run(buyerPolicy, sellerPolicy, isSimulation);
    
    if (result.status === "completed") {
      ConsoleLogger.success("DealBot", `Negotiation succeeded! Final price agreed: ${result.finalPrice} UCT.`);
      ConsoleLogger.success("DealBot", `Settlement state: ${result.settlementStatus}. Tx Hash: ${result.txId}`);
    } else {
      ConsoleLogger.warn("DealBot", "Negotiation terminated. No overlapping price could be agreed upon.");
    }
  } catch (error: any) {
    ConsoleLogger.error("DealBot", "Fatal runner exception", error);
  }
}

main().catch(console.error);
