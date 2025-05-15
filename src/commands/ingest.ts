import dotenv from "dotenv";
import * as fs from "fs";
import { IData, IMessage } from "../types.js";

dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;

const roomId = process.env.ROOM_ID;

export async function ingest() {
  let hasMessages = true;
  let lastMessageId = "";
  console.log("Starting...");
  const allMessagesData: any[] = [];

  while (hasMessages) {
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
      return (
        message.parentId == "" ||
        message.parentId == null ||
        message.parentId == undefined
      );
    });

    for (const message of filteredMessages) {
      const { id, parentId, text, created } = message;
      const storeMessage: any = {
        //  id,
        //  parentId,
        parent: text,
        //   created,
        //  level: "parent",
        replies: [],
      };

      const replies = await fetchReplies(message.id);
      storeMessage.replies = replies;
      allMessagesData.push(storeMessage);
    }

    // Simplified loop termination: process one batch then stop.
    // Remove or adjust this for full ingestion.
    hasMessages = false;
    if (data.items.length < 100) {
      // This condition might be part of pagination logic
      // hasMessages = false; //
    }
  }

  fs.writeFileSync("./messages.json", JSON.stringify(allMessagesData, null, 2));
  console.log("Finished ingesting messages. Data saved to messages.json");
}

async function fetchReplies(messageId: string): Promise<IMessage[]> {
  console.log(`Fetching replies for message ${messageId}`);
  const collectedReplies: IMessage[] = [];
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
      const { id, parentId, text, created } = replyMessage;
      //  const storeReply = { id, parentId, text, created, level: "child" };
      const storeReply = { response: text };
      //@ts-ignore
      collectedReplies.push(storeReply as IMessage);
    });
  }
  return collectedReplies;
}
