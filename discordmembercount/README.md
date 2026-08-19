# MemberCounter

A small Discord bot that responds to:

`?membercount`

with the current member count of the Discord server.

It also includes a tiny web status page so it can be deployed as a normal web service.

## Requirements

- Node.js 18+
- A Discord application/bot
- A Discord server where you can install the bot
- Railway (recommended for 24/7 hosting)

## Run locally

1. Copy `.env.example` to `.env`.
2. Put your Discord bot token in `.env`.
3. Run:

```bash
npm install
npm start
```

## Discord Developer Portal setup

In your Discord application:

1. Open the **Bot** page.
2. Enable **Message Content Intent** under Privileged Gateway Intents.
3. Copy/reset the bot token and put it in `DISCORD_TOKEN`.
4. Install/invite the bot to your server with permission to **View Channels** and **Send Messages**.

The bot does not need the Server Members Intent for this basic member-count command.

## Railway 24/7 deployment

1. Create a GitHub repository and upload all files in this folder.
2. Open Railway and create a new project from your GitHub repository.
3. Add this environment variable:

`DISCORD_TOKEN` = your Discord bot token

4. Deploy.
5. Railway will run `npm start`.
6. Open the generated Railway domain to see the MemberCounter status page.

The Discord bot itself maintains a connection to Discord's gateway. Railway is the thing keeping the Node process running.

### Important about "free"

Railway currently offers a free trial with limited credits, but a genuinely always-on service may consume those credits. Railway's Hobby plan is currently $5/month and includes $5 of resource usage; extra usage can cost more.

## Commands

- `?membercount` — shows the current server member count.

## Security

Never put your bot token directly in `index.js`, commit `.env`, or post the token anywhere. If the token is ever exposed, reset it immediately in the Discord Developer Portal.
