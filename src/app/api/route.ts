import {OpenAI} from "openai";
import * as fs from 'fs'
import { stringify } from "querystring";
import { Assistant } from "next/font/google";

const openai = new OpenAI({
    apiKey: "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"
  });

const generateAssistant = async (fileid: string) => {
    const file = await openai.files.create({
        file: fs.createReadStream("knowledge.pdf"),
        purpose: "assistants",
    });
    const assistant = await openai.beta.assistants.create({
        instructions: "You are a question making assistant. Prompts must be as concise as possible. Only provide what you are supposed to provide, nothing more.",
        model: "gpt-4-1106-preview",
        tools: [{"type": "retrieval"}],
        file_ids: [fileid]
    });
    return assistant;
}

async function response(req: string, assistant: OpenAI.Beta.Assistants.Assistant){
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: req
        }
    )
    const run = await openai.beta.threads.runs.create(
        thread.id,
        {assistant_id: assistant.id}
    )
    while (true){
        const status = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        )
        if (status.status == "completed"){
            const messages = await openai.beta.threads.messages.list(
                thread.id
            );
            return messages.data[0].content[0];
        }
    }
}