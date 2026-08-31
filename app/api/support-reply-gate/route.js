import { runHandler } from '../_lib/route-handler'
import handler from '../_handlers/support-reply-gate'

export async function GET(request) {
  return runHandler(request, handler)
}

export async function POST(request) {
  return runHandler(request, handler)
}