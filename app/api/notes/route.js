import { runHandler } from '../_lib/route-handler'
import handler from '../_handlers/notes'

export async function GET(request) {
  return runHandler(request, handler)
}

export async function OPTIONS(request) {
  return runHandler(request, handler)
}