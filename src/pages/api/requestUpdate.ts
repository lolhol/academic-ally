import { MANAGER } from "@/internal/AcademicAlly";
import * as fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { stringify } from "querystring";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = JSON.parse(req.body);
  const token = parsed.token;

  // not sure dis gon work but EEHHHH
  const managerRes = MANAGER.getUpdate(token);
  let a;

  if (typeof managerRes === "string") {
    a = {
      success: true,
      type: "string",
      result: managerRes,
    };
  } else {
    const result = {
      question: managerRes.question,
      answers: managerRes.answers,
    };

    a = {
      success: true,
      type: "class",
      result: result,
    };
  }

  res.status(200).json({ success: true, data: a });
}
