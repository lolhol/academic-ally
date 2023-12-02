import * as fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai"

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    const openai = new OpenAI({
        apiKey: "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"
    });
    if (req.body == "chemistry"){

        const assistant = await openai.beta.assistants.create({
            name: "Chemistry Tutor",
            instructions: "Given this chemistry textbook and a chapter, create a random question with material related to said chapter.",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-4-1106-preview"
        });

    }
    if (req.body == "geometry"){
        const assistant = await openai.beta.assistants.create({
            name: "Math Tutor",
            instructions: "Given this geometry textbook and a chapter, create a random question with material related to said chapter.",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-4-1106-preview"
        });
        const thread = await openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(
            thread.id,
            {role: "user", content: "abla"}
        )
    }
    res.status(200).json({ sucess: true });
}
