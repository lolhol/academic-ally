import * as fs from "fs";

import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { stringify } from "querystring";
import { MANAGER } from "../core";

export default async function requestUpdate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = JSON.parse(req.body);
  const token = parsed.token;

  const managerRes = MANAGER.getUpdate(token);

  if (
    managerRes.isError == true ||
    managerRes.isResponded == false ||
    managerRes.response === null
  ) {
    res
      .status(200)
      .json({ responded: managerRes.isResponded, error: managerRes.isError });
  } else {
    res.status(200).json({
      responded: managerRes.isResponded,
      error: managerRes.isError,
      question: managerRes.response?.question,
      answers: managerRes.response?.answers,
    });
  }
}
