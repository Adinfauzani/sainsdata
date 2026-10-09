import { route } from "../_lib/route"

export default function handler(req: Request): Promise<Response> {
  return route(req)
}
