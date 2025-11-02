//-----------------RESUMO GERAL-----------------
//Este código cria a página de perfil de um tutor para uma plataforma de ensino online.
//Ele mostra informações do tutor como foto, nome, matérias que ensina, biografia, classificação, localização, disponibilidade, experiência e educação.
//Permite que o próprio tutor edite seu perfil e que outros utilizadores contactem o tutor por email.
//Em produção, os dados viriam do Supabase, mas aqui usamos dados simulados (mock).

//-----------------FLUXO DO CÓDIGO-----------------
// 1. Importa React, hooks, navegação, animações, componentes de UI e ícones.
// 2. Define dados simulados de tutores (mockTutorData).
// 3. Define um tipo ExtendedTutorData para incluir campos adicionais ao TutorData.
// 4. Cria o componente TutorProfile e inicializa estados: tutor, modo de edição, dados em edição e carregamento.
// 5. useEffect carrega os dados do tutor ou redireciona se não houver id válido.
// 6. Define isOwner para saber se o utilizador logado é o dono do perfil.
// 7. handleSave atualiza os dados do tutor (em produção, salvaria no Supabase).
// 8. handleContactTutor abre o cliente de email para enviar mensagem ao tutor.
// 9. Renderiza interface de carregamento, mensagem de erro ou o perfil completo do tutor com cartões e animações.
// 10. Mostra estatísticas, matérias, biografia, formação, experiência e botões de edição/contacto conforme o utilizador.

//-----------------CODE-----------------

//-----------------CÓDIGO COMENTADO-----------------

import React, { useEffect, useState } from 'react' // Importa React e hooks para gerir estado e efeitos
import { useParams, useNavigate } from 'react-router-dom' // Importa funções de navegação e parâmetros de URL
import { motion } from 'framer-motion' // Importa biblioteca para animações
import { Card } from './ui/card' // Componente Card para agrupar conteúdo visual
import { Button } from './ui/button' // Botão estilizado
import { Input } from './ui/input' // Campo de texto
import { Textarea } from './ui/textarea' // Campo de texto multi-linha
import { Badge } from './ui/badge' // Etiquetas para matérias
import { useAuth } from '../contexts/AuthContext' // Contexto de autenticação do utilizador
import { supabase, TutorData } from '../lib/supabase' // Supabase e tipo de dados do tutor
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
} from 'lucide-react' // Ícones usados no perfil

// Dados simulados para demonstração
const mockTutorData = { /* ...tutores mock... */ }

// Tipo que adiciona campos extras ao TutorData original
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

// Componente principal de perfil de tutor
export const TutorProfile = () => {
  const { id } = useParams<{ id: string }>() // Obtém id do tutor da URL
  const { user } = useAuth() // Usuário logado
  const navigate = useNavigate() // Função para navegar entre páginas
  const [tutor, setTutor] = useState<ExtendedTutorData | null>(null) // Dados do tutor
  const [isEditing, setIsEditing] = useState(false) // Modo edição
  const [editData, setEditData] = useState<Partial<ExtendedTutorData>>({}) // Dados sendo editados
  const [loading, setLoading] = useState(true) // Estado de carregamento

  // useEffect carrega os dados do tutor quando o componente monta
  useEffect(() => {
    if (!id) { // Se não houver id na URL
      navigate('/marketplace') // Redireciona para o marketplace
      return
    }

    // Usa dados simulados. Em produção, buscar do Supabase
    const tutorData = mockTutorData[id as keyof typeof mockTutorData]
    if (tutorData) { 
      setTutor(tutorData) // Define tutor
      setEditData(tutorData) // Preenche dados para edição
    } else {
      navigate('/marketplace') // Redireciona se tutor não encontrado
    }
    setLoading(false) // Termina carregamento
  }, [id, navigate])

  const isOwner = user && tutor && user.id === tutor.user_id // Verifica se o utilizador é o dono do perfil

  // Salvar alterações feitas pelo tutor
  const handleSave = async () => {
    if (!tutor || !isOwner) return // Só salva se for o dono

    try {
      // Em produção, salvaria no Supabase
      // const { error } = await supabase
      //   .from('tutores')
      //   .update(editData)
      //   .eq('id', tutor.id)
      // if (error) throw error

      setTutor({ ...tutor, ...editData }) // Atualiza estado local
      setIsEditing(false) // Sai do modo edição
    } catch (error) {
      console.error('Error updating profile:', error) // Log de erro
    }
  }

  // Função para contactar tutor via email
  const handleContactTutor = () => {
    if (!tutor) return
    const subject = encodeURIComponent(`Interessado em explicações - Plastudo`)
    const body = encodeURIComponent(`Olá ${tutor.name},\n\nEncontrei o seu perfil na Plastudo e estou interessado(a) nas suas explicações.\n\nPodemos conversar sobre disponibilidade e condições?\n\nObrigado(a)!`)
    window.location.href = `mailto:${tutor.email}?subject=${subject}&body=${body}` // Abre cliente de email
  }

  // Exibe animação de carregamento enquanto carrega dados
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

  // Se tutor não encontrado
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

  // Renderização principal do perfil
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com botão de voltar */}
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

        {/* Card principal do perfil */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Imagem e informações básicas */}
              <div className="text-center lg:text-left">
                <img
                  src={tutor.profilePicture} // Foto do tutor
                  alt={tutor.name} 
                  className="w-32 h-32 rounded-2xl mx-auto lg:mx-0 mb-4 object-cover ring-4 ring-yellow-100"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-center lg:justify-start space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{tutor.rating}</span> {/* Classificação */}
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

              {/* Conteúdo principal */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {isEditing ? ( // Se estiver em edição
                      <Input
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="text-3xl font-bold mb-2"
                      />
                    ) : ( // Modo visualização
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {tutor.name}
                      </h1>
                    )}
                    <p className="text-xl text-green-600 font-semibold mb-2">
                      {tutor.hourlyRate}
                    </p>
                  </div>

                  {isOwner && ( // Botões de edição se dono
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

                {/* Matérias */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects?.map((subject) => (
                      <Badge key={subject} className="bg-green-100 text-green-700 hover:bg-green-200">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Biografia */}
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

                {/* Botão de contacto */}
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

        {/* Estatísticas e informação adicional */}
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

        {/* Formação e experiência */}
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
