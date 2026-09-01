import { runHandler } from '../../_lib/route-handler'
import handler from '../../_handlers/engines/status'

export async function GET(request) {
  return runHandler(request, handler)
}

export async function HEAD(request) {
  return runHandler(request, handler)
}