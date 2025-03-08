'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, Field, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { FIELD_NAMES, FIELD_TYPES } from '@/app/constants';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';

interface Props<T> extends FieldValues {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: 'SIGN_IN' | 'SIGN_UP';
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const router = useRouter();
  const isSignIn = type === 'SIGN_IN';

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result.success) {
      toast({
        title: 'Success',
        description: isSignIn ? 'Sign in successful' : 'Sign up successful',
      });

      router.push('/');
    } else {
      toast({
        title: isSignIn ? 'Sign in failed' : 'Sign up failed',
        description: result.error || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">{isSignIn ? 'Welcome Back!' : 'Create an Account'}</h1>
      <p className="text-light-100">{isSignIn ? 'Access a world of knowledge' : 'Complete the form below to get started'}</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              control={form.control}
              key={field}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                  <FormControl>
                    {field.name === 'universityCard' ? (
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload Your ID Card"
                        variant="dark"
                        folder="ids"
                        onFileChange={field.onChange}
                      />
                    ) : (
                      <Input
                        required
                        type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="form-btn"
          >
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "Don't have an account?" : 'Already have an account?'}
        <Link
          href={isSignIn ? '/sign-up' : '/sign-in'}
          className="font-bold text-primary "
        >
          {' '}
          {isSignIn ? 'Sign Up' : 'Sign In'}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
