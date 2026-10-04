// Orchestrates the full automation pipeline: Inquiry → AI Analysis →
// Lead Creation → Reply Generation → Follow-up Task → History logging.
// Kept separate from both aiService (pure analysis) and storageService
// (pure persistence) and separate from UI components.

import * as ai from "./aiService.js";
import * as store from "./storageService.js";

/**
 * Automation Rule 1: a High or Urgent priority lead gets an urgent,
 * same-day/next-day follow-up instead of the default follow-up period.
 */
function ruleDetermineFollowUpDueDate(priority, defaultDays) {
  const due = new Date();
  if (priority === "Urgent") due.setDate(due.getDate()); // today
  else if (priority === "High") due.setDate(due.getDate() + 1); // tomorrow
  else due.setDate(due.getDate() + Number(defaultDays || 1));
  return due.toISOString().slice(0, 10);
}

/**
 * Runs the complete automation workflow for one inquiry.
 * Returns { inquiry, lead, task, analysis, reply } — any of lead/task/reply
 * may be null if automation is disabled in Settings.
 */
export function processInquiry({ clientName, email, business, message }) {
  const settings = store.getSettings();

  // Step 1: create the inquiry record
  const inquiryId = store.makeId("inq");
  let inquiry = {
    id: inquiryId,
    clientName,
    email: email || "",
    business: business || "",
    message,
    status: "Processing",
    processedAt: null,
    createdAt: new Date().toISOString(),
  };
  store.saveInquiry(inquiry);
  store.saveAutomationEvent({
    type: "inquiry_received",
    description: `Inquiry received from ${clientName}`,
    inquiryId,
  });

  // Step 2: AI analysis (Automation Rule 3 — urgency keywords — runs inside detectPriority)
  const analysis = ai.analyzeInquiry(message);
  store.saveAutomationEvent({
    type: "inquiry_analyzed",
    description: `Inquiry analyzed — category detected`,
    inquiryId,
  });
  store.saveAutomationEvent({
    type: "category_assigned",
    description: `Category assigned: ${analysis.category}`,
    inquiryId,
  });
  store.saveAutomationEvent({
    type: "priority_assigned",
    description: `Priority assigned: ${analysis.priority}`,
    inquiryId,
  });

  inquiry = store
    .updateInquiry(inquiryId, {
      status: "Analyzed",
      category: analysis.category,
      priority: analysis.priority,
      service: analysis.service,
      requirements: analysis.requirements,
      deadline: analysis.deadline,
      budget: analysis.budget,
      business: inquiry.business || analysis.business,
      processedAt: new Date().toISOString(),
    })
    .find((i) => i.id === inquiryId);

  let lead = null;
  let task = null;
  let replyText = null;

  // Automation Rule 4: if automation is enabled, a successfully analyzed
  // inquiry automatically creates a Lead and generates a Reply.
  if (settings.automationEnabled) {
    // Step 3: generate reply
    replyText = ai.generateReply(analysis, clientName, 0);
    store.updateInquiry(inquiryId, { reply: replyText, replyVariant: 0 });
    store.saveAutomationEvent({
      type: "reply_generated",
      description: `AI reply generated for ${clientName}`,
      inquiryId,
    });

    // Step 4: create lead
    const leadId = store.makeId("lead");
    lead = {
      id: leadId,
      inquiryId,
      client: clientName,
      service: analysis.service,
      category: analysis.category,
      priority: analysis.priority,
      requirements: analysis.requirements,
      deadline: analysis.deadline,
      status: "New",
      date: new Date().toISOString().slice(0, 10),
    };
    store.saveLead(lead);
    store.saveAutomationEvent({
      type: "lead_created",
      description: `Lead created for ${clientName} (${analysis.category})`,
      inquiryId,
      leadId,
    });

    // Step 5: create follow-up task (Automation Rule 1 applied here)
    const dueDate = ruleDetermineFollowUpDueDate(analysis.priority, settings.defaultFollowUpDays);
    const taskId = store.makeId("task");
    task = {
      id: taskId,
      leadId,
      inquiryId,
      name:
        analysis.priority === "Urgent" || analysis.priority === "High"
          ? `Urgent follow-up with ${clientName}`
          : `Follow up with ${clientName}`,
      client: clientName,
      dueDate,
      priority: analysis.priority,
      status: "Pending",
    };
    store.saveTask(task);
    store.saveAutomationEvent({
      type: "followup_created",
      description: `Follow-up task created, due ${dueDate}`,
      inquiryId,
      leadId,
      taskId,
    });

    store.updateInquiry(inquiryId, { status: "Automated", leadId, taskId });
  } else {
    store.saveAutomationEvent({
      type: "automation_skipped",
      description: "Automation is disabled in Settings — lead/follow-up were not created",
      inquiryId,
    });
    store.updateInquiry(inquiryId, { status: "Analyzed (automation off)" });
  }

  store.saveAutomationEvent({
    type: "automation_completed",
    description: `Automation workflow completed for ${clientName}`,
    inquiryId,
  });

  return {
    inquiry: store.findInquiry(inquiryId),
    lead,
    task,
    analysis,
    reply: replyText,
  };
}

/** The ordered list of stages shown by the processing animation UI. */
export const PROCESSING_STAGES = [
  "Analyzing inquiry...",
  "Extracting client information...",
  "Identifying service...",
  "Checking priority...",
  "Generating response...",
  "Analysis Complete",
];

/** Human-readable automation rules, shown on the Automation page. */
export const AUTOMATION_RULES = [
  { id: 1, when: "Priority = High or Urgent", then: "Create an urgent (same/next-day) follow-up task instead of the default period." },
  { id: 2, when: "Message matches a service category's keywords", then: "Category and Service are set automatically (e.g. \"logo\" → Logo Design)." },
  { id: 3, when: "Message contains urgency words (urgent, ASAP, today, tomorrow...)", then: "Priority is escalated to High/Urgent." },
  { id: 4, when: "An inquiry is successfully analyzed and automation is enabled", then: "A Lead is created and an AI reply is generated automatically." },
];
