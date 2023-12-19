export function parseGPTResponce(res: string): string[] {
  return res.split("??");
}

// TODO: have to re-work @this
