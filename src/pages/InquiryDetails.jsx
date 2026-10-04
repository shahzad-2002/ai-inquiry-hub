import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, Pencil, RefreshCw, Save } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PriorityBadge from "../components/ui/PriorityBadge.jsx";
import CategoryBadge from "../components/ui/CategoryBadge.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import * as store from "../services/storageService.js";
import { regenerateReply } from "../services/aiService.js";

export default function InquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(() => store.findInquiry(id));
  const [lead] = useState(() => store.getLeads().find((l) => l.inquiryId === id));
  const [task] = useState(() => store.getTasks().find((t) => t.inquiryId === id));
  const [history] = useState(() => store.getAutomationHistory().filter((h) => h.inquiryId === id).reverse());
  const [replyText, setReplyText] = useState(inquiry?.reply || "");
  const [editingReply, setEditingReply] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!inquiry) {
    return (
      <DashboardLayout title="Inquiry not found">
        <EmptyState title="This inquiry no longer exists" action={<Link to="/inquiries" className="text-sm text-violet font-medium hover:underline">← Back to Inquiries</Link>} />
      </DashboardLayout>
    );
  }

  function handleCopy() {
    navigator.clipboard?.writeText(replyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  function handleRegenerate() {
    const { text, variant } = regenerateReply(
      { category: inquiry.category, priority: inquiry.priority, requirements: inquiry.requirements, deadline: inquiry.deadline, budget: inquiry.budget },
      inquiry.clientName,
      inquiry.replyVariant || 0
    );
    setReplyText(text);
    store.updateInquiry(inquiry.id, { replyVariant: variant });
  }
  function handleSave() {
    const next = store.updateInquiry(inquiry.id, { reply: replyText });
    setInquiry(next.find((i) => i.id === inquiry.id));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <DashboardLayout title="Inquiry Details">
      <button onClick={() => navigate("/inquiries")} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink2 mb-5">
        <ArrowLeft size={15} /> Back to Inquiries
      </button>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink2">{inquiry.clientName}</h2>
          <p className="text-sm text-muted mt-0.5">{inquiry.business || "No business specified"} {inquiry.email && `· ${inquiry.email}`}</p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-3 text-sm">Original Message</h3>
            <p className="text-sm text-ink2 whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">AI Analysis</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm mb-2">
              <Info label="Category" value={inquiry.category ? <CategoryBadge category={inquiry.category} /> : "—"} />
              <Info label="Priority" value={inquiry.priority ? <PriorityBadge priority={inquiry.priority} /> : "—"} />
              <Info label="Requirements" value={inquiry.requirements} />
              <Info label="Deadline" value={inquiry.deadline || "Not specified"} />
              <Info label="Budget" value={inquiry.budget || "Not specified"} />
            </dl>
          </div>

          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-3 text-sm">Generated Reply</h3>
            {editingReply ? (
              <textarea rows={6} className="input resize-none" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
            ) : (
              <p className="text-sm text-ink2 bg-paper border border-border rounded-md p-3 whitespace-pre-wrap">{replyText || "No reply generated."}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-paper">
                <Copy size={13} /> {copied ? "Copied!" : "Copy Reply"}
              </button>
              <button onClick={() => setEditingReply((v) => !v)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-paper">
                <Pencil size={13} /> {editingReply ? "Done Editing" : "Edit Reply"}
              </button>
              <button onClick={handleRegenerate} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-paper">
                <RefreshCw size={13} /> Regenerate
              </button>
              <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-violet text-white hover:bg-violet-dark">
                <Save size={13} /> {saved ? "Saved!" : "Save Reply"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-3 text-sm">Lead Information</h3>
            {lead ? (
              <div className="text-sm space-y-1.5">
                <p className="text-ink2">Status: <StatusBadge status={lead.status} /></p>
                <p className="text-muted">Service: {lead.service}</p>
                <p className="text-muted">Date: {lead.date}</p>
                <Link to="/leads" className="text-violet text-xs font-medium hover:underline block mt-1">View in Leads →</Link>
              </div>
            ) : (
              <p className="text-sm text-muted italic">No lead was created (automation may be disabled).</p>
            )}
          </div>

          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-3 text-sm">Follow-up</h3>
            {task ? (
              <div className="text-sm space-y-1.5">
                <p className="text-ink2">{task.name}</p>
                <p className="text-muted">Due: {task.dueDate}</p>
                <StatusBadge status={task.status} />
                <Link to="/follow-ups" className="text-violet text-xs font-medium hover:underline block mt-1">View in Follow-ups →</Link>
              </div>
            ) : (
              <p className="text-sm text-muted italic">No follow-up task was created.</p>
            )}
          </div>

          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-3 text-sm">Automation History</h3>
            {history.length === 0 ? (
              <p className="text-sm text-muted italic">No history recorded.</p>
            ) : (
              <div className="space-y-3">
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
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted mb-1">{label}</dt>
      <dd className="text-ink2">{value || "—"}</dd>
    </div>
  );
}
