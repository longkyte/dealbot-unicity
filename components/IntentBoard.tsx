import React from "react";
import { FileText, ArrowRight } from "lucide-react";
import { AgentIdentity } from "../src/lib/unicity/types.js";

interface BoardIntent {
  id?: string;
  type: "buy" | "sell";
  asset: string;
  quantity: number;
  price: number;
  createdBy: AgentIdentity;
}

interface IntentBoardProps {
  buyerIntent?: BoardIntent;
  sellerIntent?: BoardIntent;
}

export default function IntentBoard({ buyerIntent, sellerIntent }: IntentBoardProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          Active Intent Board
        </h3>
        <span className="text-xs text-gray-500 font-mono">Market Bulletin</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buyer Intent */}
        {buyerIntent ? (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col gap-3 relative">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Active</span>
            </div>
            <div>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">Buy Order Intent</span>
              <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                {buyerIntent.quantity} {buyerIntent.asset} <ArrowRight className="w-4 h-4 text-gray-400" /> Max {buyerIntent.price} UCT
              </h4>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              <span className="block break-all">ID: {buyerIntent.id || "Pending..."}</span>
              <span className="block mt-1">Creator: {buyerIntent.createdBy.nametag}</span>
            </div>
          </div>
        ) : (
          <div className="bg-background/40 border border-border p-4 rounded-xl flex items-center justify-center text-sm text-gray-500 italic h-[100px]">
            No active buy intent posted.
          </div>
        )}

        {/* Seller Intent */}
        {sellerIntent ? (
          <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-xl flex flex-col gap-3 relative">
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Active</span>
            </div>
            <div>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mb-1">Sell Order Intent</span>
              <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                {sellerIntent.quantity} {sellerIntent.asset} <ArrowRight className="w-4 h-4 text-gray-400" /> Min {sellerIntent.price} UCT
              </h4>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              <span className="block break-all">ID: {sellerIntent.id || "Pending..."}</span>
              <span className="block mt-1">Creator: {sellerIntent.createdBy.nametag}</span>
            </div>
          </div>
        ) : (
          <div className="bg-background/40 border border-border p-4 rounded-xl flex items-center justify-center text-sm text-gray-500 italic h-[100px]">
            No active sell intent posted.
          </div>
        )}
      </div>
    </div>
  );
}
