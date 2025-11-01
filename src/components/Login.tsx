import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthModal } from './AuthModal'

export const Login = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/profile')
    }
  }, [user, navigate])

  const handleComplete = (userId: string) => {
    navigate('/profile')
  }

  return (
    <AuthModal 
      onComplete={handleComplete}
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar"
    />
  )
}