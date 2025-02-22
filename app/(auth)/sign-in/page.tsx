'use client';

import AuthForm from '@/components/AuthForm';
import { signInWithCredentials } from '@/lib/action.ts/auth';
import { signInSchema } from '@/lib/validation';
import React from 'react';

const Page = () => {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default Page;
