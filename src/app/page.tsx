import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to default locale (en)
  redirect('/en');
}

