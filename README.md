# DCC sample: pingpong

[back to Glitch](https://glitch.com/edit/#!/dcc-sample-pingpong) /
[back to GitHub](https://github.com/wh0/dcc-sample-pingpong)

This is a starter project for building a Discord bot with daffy-circular-chartreuse (DCC,
[more info](https://support.glitch.com/t/a-prototype-bot-relay-for-discord/27845)) and Eris.

Or maybe this isn't that at all.
Maybe this is a project someone remixed from that, and they never bothered to update the README.
Let's try not to be that someone.

## Getting started

1. Remix this project on Glitch.
2. Set your desired project name.
3. Run
   ```sh
   "admin:$(head -c16 /dev/urandom | base64)"
   ```
   in the project terminal, get the result, and put it in `DCC_SECRET` in `.env`.
4. Create an application in the
   [Discord Developer Portal](https://discord.com/developers/applications), get the "CLIENT ID,"
   and put it in `BOT_USER_ID` in `.env`.
5. Add a bot to the application in the
   [Discord Developer Portal](https://discord.com/developers/applications), get the "TOKEN," and
   put it in `DISCORD_TOKEN` in `.env`.
