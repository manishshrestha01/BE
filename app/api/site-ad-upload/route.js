import { runHandler } from '../_lib/route-handler'
import handler from '../_handlers/site-ad-upload'

export async function POST(request) {
  return runHandler(request, handler)
}