// Central LocalStorage data layer. No component should touch localStorage
// directly — everything goes through these functions so storage logic stays
// in one place and is easy to swap for a real backend later.

export const KEYS = {
  INQUIRIES: "aih_inquiries",
  LEADS: "aih_leads",
  TASKS: "aih_tasks",
  HISTORY: "aih_automation_history",
  SETTINGS: "aih_settings",
  SEEDED: "aih_seeded_v1",
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] could not read "${key}", using fallback`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] could not save "${key}"`, err);
    return false;
  }
}

export function makeId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Inquiries ----------
export function getInquiries() {
  return safeGet(KEYS.INQUIRIES, []);
}
export function saveInquiry(inquiry) {
  const list = getInquiries();
  const next = [...list, inquiry];
  safeSet(KEYS.INQUIRIES, next);
  return next;
}
export function updateInquiry(id, updates) {
  const next = getInquiries().map((i) => (i.id === id ? { ...i, ...updates } : i));
  safeSet(KEYS.INQUIRIES, next);
  return next;
}
export function deleteInquiry(id) {
  const next = getInquiries().filter((i) => i.id !== id);
  safeSet(KEYS.INQUIRIES, next);
  return next;
}
export function findInquiry(id) {
  return getInquiries().find((i) => i.id === id) || null;
}

// ---------- Leads ----------
export function getLeads() {
  return safeGet(KEYS.LEADS, []);
}
export function saveLead(lead) {
  const next = [...getLeads(), lead];
  safeSet(KEYS.LEADS, next);
  return next;
}
export function updateLead(id, updates) {
  const next = getLeads().map((l) => (l.id === id ? { ...l, ...updates } : l));
  safeSet(KEYS.LEADS, next);
  return next;
}
export function deleteLead(id) {
  const next = getLeads().filter((l) => l.id !== id);
  safeSet(KEYS.LEADS, next);
  return next;
}

// ---------- Follow-up Tasks ----------
export function getTasks() {
  return safeGet(KEYS.TASKS, []);
}
export function saveTask(task) {
  const next = [...getTasks(), task];
  safeSet(KEYS.TASKS, next);
  return next;
}
export function updateTask(id, updates) {
  const next = getTasks().map((t) => (t.id === id ? { ...t, ...updates } : t));
  safeSet(KEYS.TASKS, next);
  return next;
}

// ---------- Automation History ----------
export function getAutomationHistory() {
  return safeGet(KEYS.HISTORY, []);
}
export function saveAutomationEvent(event) {
  const next = [{ id: makeId("evt"), timestamp: new Date().toISOString(), ...event }, ...getAutomationHistory()];
  safeSet(KEYS.HISTORY, next);
  return next;
}

// ---------- Settings ----------
const DEFAULT_SETTINGS = {
  demoAiMode: true,
  automationEnabled: true,
  defaultFollowUpDays: 1,
  defaultPriority: "Medium",
};
export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...safeGet(KEYS.SETTINGS, {}) };
}
export function saveSettings(settings) {
  safeSet(KEYS.SETTINGS, settings);
  return settings;
}

// ---------- Seed flag ----------
export function isSeeded() {
  return safeGet(KEYS.SEEDED, false);
}
export function markSeeded() {
  safeSet(KEYS.SEEDED, true);
}
