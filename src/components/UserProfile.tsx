//-----------------RESUMO GERAL-----------------
//Este código cria a página de perfil do utilizador numa plataforma de ensino online.
//Ele mostra informações básicas do utilizador, como nome e email, e, se o utilizador também for tutor, mostra o seu perfil de explicador com área de expertise, disciplinas e biografia.
//Permite ao tutor navegar para a edição do seu perfil e oferece ações rápidas como explorar outros explicadores ou encontrar um explicador.
//Em produção, os dados do tutor são buscados a partir do Supabase, mas a interface já lida com estados de carregamento e casos em que o perfil não existe.

//-----------------FLUXO DO CÓDIGO-----------------
// 1. Importa React, hooks, navegação, animações, componentes de UI e ícones.
// 2. Cria o componente UserProfile e define estados: tutorProfile (perfil de tutor) e loading (carregamento da página).
// 3. useEffect verifica se o utilizador está logado e, se não estiver, redireciona para login. Se estiver, carrega o perfil do tutor.
// 4. loadTutorProfile busca os dados do tutor no Supabase filtrando pelo id do utilizador logado.
// 5. Trata erros caso não haja perfil de tutor ou ocorra outro problema na requisição.
// 6. Enquanto carrega os dados, exibe uma tela de carregamento com animação (skeleton screen).
// 7. Se não houver utilizador logado, retorna null (não mostra nada).
// 8. Renderiza o cartão de informações do utilizador (nome e email).
// 9. Se houver perfil de tutor, mostra detalhes do perfil: área de expertise, disciplinas e biografia, com botão para editar.
// 10. Caso não haja perfil de tutor, oferece botão para criar o perfil através de questionário. Inclui também um cartão de ações rápidas.

//-----------------CODE-----------------

import React, { useEffect, useState } from 'react' // Importa React e hooks de estado e efeito
import { useNavigate } from 'react-router-dom' // Hook para navegar entre páginas
import { motion } from 'framer-motion' // Para animações suaves
import { Card } from './ui/card' // Componente visual de cartão
import { Button } from './ui/button' // Botão estilizado
import { useAuth } from '../contexts/AuthContext' // Informação do utilizador logado
import { supabase, TutorData } from '../lib/supabase' // Supabase e tipo de dados do tutor
import { User, Edit, BookOpen, Mail } from 'lucide-react' // Ícones usados na interface

export const UserProfile = () => {
  const { user, loading: authLoading } = useAuth() // Pega informações do utilizador e se está carregando autenticação
  const navigate = useNavigate() // Função para navegar para outra página
  const [tutorProfile, setTutorProfile] = useState<TutorData | null>(null) // Estado para armazenar perfil de tutor
  const [loading, setLoading] = useState(true) // Estado para controlar carregamento do perfil

  // useEffect executa ao carregar o componente ou quando user/authLoading muda
  useEffect(() => {
    if (!authLoading && !user) { // Se autenticação terminou e não há utilizador logado
      navigate('/login') // Redireciona para login
      return
    }

    if (user) { // Se houver utilizador logado
      loadTutorProfile() // Carrega perfil de tutor
    }
  }, [user, authLoading, navigate])

  // Função para carregar perfil de tutor do Supabase
  const loadTutorProfile = async () => {
    if (!user) return // Se não houver utilizador, não faz nada

    try {
      const { data, error } = await supabase
        .from('tutores') // Tabela 'tutores'
        .select('*') // Seleciona todos os campos
        .eq('user_id', user.id) // Filtra pelo id do utilizador logado
        .single() // Espera retornar apenas um resultado

      if (error && error.code !== 'PGRST116') { // PGRST116 significa "sem linhas retornadas"
        throw error // Se houver outro erro, lança exceção
      }

      setTutorProfile(data || null) // Define perfil do tutor ou null
    } catch (error) {
      console.error('Error loading tutor profile:', error) // Mostra erro no console
    } finally {
      setLoading(false) // Finaliza estado de carregamento
    }
  }

  // Mostra tela de carregamento enquanto autenticação ou perfil estão carregando
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse"> {/* Animação de carregamento */}
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) { // Se não houver utilizador logado
    return null // Não mostra nada
  }

  // Renderização principal do perfil do utilizador
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Cabeçalho da página */}
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

        {/* Cartão com informações do utilizador */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" /> {/* Ícone de utilizador */}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'Utilizador'} {/* Nome ou email do utilizador */}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" /> {/* Ícone de email */}
                  <span>{user.email}</span> {/* Mostra email */}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Perfil do tutor, se existir */}
        {tutorProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" /> {/* Ícone de livro */}
                  Perfil de Explicador
                </h3>
                <Button
                  onClick={() => navigate(`/profile/${tutorProfile.id}`)} // Navega para edição do perfil
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" /> {/* Ícone de editar */}
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
                    {tutorProfile.subjects?.length ? tutorProfile.subjects.join(', ') : 'A definir'} {/* Lista de disciplinas */}
                  </p>
                </div>
              </div>
              
              {tutorProfile.bio && ( // Mostra biografia se existir
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Biografia</p>
                  <p className="text-gray-900">{tutorProfile.bio}</p>
                </div>
              )}
            </Card>
          </motion.div>
        ) : ( // Se não houver perfil de tutor
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" /> {/* Ícone grande */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Perfil de explicador não encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Quer começar a dar explicações? Complete o questionário para criar o seu perfil.
              </p>
              <Button
                onClick={() => navigate('/tutor-questionnaire')} // Botão para criar perfil
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Criar perfil de explicador
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Acções rápidas do utilizador */}
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
                onClick={() => navigate('/marketplace')} // Explorar outros explicadores
                variant="outline"
                className="justify-start"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar explicadores
              </Button>
              <Button
                onClick={() => navigate('/student-questionnaire')} // Encontrar um explicador
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
