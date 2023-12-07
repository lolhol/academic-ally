import { MANAGER, TOKENLEN } from "@/internal/AcademicAlly";
import { generateToken } from "@/internal/User/TokenUtils";
import * as fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = JSON.parse(req.body);
  const token = generateToken(TOKENLEN);
  console.log("!!!");
  const GPTPromptRes = MANAGER.promptGPT(
    token,
    parsed.prompt,
    parsed.textbook,
    parsed.chapter
  );

  res
    .status(200)
    .json({ success: GPTPromptRes, token: GPTPromptRes ? token : "0000" });
}
