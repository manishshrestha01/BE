import { redirect } from 'next/navigation'

export default function LegacyOldQuestionRedirect() {
  redirect('/question-paper')
}