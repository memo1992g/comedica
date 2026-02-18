import React from 'react';
import { Check, X } from 'lucide-react';
import { validatePassword } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const validation = validatePassword(password);
  
  const requirements = [
    { key: 'minLength', label: 'Mínimo 8 caracteres', met: validation.minLength },
    { key: 'hasUpperCase', label: 'Al menos una mayúscula (A-Z)', met: validation.hasUpperCase },
    { key: 'hasLowerCase', label: 'Al menos una minúscula (a-z)', met: validation.hasLowerCase },
    { key: 'hasNumber', label: 'Al menos un número (0-9)', met: validation.hasNumber },
    { key: 'hasSpecialChar', label: 'Al menos un carácter especial (!@#$...)', met: validation.hasSpecialChar },
  ];

  const metCount = Object.values(validation).filter(Boolean).length;
  const strengthPercentage = (metCount / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage < 40) return 'bg-danger-500';
    if (strengthPercentage < 80) return 'bg-warning-500';
    return 'bg-success-500';
  };

  const getStrengthLabel = () => {
    if (strengthPercentage < 40) return 'Débil';
    if (strengthPercentage < 80) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Barra de progreso */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-secondary-700">
            Fuerza de la contraseña:
          </span>
          <span className={cn(
            'text-sm font-semibold',
            strengthPercentage < 40 && 'text-danger-600',
            strengthPercentage >= 40 && strengthPercentage < 80 && 'text-warning-600',
            strengthPercentage >= 80 && 'text-success-600'
          )}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="w-full h-2 bg-secondary-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', getStrengthColor())}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Requisitos */}
      <div className="p-4 bg-secondary-50 rounded-lg space-y-2">
        <p className="text-sm font-medium text-secondary-700 mb-3">
          Requisitos de contraseña:
        </p>
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-2">
            <div className={cn(
              'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
              req.met ? 'bg-success-100' : 'bg-secondary-200'
            )}>
              {req.met ? (
                <Check className="w-3 h-3 text-success-600" />
              ) : (
                <X className="w-3 h-3 text-secondary-400" />
              )}
            </div>
            <span
              className={cn(
                'text-sm',
                req.met ? 'text-success-700 font-medium' : 'text-secondary-600'
              )}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
