import { runHandler } from '../../_lib/route-handler'
import handler from '../../_handlers/engines/ping'

export async function POST(request) {
  return runHandler(request, handler)
}