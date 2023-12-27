import type PromptGPTRequest from "@/interfaces/PromptGPTRequest";
const { MANAGER, TOKENLEN } = await import("../core");
import { generateToken } from "@/internal/user/TokenUtils";
import "./requestUpdate";
import * as fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";
import { getMultiChoicePrompt } from "../prompt/promptMakerUtil";

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
    getMultiChoicePrompt(),
    parsed.textbook,
    parsed.chapter
  );

  if (prevToken !== "0000") {
    MANAGER.updateTokenUserQAStorage(prevToken, token);
  }

  res.status(200).json({
    success: GPTPromptRes,
    token: GPTPromptRes ? token : "0000",
    generating: false,
  });
}
