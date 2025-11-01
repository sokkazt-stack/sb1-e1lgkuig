import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { supabase, TempTutorData } from '../lib/supabase'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { AuthModal } from './AuthModal'

const questions = [
  {
    id: 1,
    title: "Qual é a sua área principal de expertise?",
    options: [
      { value: "matematica", label: "A) Matemática e Ciências Exatas" },
      { value: "linguas", label: "B) Línguas e Literatura" },
      { value: "ciencias", label: "C) Ciências Naturais e Biologia" },
      { value: "humanas", label: "D) Ciências Humanas e Sociais" }
    ]
  }
]

export const TutorQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [sessionId] = useState(() => crypto.randomUUID())
  const [showAuth, setShowAuth] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const navigate = useNavigate()

  const handleAnswer = async (questionId: number, answer: string) => {
    const newAnswers = { ...answers, [`question_${questionId}_answer`]: answer }
    setAnswers(newAnswers)

    // Save to temp table - skip if using placeholder Supabase
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('xyzcompany')) {
        console.warn('Supabase not configured, skipping temp data save')
      } else {
        const tempData: Omit<TempTutorData, 'id' | 'created_at'> = {
          session_id: sessionId,
          question_1_answer: newAnswers.question_1_answer || ''
        }

        const { error } = await supabase
          .from('temp_tutores')
          .upsert(tempData, { 
            onConflict: 'session_id',
            ignoreDuplicates: false 
          })

        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.warn('Error saving temp data (Supabase not configured properly):', error)
    }

    // Move to next question or show auth
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsCompleted(true)
      setShowAuth(true)
    }
  }

  const handleRegistrationComplete = async (userId: string) => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('xyzcompany')) {
        console.warn('Supabase not configured, redirecting to profile')
        navigate('/profile')
        return
      }

      // Get temp data
      const tempData: Omit<TempTutorData, 'id' | 'created_at'> = {
        session_id: sessionId,
        question_1_answer: newAnswers.question_1_answer || ''
      }

      const { data: tempDataResult, error: fetchError } = await supabase
        .from('temp_tutores')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (fetchError || !tempDataResult) {
        throw new Error('Failed to fetch temporary data')
      }

      // Get user details
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Failed to get user details')
      }

      // Move to permanent table
      const tutorData = {
        user_id: userId,
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        question_1_answer: tempDataResult.question_1_answer,
        bio: '',
        subjects: [],
        profile_picture: ''
      }

      const { error: insertError } = await supabase
        .from('tutores')
        .insert(tutorData)

      if (insertError) {
        throw new Error('Failed to create tutor profile')
      }

      // Clean up temp data
      await supabase
        .from('temp_tutores')
        .delete()
        .eq('session_id', sessionId)

      navigate('/profile')
    } catch (error) {
      console.error('Error completing registration:', error)
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showAuth) {
    return <AuthModal 
      onComplete={handleRegistrationComplete}
      title="Complete o seu registo"
      subtitle="Crie a sua conta para finalizar o seu perfil de explicador"
    />
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-full h-3 overflow-hidden shadow-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Pergunta {currentQuestion + 1} de {questions.length}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {question.title}
              </h2>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-gray-700 group-hover:text-green-700">
                        {option.label}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </Button>

                <div className="text-sm text-gray-500">
                  {answers[`question_${question.id}_answer`] && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Respondido</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}