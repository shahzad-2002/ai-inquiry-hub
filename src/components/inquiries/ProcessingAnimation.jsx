import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { PROCESSING_STAGES } from "../../services/automationService.js";

/**
 * Plays through PROCESSING_STAGES visually, then calls onDone(). The actual
 * analysis has already run instantly in the background — this is a short,
 * clearly-labeled UI animation (not a real processing delay).
 */
export default function ProcessingAnimation({ onDone }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= PROCESSING_STAGES.length - 1) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStageIndex((i) => i + 1), 450);
    return () => clearTimeout(t);
  }, [stageIndex, onDone]);

  return (
    <div className="bg-panel border border-border rounded-lg p-8 max-w-md mx-auto text-center">
      <div className="w-12 h-12 rounded-full bg-violet-light flex items-center justify-center mx-auto mb-5">
        <Loader2 size={22} className="text-violet animate-spin" />
      </div>
      <p className="font-display font-semibold text-ink2 mb-5">Running AI Analysis (Demo Mode)</p>
      <div className="space-y-2.5 text-left">
        {PROCESSING_STAGES.map((stage, i) => (
          <div key={stage} className={`flex items-center gap-2.5 text-sm transition-opacity ${i <= stageIndex ? "opacity-100" : "opacity-30"}`}>
            {i < stageIndex ? (
              <CheckCircle2 size={16} className="text-emerald flex-shrink-0" />
            ) : i === stageIndex ? (
              <Loader2 size={16} className="text-violet animate-spin flex-shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
            )}
            <span className={i <= stageIndex ? "text-ink2" : "text-muted"}>{stage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
