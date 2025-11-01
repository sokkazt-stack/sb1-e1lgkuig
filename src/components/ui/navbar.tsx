import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './button'
import { useAuth } from '../../contexts/AuthContext'
import { User, LogOut, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 backdrop-blur-sm border-b border-yellow-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
              Plastudo
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/marketplace">
              <Button variant="ghost" className="text-gray-600 hover:text-green-600">
                Explorar
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}