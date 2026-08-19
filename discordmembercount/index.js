require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const token = process.env.DISCORD_TOKEN;
const port = Number(process.env.PORT) || 3000;

if (!token) {
  console.error("Missing DISCORD_TOKEN environment variable.");
  process.exit(1);
}

// Small web server for a health/status page.
const app = express();

app.get("/", (_req, res) => {
  const botOnline = client.isReady();

  res.status(botOnline ? 200 : 503).send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>MemberCounter</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Arial, sans-serif;
      background: #4f6df5;
      color: white;
    }
    .card {
      width: min(90%, 520px);
      box-sizing: border-box;
      padding: 40px;
      text-align: center;
      background: #172d69;
      border: 3px solid #8fc9ff;
      border-radius: 24px;
      box-shadow: 0 12px 40px rgba(0,0,0,.2);
    }
    h1 { margin: 0 0 12px; font-size: 42px; }
    p { margin: 8px 0; font-size: 18px; }
    .status { font-weight: 700; color: #8ff0c1; }
  </style>
</head>
<body>
  <main class="card">
    <h1>MemberCounter</h1>
    <p>Discord member-count bot</p>
    <p class="status">${botOnline ? "● Online" : "● Starting..."}</p>
  </main>
</body>
</html>`);
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    discordReady: client.isReady(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Status website listening on port ${port}`);
});

// Discord client.
// MessageContent is required because ?membercount is a prefix/text command.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`MemberCounter is online as ${readyClient.user.tag}`);
  console.log(`Serving ${readyClient.guilds.cache.size} server(s).`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  const command = message.content.trim().toLowerCase();

  if (command === "?membercount") {
    const count = message.guild.memberCount;

    try {
      await message.reply(
        `👥 This server has **${count.toLocaleString()} members**.`
      );
    } catch (error) {
      console.error("Failed to send member-count reply:", error);
    }
  }
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down...");
  client.destroy();
  process.exit(0);
});

client.login(token).catch((error) => {
  console.error("Could not log in to Discord.");
  console.error(error);
  process.exit(1);
});
