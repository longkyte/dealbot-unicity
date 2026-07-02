import Link from "next/link";
import { ArrowRight, Bot, Shield, DollarSign, Cpu, Settings, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">DealBot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition-colors flex items-center gap-2 border border-primary/50 text-sm shadow-lg shadow-primary/20"
          >
            Launch Live Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col justify-center z-10">
        <div className="max-w-3xl">
          {/* Builder Track Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
              Track: Autonomous Agents
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 border border-secondary/20 text-secondary">
              Track: Payments & Markets
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-400">
              Unicity Testnet v2
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
              Sphere SDK
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
              AstridOS Ready
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            DealBot: Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">P2P Negotiation</span> on Unicity
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
            BuyerBot and SellerBot independently discover counterparts, negotiate pricing, and settle transactions peer-to-peer on Testnet v2 using Sphere SDK primitives. Set the policies once, and let the agents move the value.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold transition-colors flex items-center justify-center gap-2 border border-primary/40 text-base shadow-lg shadow-primary/20"
            >
              Start Live Agent Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10 text-base"
            >
              See Architecture
            </a>
          </div>
        </div>

        {/* Highlight Quote Banner */}
        <div className="glass-panel rounded-2xl p-6 border border-border flex flex-col md:flex-row gap-6 items-center justify-between mb-20">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center border border-secondary/20">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">“Human sets policy. Agent executes within bounds.”</h4>
              <p className="text-sm text-gray-400">Autonomous agents negotiate prices and trigger escrow swaps without manual approval.</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 font-mono hidden md:block">
            UNICITY_PROTOCOL_VER: 2.0
          </div>
        </div>

        {/* How It Works Diagram Section */}
        <section id="how-it-works" className="py-12 border-t border-border/50">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How DealBot Works</h2>
            <p className="text-gray-400">The lifecycle of autonomous agent negotiation and settlement on the Unicity network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
            {/* Step 1 */}
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">Set Goal</h3>
              <p className="text-xs text-gray-400">Human defines limits, strategy, and timeouts once.</p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">Post Intent</h3>
              <p className="text-xs text-gray-400">Bots submit signed buy/sell intents to Unicity Market.</p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">Discovery</h3>
              <p className="text-xs text-gray-400">Market module triggers counterparty match event.</p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold text-white mb-2">Negotiation</h3>
              <p className="text-xs text-gray-400">Bots negotiate round-by-round via Nostr direct DMs.</p>
            </div>

            {/* Step 5 */}
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold mb-4">
                5
              </div>
              <h3 className="font-semibold text-white mb-2">Escrow Deploy</h3>
              <p className="text-xs text-gray-400">On agreement, bots announce swap contract to Escrow.</p>
            </div>

            {/* Step 6 */}
            <div className="glass-panel p-6 rounded-xl flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold mb-4">
                6
              </div>
              <h3 className="font-semibold text-white mb-2">Settlement</h3>
              <p className="text-xs text-gray-400">Final assets are released and verified on Testnet v2.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-[#070709] py-8 text-center text-xs text-gray-500 z-10">
        <p className="mb-2">DealBot Project — Created for the Unicity Builder Program.</p>
        <p>Built with Sphere SDK on Unicity Testnet v2.</p>
      </footer>
    </div>
  );
}
