import { useState } from "react";
import { ArrowDown, Zap, Webhook } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { AUTOMATION_RULES, processInquiry } from "../services/automationService.js";
import * as store from "../services/storageService.js";

const WORKFLOW_STEPS = [
  "NEW INQUIRY", "ANALYZE INQUIRY", "EXTRACT INFORMATION", "IDENTIFY CATEGORY",
  "CHECK PRIORITY", "CREATE LEAD", "GENERATE REPLY", "CREATE FOLLOW-UP TASK",
];

const WEBHOOK_SAMPLE_INQUIRIES = [
  { clientName: "Alex Rivera", email: "alex@riverafit.com", business: "Rivera Fitness", message: "I need a logo and brand identity for my new gym. Launch is in 2 weeks." },
  { clientName: "Priya Shah", email: "priya@shahboutique.com", business: "Shah Boutique", message: "Can I get 5 Instagram posts and a promotional banner? This is urgent, ASAP please." },
  { clientName: "Tom Becker", email: "tom@beckerapps.com", business: "Becker Apps", message: "Looking for help with UI/UX design for a mobile app, no rush on timeline." },
];

export default function Automation() {
  const [history, setHistory] = useState(() => store.getAutomationHistory());
  const [lastWebhook, setLastWebhook] = useState(null);

  function simulateWebhook() {
    const sample = WEBHOOK_SAMPLE_INQUIRIES[Math.floor(Math.random() * WEBHOOK_SAMPLE_INQUIRIES.length)];
    const result = processInquiry(sample);
    setLastWebhook({ sample, result });
    setHistory(store.getAutomationHistory());
  }

  return (
    <DashboardLayout title="Automation">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-panel border border-border rounded-lg p-6">
            <h3 className="font-display font-semibold text-ink2 mb-5 text-sm">Automation Workflow</h3>
            <div className="flex flex-col items-center gap-1">
              {WORKFLOW_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="bg-violet-light border border-violet/30 text-violet-dark text-xs font-semibold px-4 py-2.5 rounded-md w-56 text-center">
                    {step}
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && <ArrowDown size={16} className="text-muted my-1" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-panel border border-border rounded-lg p-6">
            <h3 className="font-display font-semibold text-ink2 mb-4 text-sm flex items-center gap-2">
              <Zap size={16} className="text-violet" /> Automation Rules
            </h3>
            <div className="space-y-3">
              {AUTOMATION_RULES.map((r) => (
                <div key={r.id} className="text-sm border-l-2 border-violet/30 pl-3">
                  <p className="text-ink2"><span className="font-medium">IF</span> {r.when}</p>
                  <p className="text-muted"><span className="font-medium">THEN</span> {r.then}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-panel border border-border rounded-lg p-6">
            <h3 className="font-display font-semibold text-ink2 mb-2 text-sm flex items-center gap-2">
              <Webhook size={16} className="text-violet" /> Simulated Webhook
            </h3>
            <p className="text-xs text-muted mb-4">
              This is a <span className="font-medium">simulated</span> webhook for demo purposes — it is not connected
              to any real external service. It feeds a sample inquiry straight into the automation pipeline.
            </p>
            <button onClick={simulateWebhook} className="bg-violet hover:bg-violet-dark text-white text-sm font-medium px-4 py-2 rounded-md">
              Simulate Incoming Webhook
            </button>
            {lastWebhook && (
              <div className="mt-4 text-sm bg-emerald-light border border-emerald/30 rounded-md p-3 text-emerald">
                Webhook received → Inquiry created for {lastWebhook.sample.clientName} → Automation triggered →
                Lead + Follow-up created.
              </div>
            )}
          </div>
        </div>

        <div className="bg-panel border border-border rounded-lg p-5 h-fit">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Automation History</h3>
          {history.length === 0 ? (
            <EmptyState title="No automation events yet" />
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {history.map((h) => (
                <div key={h.id} className="text-xs border-l-2 border-violet/30 pl-3">
                  <p className="text-ink2">{h.description}</p>
                  <p className="text-muted">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
