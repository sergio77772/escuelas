'use client'

import React from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { Building2, User, Shield, Bell, Save } from 'lucide-react'

export default function SettingsPage() {
  const { user, establishment } = useAuthStore()

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">Administra los detalles de tu perfil y la configuración de la institución.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Navigation/Tabs placeholder) */}
        <div className="col-span-1 space-y-2">
          <button className="w-full flex items-center space-x-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors">
            <Building2 size={20} />
            <span>Institución</span>
          </button>
          <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <User size={20} />
            <span>Mi Perfil</span>
          </button>
          <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <Shield size={20} />
            <span>Seguridad</span>
          </button>
          <button className="w-full flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors">
            <Bell size={20} />
            <span>Notificaciones</span>
          </button>
        </div>

        {/* Right Column (Content) */}
        <div className="col-span-2 space-y-6">
          
          {/* Establishment Settings Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Building2 className="mr-2 text-gray-500" size={24} />
              Datos del Establecimiento
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Institución</label>
                <input 
                  type="text" 
                  disabled
                  defaultValue={establishment?.name}
                  className="w-full border-gray-300 bg-gray-50 rounded-lg shadow-sm text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Actual</label>
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                    establishment?.plan === 'modelo_a' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {establishment?.plan === 'modelo_a' ? 'Modelo Completo (Premium)' : 'Modelo Básico'}
                  </span>
                  <button className="text-blue-600 text-sm font-medium hover:underline">Cambiar de plan</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Suscripción</label>
                <span className="text-green-600 font-medium capitalize flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  {establishment?.subscription_status || 'Activa'}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                <Save size={18} />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
