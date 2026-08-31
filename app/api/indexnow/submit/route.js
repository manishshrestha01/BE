import { runHandler } from '../../_lib/route-handler'
import handler from '../../_handlers/indexnow/submit'

export async function POST(request) {
  return runHandler(request, handler)
}