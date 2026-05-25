import { loginUser } from "../../server/lib/auth-service";
import { runAuthHandler, type ApiRequest, type ApiResponse } from "../../server/lib/api-handler";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  return runAuthHandler(req, res, () => loginUser(req.body?.email, req.body?.password));
}
