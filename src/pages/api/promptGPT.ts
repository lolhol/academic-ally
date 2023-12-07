import { MANAGER, TOKENLEN } from "@/pages/api/internal/AcademicAlly";
import { generateToken } from "@/pages/api/internal/User/TokenUtils";
import * as fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("!!!");
  const parsed = JSON.parse(req.body);
  const token = generateToken(TOKENLEN);
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
