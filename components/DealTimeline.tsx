import React, { useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertCircle, Play, Info, MessageSquare, Key, FileText, ArrowRightLeft, Activity } from "lucide-react";

interface TimelineEvent {
  time: string;
  event: string;
  type: string;
}

interface DealTimelineProps {
  events: TimelineEvent[];
}

export default function DealTimeline({ events }: DealTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll timeline to bottom as new events arrive
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "init":
        return <Key className="w-4 h-4 text-purple-400" />;
      case "intent":
        return <FileText className="w-4 h-4 text-primary" />;
      case "discovery":
        return <ArrowRightLeft className="w-4 h-4 text-blue-400" />;
      case "round":
        return <Play className="w-4 h-4 text-accent" />;
      case "dm":
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case "agreement":
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-secondary" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventBg = (type: string) => {
    switch (type) {
      case "success":
      case "agreement":
        return "bg-secondary/10 border-secondary/20";
      case "fail":
      case "error":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-card border-border";
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary live-pulse" />
          Live Agent Timeline
        </h3>
        <span className="text-xs text-gray-500 font-mono">Real-time telemetry</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scroll-smooth"
      >
        {events.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 italic">
            Waiting for negotiation to start...
          </div>
        ) : (
          events.map((evt, idx) => {
            const timeStr = new Date(evt.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            });
            return (
              <div
                key={idx}
                className={`flex gap-3 items-start border p-3 rounded-lg text-sm transition-all duration-300 ${getEventBg(
                  evt.type
                )}`}
              >
                <div className="mt-0.5 shrink-0">{getEventIcon(evt.type)}</div>
                <div className="flex-1">
                  <p className="text-gray-200 leading-snug">{evt.event}</p>
                  <span className="text-[10px] text-gray-500 font-mono block mt-1">{timeStr}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
