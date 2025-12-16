'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useTranslation } from '@/contexts/TranslationContext';

export default function SignInPage() {
  const router = useRouter();
  const t = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider: 'google' | 'facebook') => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div
      data-component="SignInPage"
      className="container mx-auto px-4 py-12 max-w-md"
    >
      <h1
        data-component="SignInPage.Title"
        className="text-3xl font-bold mb-8 text-center"
      >
        Sign In
      </h1>

      <form
        data-component="SignInPage.Form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p
            data-component="SignInPage.Error"
            className="text-error text-sm"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button
          data-component="SignInPage.Submit"
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div
        data-component="SignInPage.Divider"
        className="my-6 flex items-center"
      >
        <div className="flex-1 border-t border-border"></div>
        <span className="px-4 text-foreground-subtle text-sm">OR</span>
        <div className="flex-1 border-t border-border"></div>
      </div>

      <div
        data-component="SignInPage.Social"
        className="space-y-3"
      >
        <Button
          data-component="SignInPage.Google"
          variant="secondary"
          fullWidth
          onClick={() => handleSocialSignIn('google')}
        >
          Sign in with Google
        </Button>
        <Button
          data-component="SignInPage.Facebook"
          variant="secondary"
          fullWidth
          onClick={() => handleSocialSignIn('facebook')}
        >
          Sign in with Facebook
        </Button>
      </div>

      <p
        data-component="SignInPage.Register"
        className="mt-6 text-center text-foreground-subtle text-sm"
      >
        Don't have an account?{' '}
        <a href="/auth/register" className="text-brand-black underline">
          Register
        </a>
      </p>
    </div>
  );
}

