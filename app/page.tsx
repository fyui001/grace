import { redirect } from 'next/navigation'

export default async function PageHome() {
   return redirect('auth/login')
}
