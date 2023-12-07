export function parseGPTResponce(res: string): string[] {
  return res.split("??");
}
