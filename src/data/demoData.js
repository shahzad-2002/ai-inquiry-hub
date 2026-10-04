// Raw demo inquiries used to seed the app on first run. These are run
// through the real automationService pipeline (not hard-coded results) so
// every downstream page (leads, follow-ups, history, dashboard) is populated
// with genuinely generated data.

export const DEMO_INQUIRIES = [
  {
    clientName: "Maria Lopez",
    email: "maria@brewcorner.com",
    business: "Brew Corner Coffee Shop",
    message: "Hi, I need a logo for my new coffee shop. I need it within one week.",
  },
  {
    clientName: "James Carter",
    email: "james@urbanthreads.com",
    business: "Urban Threads",
    message: "I need 10 Instagram posts and 3 promotional banners for my clothing brand.",
  },
  {
    clientName: "Fatima Noor",
    email: "fatima@noorstudio.com",
    business: "Noor Studio",
    message:
      "Can you redesign my existing brand identity? This is urgent because our launch is next week.",
  },
  {
    clientName: "David Kim",
    email: "david@kimconsulting.com",
    business: "Kim Consulting",
    message: "I need a simple business card design.",
  },
];
