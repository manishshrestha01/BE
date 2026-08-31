import { runHandler } from '../../_lib/route-handler'
import handler from '../../_handlers/support/send-email'

export async function POST(request) {
  return runHandler(request, handler)
}