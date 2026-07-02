import React from "react";
import { Settings, ShieldAlert } from "lucide-react";

interface BotConfigFormProps {
  type: "buyer" | "seller";
  title: string;
  config: any;
  onChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export default function BotConfigForm({
  type,
  title,
  config,
  onChange,
  disabled = false
}: BotConfigFormProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
      {/* Decorative accent top line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${type === "buyer" ? "bg-primary" : "bg-secondary"}`} />
      
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          {title}
        </h3>
        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
          type === "buyer" 
            ? "bg-primary/10 border border-primary/20 text-primary" 
            : "bg-secondary/10 border border-secondary/20 text-secondary"
        }`}>
          {type}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name / Nametag */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">Nametag Identity</label>
          <input
            type="text"
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={type === "buyer" ? config.buyerName : config.sellerName}
            onChange={(e) => onChange(type === "buyer" ? "buyerName" : "sellerName", e.target.value)}
            disabled={disabled}
            placeholder={type === "buyer" ? "@BuyerBot" : "@SellerBot"}
          />
        </div>

        {/* Asset */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">{type === "buyer" ? "Asset Wanted" : "Asset Offered"}</label>
          <input
            type="text"
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={type === "buyer" ? config.assetWanted : config.assetOffered}
            onChange={(e) => onChange(type === "buyer" ? "assetWanted" : "assetOffered", e.target.value)}
            disabled={disabled}
            placeholder="UCT"
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">Quantity</label>
          <input
            type="number"
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={config.quantity}
            onChange={(e) => onChange("quantity", parseFloat(e.target.value))}
            disabled={disabled}
            min={1}
          />
        </div>

        {/* Strategy */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">Negotiation Strategy</label>
          <select
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={config.strategy}
            onChange={(e) => onChange("strategy", e.target.value)}
            disabled={disabled}
          >
            <option value="conservative">Conservative (Slow)</option>
            <option value="normal">Normal (Balanced)</option>
            <option value="aggressive">Aggressive (Fast)</option>
          </select>
        </div>

        {/* Price Bounds */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">
            {type === "buyer" ? "Starting Bid Price" : "Starting Ask Price"}
          </label>
          <input
            type="number"
            step="0.01"
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={type === "buyer" ? config.initialBid : config.initialAsk}
            onChange={(e) => onChange(type === "buyer" ? "initialBid" : "initialAsk", parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">
            {type === "buyer" ? "Maximum Price Limit" : "Minimum Price Limit"}
          </label>
          <input
            type="number"
            step="0.01"
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={type === "buyer" ? config.maxPrice : config.minPrice}
            onChange={(e) => onChange(type === "buyer" ? "maxPrice" : "minPrice", parseFloat(e.target.value))}
            disabled={disabled}
          />
        </div>

        {/* Step Size */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">Base Step Increment (e.g. 0.05 = 5%)</label>
          <input
            type="number"
            step="0.01"
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={config.stepSize}
            onChange={(e) => onChange("stepSize", parseFloat(e.target.value))}
            disabled={disabled}
            min={0.01}
            max={0.5}
          />
        </div>

        {/* Max Rounds */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">Maximum Rounds</label>
          <input
            type="number"
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary/50"
            value={config.maxRounds}
            onChange={(e) => onChange("maxRounds", parseInt(e.target.value))}
            disabled={disabled}
            min={1}
            max={50}
          />
        </div>
      </div>

      {type === "buyer" && config.initialBid > config.maxPrice && (
        <div className="flex gap-2 items-center text-xs text-accent bg-accent/10 border border-accent/20 p-3 rounded-lg">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Warning: Starting bid is higher than max limit. Bid will be capped at max limit.</span>
        </div>
      )}

      {type === "seller" && config.initialAsk < config.minPrice && (
        <div className="flex gap-2 items-center text-xs text-accent bg-accent/10 border border-accent/20 p-3 rounded-lg">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Warning: Starting ask is lower than min limit. Ask will be capped at min limit.</span>
        </div>
      )}
    </div>
  );
}
