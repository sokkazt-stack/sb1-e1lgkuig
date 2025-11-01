import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { supabase, TutorData } from '../lib/supabase'
import { Search, Star, Mail, MapPin, Clock } from 'lucide-react'

// Mock data for demonstration
const mockTutors: (TutorData & { rating: number; location: string; availability: string; profilePicture: string })[] = [
  {
    id: '1',
    user_id: 'mock-1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    question_1_answer: 'matematica',
    bio: 'Professora experiente com 8 anos de ensino. Especializada em álgebra, cálculo e estatística. Métodos personalizados para cada aluno.',
    subjects: ['Matemática', 'Álgebra', 'Cálculo'],
    rating: 4.9,
    location: 'Lisboa',
    availability: 'Manhãs e tardes',
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: '2',
    user_id: 'mock-2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    question_1_answer: 'ciencias',
    bio: 'Engenheiro químico com paixão pelo ensino. Experiência em preparação para exames nacionais e universitários.',
    subjects: ['Física', 'Química', 'Ciências'],
    rating: 4.8,
    location: 'Porto',
    availability: 'Tardes e noites',
    profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: '3',
    user_id: 'mock-3',
    name: 'Maria Costa',
    email: 'maria.costa@email.com',
    question_1_answer: 'ciencias',
    bio: 'Doutora em biologia molecular. Especializada em biologia celular e genética. Abordagem científica e didática.',
    subjects: ['Biologia', 'Genética', 'Ciências Naturais'],
    rating: 4.9,
    location: 'Braga',
    availability: 'Flexível',
    profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: '4',
    user_id: 'mock-4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    question_1_answer: 'linguas',
    bio: 'Professor de português e literatura. Mestre em linguística aplicada. Preparação para exames e apoio escolar.',
    subjects: ['Português', 'Literatura', 'Redação'],
    rating: 4.7,
    location: 'Coimbra',
    availability: 'Manhãs',
    profilePicture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: '5',
    user_id: 'mock-5',
    name: 'Sofia Mendes',
    email: 'sofia.mendes@email.com',
    question_1_answer: 'humanas',
    bio: 'Historiadora e professora. Especialista em história contemporânea e metodologia de estudo. Aulas dinâmicas e interativas.',
    subjects: ['História', 'Geografia', 'Filosofia'],
    rating: 4.8,
    location: 'Aveiro',
    availability: 'Tardes',
    profilePicture: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: '6',
    user_id: 'mock-6',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    question_1_answer: 'linguas',
    bio: 'Professor nativo de inglês e francês. Certificações internacionais. Foco em conversação e preparação para certificados.',
    subjects: ['Inglês', 'Francês', 'Conversação'],
    rating: 4.9,
    location: 'Faro',
    availability: 'Noites e fins de semana',
    profilePicture: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  }
]

export const Marketplace = () => {
  const [tutors, setTutors] = useState(mockTutors)
  const [filteredTutors, setFilteredTutors] = useState(mockTutors)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')

  useEffect(() => {
    // In the future, load real tutors from Supabase
    // loadTutors()
  }, [])

  useEffect(() => {
    let filtered = tutors

    if (searchTerm) {
      filtered = filtered.filter(tutor =>
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.subjects?.some(subject => 
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        tutor.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(tutor =>
        tutor.subjects?.some(subject =>
          subject.toLowerCase().includes(selectedSubject.toLowerCase())
        )
      )
    }

    setFilteredTutors(filtered)
  }, [searchTerm, selectedSubject, tutors])

  const handleContactTutor = (email: string, tutorName: string) => {
    const subject = encodeURIComponent(`Interessado em explicações - Plastudo`)
    const body = encodeURIComponent(`Olá ${tutorName},\n\nEncontrei o seu perfil na Plastudo e estou interessado(a) nas suas explicações.\n\nPodemos conversar sobre disponibilidade e condições?\n\nObrigado(a)!`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  const subjects = ['all', 'Matemática', 'Física', 'Química', 'Biologia', 'Português', 'Inglês', 'História']

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre o seu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-green-600">
              explicador ideal
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore os nossos explicadores qualificados e encontre quem melhor se adequa às suas necessidades
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Pesquisar por nome, disciplina ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg border-2 border-gray-200 rounded-2xl focus:border-green-400"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                  className={
                    selectedSubject === subject
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                      : "border-gray-300 hover:border-green-400"
                  }
                >
                  {subject === 'all' ? 'Todas as disciplinas' : subject}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600 text-center">
            {filteredTutors.length} explicador{filteredTutors.length !== 1 ? 'es' : ''} encontrado{filteredTutors.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor, index) => (
            <motion.div
              key={tutor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm group">
                <div className="text-center mb-4">
                  <img
                    src={tutor.profilePicture}
                    alt={tutor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-4 ring-yellow-100 group-hover:ring-green-200 transition-all"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {tutor.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{tutor.rating}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{tutor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{tutor.availability}</span>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {tutor.subjects?.slice(0, 3).map((subject) => (
                      <span
                        key={subject}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                    {tutor.subjects && tutor.subjects.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{tutor.subjects.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {tutor.bio}
                </p>

                <div className="space-y-2 mt-auto">
                  <Link to={`/profile/${tutor.id}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:border-green-400 transition-colors"
                    >
                      Ver perfil completo
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleContactTutor(tutor.email, tutor.name)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTutors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum explicador encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os seus critérios de pesquisa ou explore todas as disciplinas
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedSubject('all')
              }}
              variant="outline"
            >
              Limpar filtros
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}