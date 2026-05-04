import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, isLoading: firebaseLoading } = useFirebase();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        setLocation('/admin/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (firebaseLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-foreground/70">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-foreground mb-2">Braniela</h1>
          <p className="text-foreground/60">Panel Administrativo</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-lg border border-border p-8 space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Correo Electrónico
            </label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <LogIn size={20} />
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6">
          <button
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="w-full text-center text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            {showDemoCredentials ? 'Ocultar' : 'Ver'} credenciales
          </button>

          {showDemoCredentials && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
            >
              <div className="flex gap-2 mb-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 font-medium">Credenciales de Acceso</p>
              </div>
              <div className="space-y-2 text-sm text-blue-600">
                <p>
                  <strong>Email:</strong> bradymoncada17@gmail.com
                </p>
                <p>
                  <strong>Contraseña:</strong> Bamj.0817
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            ← Volver a la tienda
          </a>
        </div>
      </motion.div>
    </div>
  );
}
