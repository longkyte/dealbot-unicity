"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bot, ArrowLeft, PlayCircle, ShieldCheck, Database, History, RefreshCw } from "lucide-react";
import BotConfigForm from "@/components/BotConfigForm";
import DealTimeline from "@/components/DealTimeline";
import NegotiationTranscript from "@/components/NegotiationTranscript";
import SettlementCard from "@/components/SettlementCard";
import IntentBoard from "@/components/IntentBoard";
import { DealRecord } from "@/src/agents/NegotiationEngine";

export default function Dashboard() {
  const [buyerConfig, setBuyerConfig] = useState({
    buyerName: "@NexusBuyer",
    assetWanted: "UCT",
    quantity: 10,
    maxPrice: 5.5,
    initialBid: 3.5,
    stepSize: 0.05,
    maxRounds: 8,
    strategy: "normal"
  });

  const [sellerConfig, setSellerConfig] = useState({
    sellerName: "@AtlasSeller",
    assetOffered: "UCT",
    quantity: 10,
    minPrice: 4.5,
    initialAsk: 6.5,
    stepSize: 0.05,
    maxRounds: 8,
    strategy: "normal"
  });

  const [isSimulation, setIsSimulation] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [activeDeal, setActiveDeal] = useState<DealRecord | null>(null);
  const [dealHistory, setDealHistory] = useState<DealRecord[]>([]);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch deal history on mount
  useEffect(() => {
    fetchHistory();
    return () => {
      stopPolling();
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/deals");
      const data = await res.json();
      if (data.success) {
        setDealHistory(data.deals);
        // If there's an active deal in history, select it by default
        if (data.deals.length > 0 && !activeDealId) {
          setActiveDeal(data.deals[data.deals.length - 1]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch deal history", e);
    }
  };

  const startPolling = (dealId: string) => {
    stopPolling();
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/deals/${dealId}`);
        const data = await res.json();
        if (data.success) {
          setActiveDeal(data.deal);
          if (data.deal.status !== "active") {
            stopPolling();
            setIsRunning(false);
            fetchHistory(); // Refresh history
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 800);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const handleStartNegotiation = async () => {
    setIsRunning(true);
    setActiveDeal(null);
    stopPolling();

    try {
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: buyerConfig,
          seller: sellerConfig,
          isSimulation
        })
      });
      const data = await response.json();
      if (data.success) {
        setActiveDealId(data.dealId);
        startPolling(data.dealId);
      } else {
        setIsRunning(false);
        alert(`Failed to start agents: ${data.error}`);
      }
    } catch (e: any) {
      setIsRunning(false);
      alert(`Network error: ${e.message}`);
    }
  };

  const selectHistoricalDeal = (deal: DealRecord) => {
    stopPolling();
    setIsRunning(false);
    setActiveDealId(deal.id);
    setActiveDeal(deal);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-x-hidden">
      {/* Top Banner Header */}
      <header className="w-full bg-[#0d0d11]/80 backdrop-blur-md border-b border-border/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-border">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <h1 className="font-bold text-lg text-white">DealBot Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode selection toggle */}
            <div className="flex items-center bg-card border border-border p-1 rounded-xl">
              <button
                onClick={() => setIsSimulation(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSimulation
                    ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
                disabled={isRunning}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Simulation fallback
              </button>
              <button
                onClick={() => setIsSimulation(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  !isSimulation
                    ? "bg-primary/20 border border-primary/30 text-primary-hover"
                    : "text-gray-400 hover:text-white"
                }`}
                disabled={isRunning}
              >
                <Database className="w-3.5 h-3.5" /> Testnet v2 (Live SDK)
              </button>
            </div>

            <button
              onClick={handleStartNegotiation}
              disabled={isRunning}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-primary/40 text-white font-semibold flex items-center gap-2 transition-all border border-primary/40 text-sm shadow-lg shadow-primary/20"
            >
              <PlayCircle className="w-4 h-4" />
              {isRunning ? "Negotiating..." : "Start Agents"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Config Panel (span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Active board for intents */}
          <IntentBoard
            buyerIntent={
              activeDeal?.status === "active" || activeDeal?.status === "completed"
                ? {
                    id: activeDeal.transcript[0]?.intentId || "pending",
                    type: "buy",
                    asset: activeDeal.asset,
                    quantity: activeDeal.quantity,
                    price: activeDeal.maxPrice,
                    createdBy: activeDeal.buyer
                  }
                : undefined
            }
            sellerIntent={
              activeDeal?.status === "active" || activeDeal?.status === "completed"
                ? {
                    id: activeDeal.transcript[1]?.intentId || "pending",
                    type: "sell",
                    asset: activeDeal.asset,
                    quantity: activeDeal.quantity,
                    price: activeDeal.minPrice,
                    createdBy: activeDeal.seller
                  }
                : undefined
            }
          />

          {/* Config Forms (Side-by-side or stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BotConfigForm
              type="buyer"
              title="BuyerBot Agent Config"
              config={buyerConfig}
              onChange={(field, val) => setBuyerConfig(prev => ({ ...prev, [field]: val }))}
              disabled={isRunning}
            />
            <BotConfigForm
              type="seller"
              title="SellerBot Agent Config"
              config={sellerConfig}
              onChange={(field, val) => setSellerConfig(prev => ({ ...prev, [field]: val }))}
              disabled={isRunning}
            />
          </div>

          {/* Live Progress Logs Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DealTimeline events={activeDeal?.timeline || []} />
            <NegotiationTranscript
              transcript={activeDeal?.transcript || []}
              buyerTag={activeDeal?.buyer?.nametag || buyerConfig.buyerName}
              sellerTag={activeDeal?.seller?.nametag || sellerConfig.sellerName}
            />
          </div>

          {/* Settlement Details */}
          {activeDeal && (
            <SettlementCard
              status={activeDeal.settlementStatus}
              txId={activeDeal.txId}
              escrowId={activeDeal.escrowId}
              error={activeDeal.timeline.find(t => t.type === "error" || t.type === "fail")?.event}
              buyerAddress={activeDeal.buyer.address}
              sellerAddress={activeDeal.seller.address}
              finalPrice={activeDeal.finalPrice}
              quantity={activeDeal.quantity}
              asset={activeDeal.asset}
            />
          )}
        </div>

        {/* Right Column: Historical Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/50">
              <h3 className="font-bold text-white flex items-center gap-2 text-base">
                <History className="w-4.5 h-4.5 text-gray-400" />
                History Logs
              </h3>
              <button onClick={fetchHistory} className="p-1 hover:bg-white/5 rounded transition-colors text-gray-400 hover:text-white">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {dealHistory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-gray-500 italic">
                  No historical negotiations found.
                </div>
              ) : (
                dealHistory.map((hDeal) => (
                  <button
                    key={hDeal.id}
                    onClick={() => selectHistoricalDeal(hDeal)}
                    className={`text-left p-3 rounded-lg border text-xs flex flex-col gap-2 transition-all ${
                      activeDealId === hDeal.id
                        ? "bg-primary/10 border-primary/30"
                        : "bg-card hover:bg-card/70 border-border"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-white uppercase tracking-tight">{hDeal.id.substring(0, 12)}</span>
                      <span className={`px-2 py-0.5 rounded-[4px] font-semibold text-[9px] uppercase ${
                        hDeal.status === "completed"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {hDeal.status}
                      </span>
                    </div>

                    <div className="text-gray-400 space-y-1 font-mono text-[10px]">
                      <div>Buyer: {hDeal.buyer.nametag}</div>
                      <div>Seller: {hDeal.seller.nametag}</div>
                      <div className="flex justify-between text-gray-300 font-bold border-t border-border/20 pt-1 mt-1">
                        <span>Price: {hDeal.finalPrice || "N/A"} UCT</span>
                        <span>Qty: {hDeal.quantity}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
