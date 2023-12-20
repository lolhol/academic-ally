import type PromptGPTRequest from "@/interfaces/PromptGPTRequest";
import { MANAGER, TOKENLEN } from "@/pages/api/internal/main";
import { generateToken } from "@/pages/api/internal/user/TokenUtils";
import * as fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Recieved!");
  const parsed = JSON.parse(req.body) as PromptGPTRequest;
  const token = generateToken(TOKENLEN);
  const GPTPromptRes = MANAGER.promptGPT(
    token,
    parsed.prompt,
    parsed.textbook,
    parsed.chapter
  );

  res
    .status(200)
    .json({ success: GPTPromptRes, token: GPTPromptRes ? token : "0001" });
}
