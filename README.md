# roleypoly

a discord bot & web ui for managing self-assignable roles.

**Most likely, you'll want to go here: https://roleypoly.com** (or at the time of writing, `develop` is deployed to https://beta.roleypoly.com). This app is already hosted, you don't need to deal with deploying it or anything, I've already done it for you.

If you're here to report a bug or develop on Roleypoly, the rest of this document is for you.

Roleypoly is built with node.js, next.js, react/redux, eris, and little sprinkles of weird magic goo.

## developing/running your own

you'll need

- a discord app and bot token
- a node environment (maybe?)
- a docker environment
- a hard hat because it's time to go building!

Check `.env.example` for all the various possible configuration values. Roleypoly is configured entirely over environment variables. In development, you might want to copy `.env.example` to `.env` so you don't need to set this up in your shell.

### for developers

```
yarn
yarn dev:up # for docker-compose stuff
yarn dev
```

tooling notes:
- we use react, redux, and next.js.
- we use koa and a custom backend framework with some hot reloading on API and RPC.
- we use standardjs and stylelint for code style.
- we use flow-type, although possibly a little loosely.
- we use babel for transpiling and development tools.
- we use jest and enzyme for tests, pending more tooling for this.
- we use yarn workspaces and lerna to manage the mono repo.
- `yarn rpcrepl` for a fun REPL for RPC testing.

### for production

If you want an unedited latest version of roleypoly, it is available on the Docker Hub ([katie/roleypoly](https://hub.docker.com/r/katie/roleypoly)) for your using pleasure. An example docker-compose.yml is provided in `docker-compose.example.yml`, and all relevant environment variables (see `.env.example`) may be set there.

If you're not into Docker and/or want to deploy your own, simply run
```
yarn
yarn build
yarn start
```
and you're off to the production races (sort of, you'll want to set up a `.env` file.)

The relevant `Dockerfile` is also included, so `docker build` is a useful way to deploy this too.

## scope & goal of project

I wanted to create a bot that let servers fully express theirselves through roles. the primary goal is clear in that regard, and it started with a (desktop-only) web experience. originally, a command-based bot wasn't on the menu, but i've likened up to the idea; but the single requirement is it *must* work in a fuzzy-match situation.

One of the biggest problems I set out to solve was the problem of emojis. Discord supports them and bots try to, but the fact of the matter is, not every bot treats emojis as first class citizens; and users can't really remember roles either. The problem is fine with 10 roles that are easy to remember and explain. This is impossible to manage with 250, Discord's cap on roles.

The primary goal, all-in-all, is to provide the single, best, end-all user experience for a bot that manages roles; until Discord gives us this theirselves.

— kayteh

## need help? wanna help us?

If you need any help, [please join our discord](https://discord.gg/m4GpWYY). That is the best way to contact the developers.

If your server needs something in particular to accomodate your server's requirements of user-assignable roles, please reach out to me over DMs on Discord, or email at [roleypoly@kat.cafe](mailto:roleypoly@kat.cafe)

If you'd like to give us incentive to continue developing and hosting this bot, please consider supporting it through [Patreon](https://patreon.com/kata), or via [PayPal](https://paypal.me/kayteh). All support is extremely appreciated, and not required for the use of the service.
