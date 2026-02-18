import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/optimistic-update/about')
}
