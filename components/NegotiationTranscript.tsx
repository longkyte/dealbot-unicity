import React, { useEffect, useRef } from "react";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { NegotiationMessage } from "../src/lib/unicity/types.js";

interface NegotiationTranscriptProps {
  transcript: NegotiationMessage[];
  buyerTag: string;
  sellerTag: string;
}

export default function NegotiationTranscript({
  transcript,
  buyerTag,
  sellerTag
}: NegotiationTranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Negotiation Transcript
        </h3>
        <span className="text-xs text-gray-500 font-mono">Encrypted Nostr DMs</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 scroll-smooth"
      >
        {transcript.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 italic">
            No messages exchanged yet.
          </div>
        ) : (
          transcript.map((msg, idx) => {
            const isBuyer = msg.from.nametag === buyerTag;
            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div
                key={idx}
                className={`flex flex-col max-w-[80%] ${
                  isBuyer ? "self-start items-start" : "self-end items-end"
                }`}
              >
                {/* Sender Tag */}
                <span className="text-[10px] text-gray-500 mb-1 px-1">
                  {msg.from.nametag} • Round {msg.round}
                </span>

                {/* Bubble Content */}
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed border ${
                    isBuyer
                      ? "bg-primary/10 border-primary/20 text-white rounded-tl-none"
                      : "bg-secondary/10 border-secondary/20 text-white rounded-tr-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {/* Price Badge inside Bubble */}
                  {msg.price !== undefined && (
                    <div className="mt-2.5 flex items-center justify-between gap-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs uppercase ${
                        isBuyer 
                          ? "bg-primary/20 text-primary-hover"
                          : "bg-secondary/20 text-secondary"
                      }`}>
                        Bid: {msg.price} UCT
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">{timeStr}</span>
                    </div>
                  )}
                </div>

                {/* Signed Verification */}
                {msg.signature && (
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-secondary px-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Signed Message Verified</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
