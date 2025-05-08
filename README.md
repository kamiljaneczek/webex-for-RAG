# webex-for-RAG

Scrape Webex Teams channels in order to feed it to vector db as part of RAG pattern. Later use this data by your LLM.

## Installation

- npm run install
- cp .env-sample .env
- obtain access token from here: [https://developer.webex.com/docs/getting-started](https://developer.webex.com/docs/getting-started) and save it in .env file
- obtain room ID from here: [https://developer.webex.com/docs/api/v1/rooms/list-rooms](https://developer.webex.com/docs/api/v1/rooms/list-rooms) and save it in .env file

## Usage

- npm run dev
- on successful run file messages.txt is created

## Resources

https://medium.com/nmc-techblog/building-a-cli-with-node-js-in-2024-c278802a3ef5
https://github.com/lirantal/nodejs-cli-apps-best-practices

# My Node CLI

My Node CLI is a tool for doing awesome things directly from your terminal.

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm build && pnpm run run
```
