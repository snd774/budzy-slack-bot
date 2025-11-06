import 'dotenv/config';
import express from 'express';

const app = express();

// health & root
app.get('/', (_req, res) => res.status(200).send('Budzy is alive ✅'));
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Lazy-load Bolt only when env vars are present
const hasSlackEnv = !!(process.env.SLACK_SIGNING_SECRET && process.env.SLACK_BOT_TOKEN);

if (hasSlackEnv) {
  const { App, ExpressReceiver } = await import('@slack/bolt');
  const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: '/slack/events'
  });
  const bolt = new App({ token: process.env.SLACK_BOT_TOKEN, receiver });

  // minimal handlers
  bolt.command('/budzy', async ({ ack, respond, command }) => {
    await ack();
    await respond({ text: `Hi <@${command.user_id}>! Budzy here.`, response_type: 'ephemeral' });
  });

  bolt.event('app_home_opened', async ({ client, event }) => {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: 'Welcome to Budzy 👋' } },
          { type: 'section', text: { type: 'mrkdwn', text: 'Use `/budzy` to say hi!' } }
        ]
      }
    });
  });

  bolt.event('team_join', async ({ event, client }) => {
    await client.chat.postMessage({ channel: event.user.id, text: `Welcome <@${event.user.id}> 🎉` });
  });

  // mount Bolt receiver into our express app
  app.use(receiver.app);
} else {
  // fallback route so Slack verification shows something sane
  app.post('/slack/events', (_req, res) => {
    res.status(503).send('Slack not configured yet');
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`⚡️ Budzy is running on port ${port} (Slack ${hasSlackEnv ? 'ON' : 'OFF'})`));
