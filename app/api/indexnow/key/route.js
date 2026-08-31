import { runHandler } from '../../_lib/route-handler'
import handler from '../../_handlers/indexnow/key'

export async function GET(request) {
  return runHandler(request, handler)
}