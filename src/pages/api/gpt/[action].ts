import type PromptGPTRequest from "@/interfaces/PromptGPTRequest";
import type { NextApiRequest, NextApiResponse } from "next";
import promptGPT from "@/internal/routes/startGenMultiChoice";
import requestUpdate from "@/internal/routes/requestUpdate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query;

  if (action === "startGenMultiChoice") {
    await promptGPT(req, res);
  } else if (action === "requestUpdate") {
    await requestUpdate(req, res);
  } else {
    res.status(404).json({ success: false });
  }
}
