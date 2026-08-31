import { runHandler } from '../_lib/route-handler'
import handler from '../_handlers/folder-colors'

export async function GET(request) {
  return runHandler(request, handler)
}

export async function POST(request) {
  return runHandler(request, handler)
}