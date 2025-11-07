const express = require("express");
const { App, ExpressReceiver } = require("@slack/bolt");

const PORT = process.env.PORT || 3000;
const hasSlackCreds = !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET);

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || "missing",
  endpoints: "/slack/events"
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN || "xoxb-missing",
  receiver
});

// Slash command: /hello
app.command("/hello", async ({ ack, respond }) => {
  await ack();
  await respond("👋 Hey! Your bot is wired up.");
});

// App Home
app.event("app_home_opened", async ({ event, client }) => {
  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: [
          { type: "section", text: { type: "mrkdwn", text: "*Welcome to Budzy!*" } },
          { type: "section", text: { type: "mrkdwn", text: "Try `/hello` in any channel." } }
        ]
      }
    });
  } catch (_) {}
});

// New member welcome
app.event("team_join", async ({ event, client }) => {
  try {
    await client.chat.postMessage({
      channel: event.user.id,
      text: "🎉 Welcome aboard! Try `/hello` to test me."
    });
  } catch (_) {}
});

// Health route
receiver.app.get("/health", (_req, res) => {
  res.setHeader("content-type", "application/json");
  res.status(200).send(JSON.stringify({ ok: true, hasSlackCreds }));
});

// Boot
(async () => {
  try {
    await app.start(PORT);
    console.log(`✅ App listening on port ${PORT}`);
  } catch (err) {
    console.error("Startup error, but keeping server alive:", err);
    const expressOnly = express();
    expressOnly.get("/health", (_req, res) => res.status(200).send({ ok: true, bolt: false }));
    expressOnly.all("*", (_req, res) => res.status(200).send("Up"));
    expressOnly.listen(PORT, () => console.log(`Express-only server on ${PORT}`));
  }
})();
