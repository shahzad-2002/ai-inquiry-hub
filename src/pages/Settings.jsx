import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import * as store from "../services/storageService.js";
import { PRIORITIES } from "../services/aiService.js";

export default function Settings() {
  const [settings, setSettings] = useState(() => store.getSettings());
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    store.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clearAll() {
    [store.KEYS.INQUIRIES, store.KEYS.LEADS, store.KEYS.TASKS, store.KEYS.HISTORY].forEach((k) => localStorage.setItem(k, "[]"));
    window.location.reload();
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-xl space-y-6">
        <form onSubmit={handleSave} className="bg-panel border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-display font-semibold text-ink2">Automation Settings</h2>

          <label className="flex items-center justify-between">
            <span className="text-sm text-ink2">Demo AI Mode</span>
            <input type="checkbox" checked readOnly className="accent-violet w-4 h-4" />
          </label>
          <p className="text-xs text-muted -mt-2">
            Always on in this version — analysis runs with local rule-based logic, not a paid AI API.
          </p>

          <label className="flex items-center justify-between">
            <span className="text-sm text-ink2">Automation Enabled</span>
            <input
              type="checkbox"
              checked={settings.automationEnabled}
              onChange={(e) => setSettings({ ...settings, automationEnabled: e.target.checked })}
              className="accent-violet w-4 h-4"
            />
          </label>
          <p className="text-xs text-muted -mt-2">When off, new inquiries are analyzed but no lead or follow-up is created.</p>

          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1">Default Follow-up Period (days)</span>
            <input
              type="number"
              min="1"
              className="input"
              value={settings.defaultFollowUpDays}
              onChange={(e) => setSettings({ ...settings, defaultFollowUpDays: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1">Default Priority</span>
            <select className="input" value={settings.defaultPriority} onChange={(e) => setSettings({ ...settings, defaultPriority: e.target.value })}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm rounded-md bg-violet hover:bg-violet-dark text-white font-medium">Save</button>
            {saved && <span className="text-sm text-emerald">Saved.</span>}
          </div>
        </form>

        <div className="bg-panel border border-border rounded-lg p-5">
          <h2 className="font-display font-semibold text-ink2 mb-1">Application Information</h2>
          <p className="text-sm text-muted">
            AI Client Inquiry Automation Hub — a frontend-only demo built with React, Vite, and Tailwind CSS. All
            analysis is simulated with local JavaScript logic (no paid AI API). Data is stored in this browser's
            LocalStorage only.
          </p>
        </div>

        <div className="bg-panel border border-border rounded-lg p-5">
          <h2 className="font-display font-semibold text-ink2 mb-1">Data</h2>
          <p className="text-sm text-muted mb-4">Clear all inquiries, leads, follow-ups, and automation history. This cannot be undone.</p>
          <button onClick={() => setConfirmClear(true)} className="px-4 py-2 text-sm rounded-md border border-danger/30 text-danger hover:bg-red-50">
            Clear all data
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all data?"
        message="This permanently deletes every inquiry, lead, follow-up task, and automation history entry."
        confirmLabel="Clear everything"
        onConfirm={clearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </DashboardLayout>
  );
}
