import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Pencil, RefreshCw, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import ProcessingAnimation from "../components/inquiries/ProcessingAnimation.jsx";
import PriorityBadge from "../components/ui/PriorityBadge.jsx";
import CategoryBadge from "../components/ui/CategoryBadge.jsx";
import { processInquiry } from "../services/automationService.js";
import { regenerateReply } from "../services/aiService.js";
import * as store from "../services/storageService.js";

const EMPTY_FORM = { clientName: "", email: "", business: "", message: "" };

export default function NewInquiry() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // form | processing | result
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyVariant, setReplyVariant] = useState(0);
  const [editingReply, setEditingReply] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  function validate() {
    const e = {};
    if (!form.clientName.trim()) e.clientName = "Client name is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAnalyze(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStep("processing");
  }

  function handleProcessingDone() {
    const r = processInquiry(form);
    setResult(r);
    setReplyText(r.reply || "");
    setReplyVariant(0);
    setStep("result");
  }

  function handleCopy() {
    navigator.clipboard?.writeText(replyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleRegenerate() {
    const { text, variant } = regenerateReply(result.analysis, form.clientName, replyVariant);
    setReplyText(text);
    setReplyVariant(variant);
    setSaved(false);
  }

  function handleSaveReply() {
    store.updateInquiry(result.inquiry.id, { reply: replyText, replyVariant });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <DashboardLayout title="New Inquiry">
      <button onClick={() => navigate("/inquiries")} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink2 mb-5">
        <ArrowLeft size={15} /> Back to Inquiries
      </button>

      {step === "form" && (
        <form onSubmit={handleAnalyze} className="bg-panel border border-border rounded-lg p-6 max-w-xl space-y-4">
          <Field label="Client Name *" error={errors.clientName}>
            <input className="input" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Business Name">
            <input className="input" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} />
          </Field>
          <Field label="Message *" error={errors.message}>
            <textarea
              rows={5}
              className="input resize-none"
              placeholder="e.g. Hi, I need 10 Instagram posts and 2 promotional banners within 5 days."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </Field>
          <button type="submit" className="w-full bg-violet hover:bg-violet-dark text-white font-medium text-sm py-2.5 rounded-md">
            Analyze Inquiry
          </button>
        </form>
      )}

      {step === "processing" && <ProcessingAnimation onDone={handleProcessingDone} />}

      {step === "result" && result && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-emerald-light border border-emerald/30 text-emerald rounded-lg p-3 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} /> Analysis complete — lead and follow-up created automatically.
          </div>

          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Extracted Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Info label="Client" value={form.clientName} />
              <Info label="Business" value={result.analysis.business} />
              <Info label="Service" value={result.analysis.service} />
              <Info label="Requirements" value={result.analysis.requirements} />
              <Info label="Deadline" value={result.analysis.deadline || "Not specified"} />
              <Info label="Budget" value={result.analysis.budget || "Not specified"} />
              <div>
                <dt className="text-xs font-medium text-muted mb-1">Category</dt>
                <CategoryBadge category={result.analysis.category} />
              </div>
              <div>
                <dt className="text-xs font-medium text-muted mb-1">Priority</dt>
                <PriorityBadge priority={result.analysis.priority} />
              </div>
            </dl>
          </div>

          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-3 text-sm">Client Message</h3>
            <p className="text-sm text-muted bg-paper border border-border rounded-md p-3 whitespace-pre-wrap">{form.message}</p>
          </div>

          <div className="bg-panel border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-ink2 mb-3 text-sm">Generated Reply</h3>
            {editingReply ? (
              <textarea rows={6} className="input resize-none" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
            ) : (
              <p className="text-sm text-ink2 bg-paper border border-border rounded-md p-3 whitespace-pre-wrap">{replyText}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-paper">
                <Copy size={13} /> {copied ? "Copied!" : "Copy Reply"}
              </button>
              <button onClick={() => setEditingReply((v) => !v)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-paper">
                <Pencil size={13} /> {editingReply ? "Done Editing" : "Edit Reply"}
              </button>
              <button onClick={handleRegenerate} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-paper">
                <RefreshCw size={13} /> Regenerate Reply
              </button>
              <button onClick={handleSaveReply} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-violet text-white hover:bg-violet-dark">
                <Save size={13} /> {saved ? "Saved!" : "Save Reply"}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(`/inquiries/${result.inquiry.id}`)} className="text-sm text-violet font-medium hover:underline">
              View Full Inquiry →
            </button>
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setResult(null);
                setStep("form");
              }}
              className="text-sm text-muted font-medium hover:underline"
            >
              Create Another Inquiry
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted mb-1">{label}</span>
      {children}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
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
