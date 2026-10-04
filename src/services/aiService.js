// Rule-based "AI" simulation service. No external API is called — every
// function here analyzes the inquiry text with plain JavaScript (keyword
// matching + regex). The function names and return shapes are written so a
// real LLM API could be dropped in later (e.g. replacing the body of
// analyzeInquiry with a fetch() call) without changing any UI code.

export const CATEGORIES = [
  "Logo Design",
  "Branding",
  "Social Media Design",
  "UI/UX Design",
  "Marketing",
  "General Inquiry",
  "Other",
];

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const URGENT_WORDS = ["urgent", "asap", "immediately", "emergency", "today", "tomorrow", "launch soon", "right away"];

/** Looks at the raw text and assigns a service category by keyword match. */
export function classifyInquiry(text) {
  const t = text.toLowerCase();

  if (/\blogo\b/.test(t)) return "Logo Design";
  if (/\b(brand identity|rebrand|branding|brand guidelines)\b/.test(t)) return "Branding";
  if (/\b(instagram|facebook|social media|promotional banner|story|post[s]?\b)/.test(t)) return "Social Media Design";
  if (/\b(app design|website design|ui|ux|wireframe|mockup|landing page)\b/.test(t)) return "UI/UX Design";
  if (/\b(marketing|campaign|advertisement|\bad\b|ads\b)\b/.test(t)) return "Marketing";
  if (/\b(business card|letterhead|flyer|brochure|sign|banner)\b/.test(t)) return "Branding";
  if (t.trim().length === 0) return "Other";
  return "General Inquiry";
}

/** Scans for urgency keywords and an extracted deadline to assign a priority level. */
export function detectPriority(text, deadline) {
  const t = text.toLowerCase();
  const hasUrgentWord = URGENT_WORDS.some((w) => t.includes(w));

  if (hasUrgentWord) return "Urgent";

  if (deadline) {
    const days = deadlineToDays(deadline);
    if (days !== null) {
      if (days <= 2) return "High";
      if (days <= 7) return "Medium";
      return "Low";
    }
  }
  return deadline ? "Medium" : "Low";
}

function deadlineToDays(deadlineText) {
  const t = deadlineText.toLowerCase();
  const numMatch = t.match(/(\d+)\s*day/);
  if (numMatch) return parseInt(numMatch[1], 10);
  const weekMatch = t.match(/(\d+)\s*week/);
  if (weekMatch) return parseInt(weekMatch[1], 10) * 7;
  if (t.includes("one week") || t.includes("a week") || t.includes("next week")) return 7;
  if (t.includes("tomorrow")) return 1;
  if (t.includes("today")) return 0;
  return null;
}

/** Pulls out business name, service/requirements, deadline, and budget from free text. */
export function extractRequirements(text) {
  const t = text;

  // Business name: "for my X brand/shop/clothing brand/business" or "own a X"
  let business = "Not specified";
  const businessPatterns = [
    /for my ([a-zA-Z0-9&'\- ]{2,40}?)(?:\.|,| brand| shop| store| business|$)/i,
    /own a ([a-zA-Z0-9&'\- ]{2,40}?)(?:\.|,|$)/i,
    /my ([a-zA-Z0-9&'\- ]{2,40}?) brand/i,
  ];
  for (const re of businessPatterns) {
    const m = t.match(re);
    if (m && m[1] && m[1].trim().length > 1) {
      business = m[1].trim().replace(/^(new|a|an|the)\s+/i, "");
      business = business.charAt(0).toUpperCase() + business.slice(1);
      break;
    }
  }

  // Deadline: "within 5 days", "within one week", "next week", "tomorrow", "today"
  let deadline = "";
  const deadlineMatch =
    t.match(/within\s+\d+\s+(day|days|week|weeks)/i) ||
    t.match(/within\s+(one|a)\s+week/i) ||
    t.match(/\bnext week\b/i) ||
    t.match(/\btomorrow\b/i) ||
    t.match(/\btoday\b/i);
  if (deadlineMatch) deadline = deadlineMatch[0];

  // Budget: "$500", "budget of 500", "500 dollars"
  let budget = "";
  const budgetMatch = t.match(/\$\s?\d[\d,]*/) || t.match(/budget of\s+\$?\d[\d,]*/i) || t.match(/\d[\d,]*\s*dollars/i);
  if (budgetMatch) budget = budgetMatch[0];

  // Requirements: quantities + item keywords, e.g. "10 Instagram posts", "2 promotional banners"
  const requirementMatches = [
    ...t.matchAll(
      /\d+\s*(instagram posts?|facebook posts?|promotional banners?|banners?|business cards?|logos?|posts?|stories)/gi
    ),
  ].map((m) => m[0].trim());

  let requirements = requirementMatches.length > 0 ? requirementMatches.join(" + ") : "";
  if (!requirements) {
    // fall back to a short, trimmed summary of the message itself
    requirements = t.length > 140 ? t.slice(0, 140).trim() + "…" : t.trim();
  }

  return { business, requirements, deadline, budget };
}

/** Runs the full analysis pipeline on one inquiry message. */
export function analyzeInquiry(text) {
  const category = classifyInquiry(text);
  const { business, requirements, deadline, budget } = extractRequirements(text);
  const priority = detectPriority(text, deadline);
  const service = category;

  return { category, service, business, requirements, deadline, budget, priority };
}

const REPLY_OPENERS = {
  Urgent: "Thanks for reaching out — I can see this is time-sensitive, so I'm prioritizing it.",
  High: "Thanks for getting in touch! I understand you're working to a tight timeline.",
  Medium: "Thank you for your inquiry — I'd be happy to help with this.",
  Low: "Thanks for reaching out, and for sharing the details below.",
};

const CATEGORY_LINES = {
  "Logo Design": "I can put together logo concepts that fit your brand's style.",
  Branding: "I can help build out a cohesive brand identity for you.",
  "Social Media Design": "I can get a set of on-brand social media assets ready for you.",
  "UI/UX Design": "I can help design a clean, user-friendly interface for this.",
  Marketing: "I can put together marketing creative tailored to your campaign.",
  "General Inquiry": "Let me take a closer look and get back to you with next steps.",
  Other: "Let me review the details and follow up with next steps.",
};

/** Builds a reply that actually references the specific inquiry's extracted details. */
export function generateReply(analysis, clientName = "there", variant = 0) {
  const name = clientName && clientName.trim() ? clientName.trim() : "there";
  const opener = REPLY_OPENERS[analysis.priority] || REPLY_OPENERS.Medium;
  const line = CATEGORY_LINES[analysis.category] || CATEGORY_LINES.Other;

  const reqLine = analysis.requirements
    ? `Based on your message, here's what I've noted: ${analysis.requirements}.`
    : "";
  const deadlineLine = analysis.deadline ? ` You mentioned a timeline of ${analysis.deadline} — I'll plan around that.` : "";
  const budgetLine = analysis.budget ? ` I've also noted your budget of ${analysis.budget}.` : "";

  const variants = [
    `Hi ${name},\n\n${opener} ${line}\n\n${reqLine}${deadlineLine}${budgetLine}\n\nI'll follow up shortly with next steps. Looking forward to working together!`,
    `Hello ${name},\n\n${opener}\n\n${reqLine}${deadlineLine}${budgetLine} ${line}\n\nI'll be in touch soon with the next steps — talk soon!`,
    `Hi ${name},\n\nThanks so much for the details.${deadlineLine}${budgetLine}\n\n${reqLine} ${line}\n\nI'll reach out shortly to move this forward.`,
  ];

  return variants[variant % variants.length];
}

/** Produces a different reply variant than the one currently shown. */
export function regenerateReply(analysis, clientName, currentVariant = 0) {
  const next = (currentVariant + 1) % 3;
  return { text: generateReply(analysis, clientName, next), variant: next };
}
