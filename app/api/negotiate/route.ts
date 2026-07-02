import { NextResponse } from "next/server";
import { AgentRunner } from "../../../src/agents/AgentRunner.js";
import { BuyerPolicy } from "../../../src/agents/BuyerBot.js";
import { SellerPolicy } from "../../../src/agents/SellerBot.js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyer, seller, isSimulation } = body;

    const dealId = `deal_${Math.random().toString(36).substring(2, 11)}`;

    const buyerPolicy: BuyerPolicy = {
      assetWanted: buyer.assetWanted,
      quantity: buyer.quantity,
      maxPrice: buyer.maxPrice,
      initialBid: buyer.initialBid,
      stepSize: buyer.stepSize,
      maxRounds: buyer.maxRounds,
      timeoutMs: 60000,
      strategy: buyer.strategy
    };

    const sellerPolicy: SellerPolicy = {
      assetOffered: seller.assetOffered,
      quantity: seller.quantity,
      minPrice: seller.minPrice,
      initialAsk: seller.initialAsk,
      stepSize: seller.stepSize,
      maxRounds: seller.maxRounds,
      timeoutMs: 60000,
      strategy: seller.strategy
    };

    // Execute negotiation loop synchronously to survive serverless function lifespans
    const dealResult = await AgentRunner.run(buyerPolicy, sellerPolicy, isSimulation, dealId);

    return NextResponse.json({ success: true, dealId, deal: dealResult });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
