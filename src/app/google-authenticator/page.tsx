import { cookies } from 'next/headers';
import VerificacionAuthenticatorPage from './VerificacionAuthenticatorPage';

export default async function AuthUserPage() {
  const cookieStore = await cookies();
  const email = cookieStore.get('mfaEmail')?.value || '';

  if (!email) {
    // Si no hay email en cookie, redirigir al login
    return <p>No se encontró el correo. Por favor, inicia sesión nuevamente.</p>;
  }

  return <VerificacionAuthenticatorPage email={email} />;
}