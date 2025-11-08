import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../app";

// Forward every Vercel request to your Express app.
// Express expects Node's req/res objects; the cast is fine here.
export default (req: VercelRequest, res: VercelResponse) => {
  // @ts-ignore
  return app(req, res);
};
