'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextField, Input, Label, FieldError } from '@heroui/react';
import { Lock, LogIn, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

type FormData = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    if (result.error) {
      setSubmitError(
        result.error.message ?? 'Email ou mot de passe incorrect.'
      );
      return;
    }
    router.push('/admin');
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <TextField isRequired isInvalid={!!errors.email}>
        <Label>Email</Label>
        <Input
          {...register('email')}
          type="email"
          placeholder="vous@exemple.fr"
          autoComplete="email"
        />
        {errors.email?.message && <FieldError>{errors.email.message}</FieldError>}
      </TextField>

      <TextField isRequired isInvalid={!!errors.password}>
        <Label>Mot de passe</Label>
        <Input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password?.message && (
          <FieldError>{errors.password.message}</FieldError>
        )}
      </TextField>

      {submitError && (
        <p className="text-areka-coral bg-areka-coral/10 rounded-lg p-3 text-sm">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isDisabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            <LogIn size={16} />
            Se connecter
          </>
        )}
      </Button>

      <p className="text-foreground/50 flex items-center justify-center gap-1.5 text-xs">
        <Lock size={12} />
        Connexion sécurisée — accès réservé Areka Services
      </p>
    </form>
  );
}
