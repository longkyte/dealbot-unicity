import React from "react";
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { SettlementResult } from "../src/lib/unicity/types.js";

interface SettlementCardProps {
  status: SettlementResult["status"];
  txId?: string;
  escrowId?: string;
  error?: string;
  buyerAddress?: string;
  sellerAddress?: string;
  finalPrice?: number;
  quantity?: number;
  asset?: string;
}

export default function SettlementCard({
  status,
  txId,
  escrowId,
  error,
  buyerAddress,
  sellerAddress,
  finalPrice,
  quantity,
  asset = "UCT"
}: SettlementCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/15 border border-secondary/35 text-secondary flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 border border-accent/35 text-accent flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 animate-spin" /> Pending
          </span>
        );
      case "simulated":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 border border-blue-500/35 text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Simulated
          </span>
        );
      case "failed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/35 text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
      {/* Decorative accent bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-accent" />

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-400" />
          Swap Settlement Invoice
        </h3>
        {getStatusBadge()}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 items-start text-sm text-red-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
          <div>
            <span className="font-semibold block">Settlement Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Deal details */}
        <div className="flex flex-col gap-4">
          <div className="border-b border-border/50 pb-2">
            <span className="text-xs text-gray-500 block uppercase font-mono tracking-wider">Transaction Terms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Quantity:</span>
            <span className="font-semibold text-white">{quantity} {asset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Agreed Unit Price:</span>
            <span className="font-semibold text-white">{finalPrice ? `${finalPrice.toFixed(4)} UCT` : "N/A"}</span>
          </div>
          <div className="flex justify-between border-t border-border/30 pt-3">
            <span className="text-gray-300 font-medium">Total Settlement Value:</span>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-lg">
              {finalPrice && quantity ? `${(finalPrice * quantity).toFixed(2)} UCT` : "N/A"}
            </span>
          </div>
        </div>

        {/* Ledger identities */}
        <div className="flex flex-col gap-4">
          <div className="border-b border-border/50 pb-2">
            <span className="text-xs text-gray-500 block uppercase font-mono tracking-wider">Ledger References</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-mono">Escrow ID (Swap Contract)</span>
            <span className="text-xs font-mono text-gray-300 break-all select-all">{escrowId || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-mono">L3 Tx Hash (Testnet v2)</span>
            <span className="text-xs font-mono text-gray-300 break-all select-all">{txId || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 bg-background/50 p-4 rounded-xl border border-border text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span className="text-gray-500">Party A (Buyer) Address:</span>
          <span className="text-gray-300 break-all select-all">{buyerAddress || "N/A"}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-t border-border/30 pt-2">
          <span className="text-gray-500">Party B (Seller) Address:</span>
          <span className="text-gray-300 break-all select-all">{sellerAddress || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
