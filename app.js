import 'dotenv/config';
import { App, ExpressReceiver } from '@slack/bolt';

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: '/slack/events'
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

receiver.app.get('/', (_req, res) => res.status(200).send('Budzy is alive ✅'));
receiver.app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.command('/budzy', async ({ ack, respond, command }) => {
  await ack();
  await respond({
    text: `Hi <@${command.user_id}>! Budzy here. Try opening the app home or invite a teammate to test onboarding.`,
    response_type: 'ephemeral'
  });
});

app.event('app_home_opened', async ({ client, event }) => {
  await client.views.publish({
    user_id: event.user,
    view: {
      type: 'home',
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: 'Welcome to Budzy 👋' } },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'This is your onboarding hub. Use `/budzy` or add a teammate to see a welcome DM.'
          }
        }
      ]
    }
  });
});

app.event('team_join', async ({ event, client }) => {
  await client.chat.postMessage({
    channel: event.user.id,
    text: `Hey <@${event.user.id}> — welcome aboard! 🎉 I'm Budzy.`
  });
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Budzy is running on port ${port}`);
})();
