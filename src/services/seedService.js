import * as store from "./storageService.js";
import { processInquiry } from "./automationService.js";
import { DEMO_INQUIRIES } from "../data/demoData.js";

/**
 * Runs once per browser. Processes the demo inquiries through the real
 * automation pipeline so the app opens with realistic, genuinely-generated
 * data instead of hard-coded numbers. Never runs twice, so it never
 * overwrites anything the user has since added or changed.
 */
export function seedDemoDataIfNeeded() {
  if (store.isSeeded()) return;
  DEMO_INQUIRIES.forEach((inq) => processInquiry(inq));
  store.markSeeded();
}
