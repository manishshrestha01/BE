import { runHandler } from '../../_lib/route-handler'
import handler from '../../_handlers/indexnow/blog-event'

export async function POST(request) {
  return runHandler(request, handler)
}