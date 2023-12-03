import * as fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// e

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = JSON.parse(req.body);
  const openai = new OpenAI({
    apiKey: "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",
  });
  let ret = "---";
  if (parsed.textbook == "chemistry") {
    const assistant = await openai.beta.assistants.create({
      name: "Chemistry Tutor",
      instructions: parsed.instructions,
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: parsed.prompt,
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    while (true) {
      const run_status = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      if (run_status.status == "completed") {
        const message = await openai.beta.threads.messages.list(thread.id);
        ret = message.data[0].content[0].text.value;
        break;
      }
    }
  }
  if (parsed.textbook == "geometry") {
    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions: parsed.instructions,
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: parsed.prompt,
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    while (true) {
      const run_status = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      if (run_status.status == "completed") {
        const message = await openai.beta.threads.messages.list(thread.id);
        ret = message.data[0].content[0].text.value;
        break;
      }
    }
  }
  if (parsed.textbook == "The Book Thief") {
    const assistant = await openai.beta.assistants.create({
      name: "Book Thief Tutor",
      instructions: parsed.instructions,
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: parsed.prompt,
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    while (true) {
      const run_status = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      if (run_status.status == "completed") {
        const message = await openai.beta.threads.messages.list(thread.id);
        ret = message.data[0].content[0].text.value;
        break;
      }
    }
  }
  res.status(200).json({ success: true, val: ret });
}
