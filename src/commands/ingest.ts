import dotenv from "dotenv";
import * as fs from "fs";
import { IData, IMessage } from "../types.js";

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const roomId = process.env.ROOM_ID;

export async function ingest() {
  let hasMessages = true;
  let lastMessageId =
    "Y2lzY29zcGFyazovL3VzL01FU1NBR0UvYmVkZjEwODAtNzFhZi0xMWVmLWI0NDctNzdmNDBiNDBiZjZi";
  console.log("Starting...");

  while (hasMessages) {
    fs.appendFileSync("./messages.txt", "\n------\n");
    const URL =
      lastMessageId == ""
        ? `https://webexapis.com/v1/messages?roomId=${roomId}&max=5000`
        : `https://webexapis.com/v1/messages?roomId=${roomId}&max=5000&beforeMessage=${lastMessageId}`;
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = (await response.json()) as IData;

    if (!data || !data.items || !Array.isArray(data.items)) {
      console.error("Invalid response format from API:", data);
      hasMessages = false;
      continue;
    }

    const messages = data.items;
    if (messages.length === 0) {
      hasMessages = false;
      continue;
    }

    lastMessageId = messages[messages.length - 1].id;

    const filteredMessages = messages.filter((message: IMessage) => {
      console.log("message: ", message);
      console.log("message.parentId: ", message.parentId);
      console.log(
        "take it or not:",
        message.parentId == "" ||
          message.parentId == null ||
          message.parentId == undefined
      );
      return (
        message.parentId == "" ||
        message.parentId == null ||
        message.parentId == undefined
      );
    });

    const messagesWithReplies: IMessage[] = [];

    for (const message of filteredMessages) {
      const { id, parentId, text, created } = message;
      const storeMessage = { id, parentId, text, created, level: "parent" };
      // messagesWithReplies.push(storeMessage);
      fs.appendFileSync(
        "./messages.txt",
        `ID: ${id}\n Text: ${text}\n Date: ${created}\n`
      );

      const replies = await fetchReplies(message.id);
      messagesWithReplies.push(...replies);
      fs.appendFileSync("./messages.txt", `\n------\n`);
    }

    /*     fs.appendFileSync(
      "./messages.json",
      JSON.stringify(messagesWithReplies, null, 2)
    ); */

    hasMessages = false;
    if (data.items.length < 100) {
      // hasMessages = false;
    }
  }
}

async function fetchReplies(messageId: string) {
  console.log(`Fetching replies for message ${messageId}`);
  const messagesWithReplies: IMessage[] = [];
  const repliesResponse = await fetch(
    `https://webexapis.com/v1/messages?roomId=${roomId}&max=100&parentId=${messageId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const replyData = (await repliesResponse.json()) as IData;
  const replyMessages = replyData.items;
  console.log("replymessage: ", replyMessages);

  if (replyMessages != undefined && replyMessages.length > 0) {
    console.log(
      `Found ${replyMessages.length} replies for message ${messageId}`
    );

    let reversedMessages = replyMessages.slice().reverse();

    reversedMessages.forEach((replyMessage: IMessage) => {
      fs.appendFileSync("./messages.txt", `---\n`);
      const { id, parentId, text, created } = replyMessage;
      const storeReply = { id, parentId, text, created, level: "child" };
      fs.appendFileSync(
        "./messages.txt",
        `ID: ${id}\n  ParentID: ${parentId}\n Text: ${text}\n Date: ${created}\n`
      );

      // messagesWithReplies.push(storeReply);
    });
  }
  return messagesWithReplies;
}
