'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordStrength from '@/components/auth/PasswordStrength';
import { isPasswordValid } from '@/lib/utils';

const firstPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).refine((data) => isPasswordValid(data.newPassword), {
  message: 'La contraseña no cumple con los requisitos',
  path: ['newPassword'],
});

type FirstPasswordFormData = z.infer<typeof firstPasswordSchema>;

export default function FirstPasswordChangePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { firstPasswordChange, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FirstPasswordFormData>({
    resolver: zodResolver(firstPasswordSchema),
  });

  const newPassword = watch('newPassword') || '';

  const onSubmit = async (data: FirstPasswordFormData) => {
    try {
      await firstPasswordChange(data);
    } catch (error) {
      // Error manejado por el store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-warning-500 rounded-2xl mb-4 shadow-lg"
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Cambio de Contraseña Requerido
          </h1>
          <p className="text-secondary-600">
            Por seguridad, debes cambiar tu contraseña temporal
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nueva Contraseña */}
            <Input
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              {...register('newPassword')}
              error={errors.newPassword?.message}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-secondary-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              placeholder="Ingrese su nueva contraseña"
            />

            {/* Indicador de fuerza */}
            {newPassword && <PasswordStrength password={newPassword} />}

            {/* Confirmar Contraseña */}
            <Input
              label="Confirmar Nueva Contraseña"
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="hover:text-secondary-600 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              placeholder="Confirme su nueva contraseña"
            />

            {error && (
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Cambiar Contraseña y Continuar
            </Button>
          </form>
        </motion.div>

        {/* Nota de seguridad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg"
        >
          <p className="text-sm text-primary-800">
            <strong>Nota:</strong> Tu contraseña deberá ser cambiada cada 60 días por seguridad.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
