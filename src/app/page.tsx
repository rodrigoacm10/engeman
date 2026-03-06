import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('engeman_auth_token')?.value

  if (token) {
    redirect('/list')
  }

  redirect('/login')
}
