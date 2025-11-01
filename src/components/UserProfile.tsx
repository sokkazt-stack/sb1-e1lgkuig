import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { useAuth } from '../contexts/AuthContext'
import { supabase, TutorData } from '../lib/supabase'
import { User, Edit, BookOpen, Mail } from 'lucide-react'

export const UserProfile = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [tutorProfile, setTutorProfile] = useState<TutorData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
      return
    }

    if (user) {
      loadTutorProfile()
    }
  }, [user, authLoading, navigate])

  const loadTutorProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tutores')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      setTutorProfile(data || null)
    } catch (error) {
      console.error('Error loading tutor profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            O meu perfil
          </h1>
          <p className="text-gray-600">
            Gerir a sua conta e informações
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'Utilizador'}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tutor Profile Status */}
        {tutorProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Perfil de Explicador
                </h3>
                <Button
                  onClick={() => navigate(`/profile/${tutorProfile.id}`)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Área de expertise</p>
                  <p className="font-medium text-gray-900">
                    {tutorProfile.question_1_answer === 'matematica' && 'Matemática e Ciências Exatas'}
                    {tutorProfile.question_1_answer === 'linguas' && 'Línguas e Literatura'}
                    {tutorProfile.question_1_answer === 'ciencias' && 'Ciências Naturais e Biologia'}
                    {tutorProfile.question_1_answer === 'humanas' && 'Ciências Humanas e Sociais'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disciplinas</p>
                  <p className="font-medium text-gray-900">
                    {tutorProfile.subjects?.length ? tutorProfile.subjects.join(', ') : 'A definir'}
                  </p>
                </div>
              </div>
              
              {tutorProfile.bio && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Biografia</p>
                  <p className="text-gray-900">{tutorProfile.bio}</p>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Perfil de explicador não encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Quer começar a dar explicações? Complete o questionário para criar o seu perfil.
              </p>
              <Button
                onClick={() => navigate('/tutor-questionnaire')}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Criar perfil de explicador
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acções rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/marketplace')}
                variant="outline"
                className="justify-start"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar explicadores
              </Button>
              <Button
                onClick={() => navigate('/student-questionnaire')}
                variant="outline"
                className="justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Encontrar explicador
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}