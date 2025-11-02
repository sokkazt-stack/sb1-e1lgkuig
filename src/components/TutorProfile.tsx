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

import React, { useEffect, useState } from 'react' // Importa React e hooks para gerir estado e efeitos
import { useParams, useNavigate } from 'react-router-dom' // Para pegar id da URL e navegar entre páginas
import { motion } from 'framer-motion' // Para animações suaves
import { Card } from './ui/card' // Componente visual de cartão
import { Button } from './ui/button' // Botão estilizado
import { Input } from './ui/input' // Campo de texto
import { Textarea } from './ui/textarea' // Campo de texto multi-linha
import { Badge } from './ui/badge' // Etiquetas para matérias
import { useAuth } from '../contexts/AuthContext' // Informação do utilizador logado
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
} from 'lucide-react' // Ícones usados na interface

// Dados simulados de tutores
const mockTutorData = { /* ...dados mock dos tutores... */ }

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

// Componente do perfil do tutor
export const TutorProfile = () => {
  const { id } = useParams<{ id: string }>() // Pega o id do tutor da URL
  const { user } = useAuth() // Informação do utilizador logado
  const navigate = useNavigate() // Função para navegar entre páginas
  const [tutor, setTutor] = useState<ExtendedTutorData | null>(null) // Estado do tutor
  const [isEditing, setIsEditing] = useState(false) // Modo edição
  const [editData, setEditData] = useState<Partial<ExtendedTutorData>>({}) // Dados em edição
  const [loading, setLoading] = useState(true) // Estado de carregamento

  // Carrega dados do tutor ou redireciona se não houver id
  useEffect(() => {
    if (!id) { // Se não houver id
      navigate('/marketplace') // Redireciona para marketplace
      return
    }

    // Usa dados simulados (mock). Em produção, buscaria do Supabase
    const tutorData = mockTutorData[id as keyof typeof mockTutorData]
    if (tutorData) { 
      setTutor(tutorData) // Define tutor
      setEditData(tutorData) // Preenche dados para edição
    } else {
      navigate('/marketplace') // Redireciona se tutor não encontrado
    }
    setLoading(false) // Finaliza carregamento
  }, [id, navigate])

  const isOwner = user && tutor && user.id === tutor.user_id // Verifica se o utilizador é dono do perfil

  // Função para salvar alterações do tutor
  const handleSave = async () => {
    if (!tutor || !isOwner) return // Só permite salvar se for dono

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
      console.error('Error updating profile:', error) // Mostra erro no console
    }
  }

  // Função para contactar o tutor por email
  const handleContactTutor = () => {
    if (!tutor) return
    const subject = encodeURIComponent(`Interessado em explicações - Plastudo`)
    const body = encodeURIComponent(`Olá ${tutor.name},\n\nEncontrei o seu perfil na Plastudo e estou interessado(a) nas suas explicações.\n\nPodemos conversar sobre disponibilidade e condições?\n\nObrigado(a)!`)
    window.location.href = `mailto:${tutor.email}?subject=${subject}&body=${body}` // Abre cliente de email
  }

  // Mostra tela de carregamento enquanto busca dados
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

  // Mostra mensagem se tutor não encontrado
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

              {/* Conteúdo principal: nome, taxa horária, botões de edição/contacto */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {isEditing ? (
                      <Input
                        value={editData.name || ''} // Campo de edição de nome
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="text-3xl font-bold mb-2"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {tutor.name} // Nome do tutor
                      </h1>
                    )}
                    <p className="text-xl text-green-600 font-semibold mb-2">
                      {tutor.hourlyRate} // Valor por hora
                    </p>
                  </div>

                  {isOwner && ( // Botões de edição para o dono
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
                      <Badge
