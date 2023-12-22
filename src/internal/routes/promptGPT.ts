import type PromptGPTRequest from "@/interfaces/PromptGPTRequest";
const { MANAGER, TOKENLEN } = await import("../core");
import { generateToken } from "@/internal/user/TokenUtils";
import "./requestUpdate";
import * as fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function promptGPT(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = JSON.parse(req.body) as PromptGPTRequest;
  const prevToken = parsed.token;

  if (MANAGER.isGeneratingFor(prevToken)) {
    res.status(200).json({
      success: true,
      token: prevToken,
      generating: true,
    });

    return;
  }

  const token = generateToken(TOKENLEN);
  const GPTPromptRes = MANAGER.promptGPT(
    token,
    parsed.prompt,
    parsed.textbook,
    parsed.chapter
  );

  res.status(200).json({
    success: GPTPromptRes,
    token: GPTPromptRes ? token : "0001",
    generating: false,
  });
}
