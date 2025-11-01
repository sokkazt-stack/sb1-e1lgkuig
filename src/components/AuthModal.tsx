import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'

interface AuthModalProps {
  onComplete: (userId: string) => void
  title?: string
  subtitle?: string
}

export const AuthModal = ({ onComplete, title, subtitle }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('xyzcompany')) {
        throw new Error('Supabase não está configurado. Por favor, configure as suas credenciais Supabase.')
      }

      let result
      if (isSignUp) {
        result = await signUp(email, password)
        if (result.data?.user) {
          // Update user metadata with name
          // await supabase.auth.updateUser({
          //   data: { name }
          // })
          onComplete(result.data.user.id)
        }
      } else {
        result = await signIn(email, password)
        if (result.data?.user) {
          onComplete(result.data.user.id)
        }
      }

      if (result.error) {
        throw result.error
      }
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md px-4"
      >
        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title || (isSignUp ? 'Criar conta' : 'Iniciar sessão')}
            </h2>
            <p className="text-gray-600">
              {subtitle || (isSignUp ? 'Complete o seu registo para continuar' : 'Entre na sua conta')}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="O seu nome"
                    className="pl-10"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Palavra-passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isSignUp ? 'A criar conta...' : 'A iniciar sessão...'}
                </>
              ) : (
                isSignUp ? 'Criar conta' : 'Iniciar sessão'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-green-600 hover:text-green-700"
            >
              {isSignUp ? 'Iniciar sessão' : 'Criar conta'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}