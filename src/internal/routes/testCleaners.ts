import type { NextApiRequest, NextApiResponse } from "next";
import { MANAGER } from "../core";

export default async function promptGPT(
  req: NextApiRequest,
  res: NextApiResponse
) {
  MANAGER.startCleaning();
  res.status(200).json({ status: true });
}
