import { getIronSession, IronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';

// TODO: Move this to a secure environment variable in a real application
export const IRON_SESSION_PASSWORD = 'complex_password_at_least_32_characters_long_for_security';

export const sessionOptions = {
  password: IRON_SESSION_PASSWORD,
  cookieName: 'corebeauty-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export interface SessionData extends IronSessionData {
  isAuthenticated?: boolean;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
