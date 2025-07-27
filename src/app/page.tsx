import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to onboarding for now
  redirect('/onboarding');
}
