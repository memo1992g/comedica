'use client';
import React from 'react';
import { Settings, User, Lock, Bell, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

export default function ConfiguracionPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Configuración</h1>
        <p className="text-secondary-600 mt-1">
          Configuración de usuario y preferencias
        </p>
      </div>

      {/* Información del Usuario */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {user?.fullName || user?.username}
                </h3>
                <p className="text-sm text-secondary-600">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-secondary-200">
              <div>
                <p className="text-sm text-secondary-600">Usuario</p>
                <p className="font-medium text-secondary-900">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600">Rol</p>
                <p className="font-medium text-secondary-900 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              {user?.associateNumber && (
                <div>
                  <p className="text-sm text-secondary-600">N° Asociado</p>
                  <p className="font-medium text-secondary-900">{user.associateNumber}</p>
                </div>
              )}
              {user?.phone && (
                <div>
                  <p className="text-sm text-secondary-600">Teléfono</p>
                  <p className="font-medium text-secondary-900">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-secondary-600" />
                <div>
                  <p className="font-medium text-secondary-900">Contraseña</p>
                  <p className="text-sm text-secondary-600">
                    Última actualización: {new Date(user?.lastPasswordChange || '').toLocaleDateString('es-SV')}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Cambiar
              </Button>
            </div>

            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium text-secondary-900 mb-1">
                    Recordatorio de Seguridad
                  </p>
                  <p className="text-sm text-secondary-700">
                    Tu contraseña expira cada 60 días. Cámbiala regularmente para mantener tu cuenta segura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-600">
            Configuración de preferencias próximamente disponible
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
