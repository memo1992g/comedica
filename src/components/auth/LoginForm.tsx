'use client';

import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data);
    } catch {
      // manejado en store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <Input
          label="Usuario"
          {...register('username')}
          error={errors.username?.message}
          placeholder="example@example.com"
          autoComplete="username"
          className={styles.input}
          rightIcon={<User className={styles.icon} />}
        />
      </div>

      <div className={styles.field}>
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
          autoComplete="current-password"
          className={styles.input}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={styles.iconButton}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className={styles.icon} />
              ) : (
                <Eye className={styles.icon} />
              )}
            </button>
          }
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        className={styles.submit}
      >
        Continuar
      </Button>

      <div className={styles.recoverRow}>
        <span>¿Olvidaste tu contraseña?</span>
        <a className={styles.recoverLink} href="/auth/change-password">
          Recuperar
        </a>
      </div>
    </form>
  );
}
