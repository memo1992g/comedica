'use client';
import React from 'react';
import { Settings, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ParametrosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Parámetros</h1>
        <p className="text-secondary-600 mt-1">
          Administración de parámetros del sistema
        </p>
      </div>

      <Card className="border-2 border-dashed border-primary-300 bg-primary-50">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Próximamente - Semana 2
            </h3>
            <p className="text-secondary-600 mb-4">
              Esta sección incluirá la gestión completa de parámetros (HU06-HU13)
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-primary-200">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-secondary-700">
                Implementación: 26-30 Enero 2026
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Administración de Montos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Límites transaccionales por canal y usuario
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU06</div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Parámetros Usuario BEL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Configuración de políticas de contraseñas y sesiones
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU07</div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Soft Token</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Umbrales de seguridad por tipo de operación
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU08</div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Cuentas Origen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Tipos de cuenta permitidos como origen
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU09</div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Cuentas Destino</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Tipos de cuenta permitidos como destino
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU10</div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Transfer365</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Participantes del sistema Transfer365
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU11</div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Motivos de Atención</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Catálogo de razones de soporte
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU12</div>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="text-lg">Cuestionarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-600">
              Preguntas de seguridad
            </p>
            <div className="mt-4 text-xs text-secondary-500">HU13</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
