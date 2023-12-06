import { MANAGER } from "@/internal/AcademicAlly";
import * as fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// e

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = JSON.parse(req.body);
  const token = parsed.token;

  // not sure dis gon work but EEHHHH
  res.status(200).json({ success: true, data: MANAGER.getUpdate(token) });
}
