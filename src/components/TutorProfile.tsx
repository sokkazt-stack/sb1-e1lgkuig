import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { supabase, TutorData } from '../lib/supabase'
import { 
  Star, 
  Mail, 
  MapPin, 
  Clock, 
  Edit3, 
  Save, 
  X, 
  GraduationCap,
  Award,
  BookOpen,
  User
} from 'lucide-react'

// Mock data for demonstration - in production this would come from Supabase
const mockTutorData = {
  '1': {
    id: '1',
    user_id: 'mock-1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    question_1_answer: 'matematica',
    bio: 'Professora experiente com 8 anos de ensino. Especializada em álgebra, cálculo e estatística. Métodos personalizados para cada aluno, com foco em resultados práticos e duradouros.',
    subjects: ['Matemática', 'Álgebra', 'Cálculo', 'Estatística'],
    rating: 4.9,
    location: 'Lisboa',
    availability: 'Manhãs e tardes',
    experience: '8 anos de experiência',
    education: 'Mestrado em Matemática Aplicada',
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    hourlyRate: '25€/hora',
    totalStudents: 150,
    successRate: '95%'
  },
  '2': {
    id: '2',
    user_id: 'mock-2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    question_1_answer: 'ciencias',
    bio: 'Engenheiro químico com paixão pelo ensino. Experiência em preparação para exames nacionais e universitários. Abordagem prática e científica.',
    subjects: ['Física', 'Química', 'Ciências'],
    rating: 4.8,
    location: 'Porto',
    availability: 'Tardes e noites',
    experience: '6 anos de experiência',
    education: 'Engenharia Química - Universidade do Porto',
    profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    hourlyRate: '30€/hora',
    totalStudents: 89,
    successRate: '92%'
  },
  '3': {
    id: '3',
    user_id: 'mock-3',
    name: 'Maria Costa',
    email: 'maria.costa@email.com',
    question_1_answer: 'ciencias',
    bio: 'Doutora em biologia molecular. Especializada em biologia celular e genética. Abordagem científica e didática personalizada para cada estudante.',
    subjects: ['Biologia', 'Genética', 'Ciências Naturais', 'Biotecnologia'],
    rating: 4.9,
    location: 'Braga',
    availability: 'Flexível',
    experience: '10 anos de experiência',
    education: 'Doutoramento em Biologia Molecular',
    profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    hourlyRate: '35€/hora',
    totalStudents: 76,
    successRate: '98%'
  }
}

type ExtendedTutorData = TutorData & {
  rating: number
  location: string
  availability: string
  experience: string
  education: string
  profilePicture: string
  hourlyRate: string
  totalStudents: number
  successRate: string
}

export const TutorProfile = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tutor, setTutor] = useState<ExtendedTutorData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<ExtendedTutorData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate('/marketplace')
      return
    }

    // For now, use mock data. In production, load from Supabase
    const tutorData = mockTutorData[id as keyof typeof mockTutorData]
    if (tutorData) {
      setTutor(tutorData)
      setEditData(tutorData)
    } else {
      navigate('/marketplace')
    }
    setLoading(false)
  }, [id, navigate])

  const isOwner = user && tutor && user.id === tutor.user_id

  const handleSave = async () => {
    if (!tutor || !isOwner) return

    try {
      // In production, save to Supabase
      // const { error } = await supabase
      //   .from('tutores')
      //   .update(editData)
      //   .eq('id', tutor.id)
      
      // if (error) throw error

      setTutor({ ...tutor, ...editData })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleContactTutor = () => {
    if (!tutor) return
    
    const subject = encodeURIComponent(`Interessado em explicações - Plastudo`)
    const body = encodeURIComponent(`Olá ${tutor.name},\n\nEncontrei o seu perfil na Plastudo e estou interessado(a) nas suas explicações.\n\nPodemos conversar sobre disponibilidade e condições?\n\nObrigado(a)!`)
    window.location.href = `mailto:${tutor.email}?subject=${subject}&body=${body}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explicador não encontrado</h2>
          <Button onClick={() => navigate('/marketplace')}>
            Voltar ao marketplace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Voltar
          </Button>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image and Basic Info */}
              <div className="text-center lg:text-left">
                <img
                  src={tutor.profilePicture}
                  alt={tutor.name}
                  className="w-32 h-32 rounded-2xl mx-auto lg:mx-0 mb-4 object-cover ring-4 ring-yellow-100"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{tutor.rating}</span>
                    <span className="text-gray-600">({tutor.totalStudents} alunos)</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{tutor.availability}</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {isEditing ? (
                      <Input
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="text-3xl font-bold mb-2"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {tutor.name}
                      </h1>
                    )}
                    <p className="text-xl text-green-600 font-semibold mb-2">
                      {tutor.hourlyRate}
                    </p>
                  </div>

                  {isOwner && (
                    <div className="space-x-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSave} size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false)
                              setEditData(tutor)
                            }}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar perfil
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Subjects */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects?.map((subject) => (
                      <Badge key={subject} className="bg-green-100 text-green-700 hover:bg-green-200">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  {isEditing ? (
                    <Textarea
                      value={editData.bio || ''}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      placeholder="Conte sobre a sua experiência e metodologia..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {tutor.bio}
                    </p>
                  )}
                </div>

                {/* Contact Button */}
                {!isOwner && (
                  <Button
                    onClick={handleContactTutor}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Contactar por email
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats and Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 text-center border-0 bg-white/80 backdrop-blur-sm">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Taxa de sucesso</h3>
              <p className="text-2xl font-bold text-green-600">{tutor.successRate}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 text-center border-0 bg-white/80 backdrop-blur-sm">
              <User className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Alunos</h3>
              <p className="text-2xl font-bold text-blue-600">{tutor.totalStudents}+</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center border-0 bg-white/80 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Experiência</h3>
              <p className="text-2xl font-bold text-purple-600">{tutor.experience}</p>
            </Card>
          </motion.div>
        </div>

        {/* Education and Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-green-600" />
              Formação e Experiência
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Formação Académica</h4>
                <p className="text-gray-600">{tutor.education}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Experiência Profissional</h4>
                <p className="text-gray-600">{tutor.experience}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}