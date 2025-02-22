'use server';

import { signIn } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import ratelimit from '../ratelimit';
import { redirect } from 'next/navigation';

export const signInWithCredentials = async (params: Pick<AuthCredentials, 'email' | 'password'>) => {
  const { email, password } = params;

  const ip = (await headers()).get('forwarded-for') || '127.0.0.1';
  const {success} = await ratelimit.limit(ip);

  if (!success) return redirect('/too-fast')

  try {
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, message: result.error };
    }

    return { success: true, message: 'Sign in successful' };
  } catch (error) {
    console.log(error, 'Sign in failed');
    return { success: false, message: 'Sign in failed' };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, universityId, universityCard } = params;
  
  const ip = (await headers()).get('forwarded-for') || '127.0.0.1';
  const {success} = await ratelimit.limit(ip);

  if (!success) return redirect('/too-fast')

  //check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser.length > 0) {
    return { success: false, message: 'User already exists' };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
      universityId,
      universityCard,
    });

    await signInWithCredentials({ email, password });

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.log(error, 'Sign up failed');
    return { success: false, message: 'Sign up failed' };
  }
};
