//-----------------RESUMO GERAL-----------------
//Este código implementa um questionário interativo para tutores, usando React e Supabase.
//O utilizador responde a perguntas sobre a sua área de expertise, com os dados temporariamente guardados
//em Supabase. Após completar o questionário, é apresentado um modal de registo para finalizar o perfil.
//O código inclui animações, navegação entre perguntas, barra de progresso e feedback visual de respostas.

//-----------------FLUXO DO CÓDIGO-----------------
// 1. Define um array de perguntas (questions) com opções para o utilizador selecionar.
// 2. Cria o componente TutorQuestionnaire.
// 3. Inicializa estados: pergunta atual, respostas, ID de sessão único, controle do modal de autenticação e estado de conclusão.
// 4. Função handleAnswer:
//    - Atualiza respostas locais
//    - Salva dados temporários no Supabase (se configurado)
//    - Passa para a próxima pergunta ou exibe modal de autenticação quando terminar
// 5. Função handleRegistrationComplete:
//    - Ao finalizar registo, transfere dados temporários para tabela permanente
//    - Recupera dados do utilizador do Supabase
//    - Insere dados finais do tutor na tabela 'tutores'
//    - Limpa dados temporários
//    - Redireciona para perfil
// 6. Função goBack para voltar à pergunta anterior.
// 7. Se showAuth for true, mostra o modal de registo AuthModal.
// 8. Renderiza a pergunta atual, opções, barra de progresso e botões de navegação com animações.
// 9. Cada botão de opção chama handleAnswer com o valor selecionado.

//-----------------CODE-----------------

import React, { useState, useEffect } from 'react' // Importa React e hooks para gerir estado e efeitos
import { useNavigate } from 'react-router-dom' // Importa função para navegar entre páginas
import { motion, AnimatePresence } from 'framer-motion' // Importa biblioteca para animações
import { Button } from './ui/button' // Importa componente Button personalizado
import { Card } from './ui/card' // Importa componente Card personalizado
import { supabase, TempTutorData } from '../lib/supabase' // Importa Supabase e tipo de dados temporários
import { ChevronRight, ChevronLeft, Check } from 'lucide-react' // Importa ícones
import { AuthModal } from './AuthModal' // Importa componente de modal de autenticação

// Define array de perguntas do questionário
const questions = [
  {
    id: 1, // Identificador da pergunta
    title: "Qual é a sua área principal de expertise?", // Texto da pergunta
    options: [ // Opções de resposta
      { value: "matematica", label: "A) Matemática e Ciências Exatas" },
      { value: "linguas", label: "B) Línguas e Literatura" },
      { value: "ciencias", label: "C) Ciências Naturais e Biologia" },
      { value: "humanas", label: "D) Ciências Humanas e Sociais" }
    ]
  }
]

// Componente principal do questionário
export const TutorQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0) // Guarda índice da pergunta atual
  const [answers, setAnswers] = useState<Record<string, string>>({}) // Guarda respostas do utilizador
  const [sessionId] = useState(() => crypto.randomUUID()) // Cria ID único para esta sessão
  const [showAuth, setShowAuth] = useState(false) // Controla exibição do modal de registo
  const [isCompleted, setIsCompleted] = useState(false) // Indica se o questionário foi completado
  const navigate = useNavigate() // Função para navegar entre páginas

  // Função chamada quando o utilizador responde a uma pergunta
  const handleAnswer = async (questionId: number, answer: string) => {
    const newAnswers = { ...answers, [`question_${questionId}_answer`]: answer } // Atualiza objeto de respostas
    setAnswers(newAnswers) // Salva novo estado de respostas

    // Salvar dados temporários no Supabase (se estiver configurado)
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('xyzcompany')) {
        console.warn('Supabase not configured, skipping temp data save') // Log se Supabase não estiver configurado
      } else {
        const tempData: Omit<TempTutorData, 'id' | 'created_at'> = {
          session_id: sessionId, // Associa respostas à sessão
          question_1_answer: newAnswers.question_1_answer || '' // Guarda resposta da primeira pergunta
        }

        const { error } = await supabase
          .from('temp_tutores') // Seleciona tabela temporária
          .upsert(tempData, { 
            onConflict: 'session_id', // Atualiza se sessão já existir
            ignoreDuplicates: false 
          })

        if (error) {
          throw error // Lança erro se falhar
        }
      }
    } catch (error) {
      console.warn('Error saving temp data (Supabase not configured properly):', error) // Log de falha
    }

    // Passa para a próxima pergunta ou mostra modal de autenticação
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1) // Próxima pergunta
    } else {
      setIsCompleted(true) // Questionário completo
      setShowAuth(true) // Mostra modal de registo
    }
  }

  // Função chamada após registo completo do utilizador
  const handleRegistrationComplete = async (userId: string) => {
    try {
      // Verifica se Supabase está configurado
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('xyzcompany')) {
        console.warn('Supabase not configured, redirecting to profile') 
        navigate('/profile') // Redireciona para perfil se não configurado
        return
      }

      // Recupera dados temporários
      const tempData: Omit<TempTutorData, 'id' | 'created_at'> = {
        session_id: sessionId,
        question_1_answer: newAnswers.question_1_answer || ''
      }

      const { data: tempDataResult, error: fetchError } = await supabase
        .from('temp_tutores')
        .select('*')
        .eq('session_id', sessionId)
        .single() // Busca dados de sessão específica

      if (fetchError || !tempDataResult) {
        throw new Error('Failed to fetch temporary data') // Erro se falhar
      }

      // Recupera dados do utilizador autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Failed to get user details') // Erro se não encontrar
      }

      // Prepara dados finais do tutor
      const tutorData = {
        user_id: userId,
        name: user.user_metadata?.name || user.email?.split('@')[0] || '', // Nome do utilizador ou email
        email: user.email || '',
        question_1_answer: tempDataResult.question_1_answer,
        bio: '',
        subjects: [],
        profile_picture: ''
      }

      // Insere dados do tutor na tabela permanente
      const { error: insertError } = await supabase
        .from('tutores')
        .insert(tutorData)

      if (insertError) {
        throw new Error('Failed to create tutor profile') // Erro se falhar
      }

      // Remove dados temporários
      await supabase
        .from('temp_tutores')
        .delete()
        .eq('session_id', sessionId)

      navigate('/profile') // Redireciona para página de perfil
    } catch (error) {
      console.error('Error completing registration:', error) // Log de erro
    }
  }

  // Função para voltar à pergunta anterior
  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1) // Decrementa índice da pergunta
    }
  }

  // Se showAuth for verdadeiro, mostra modal de autenticação
  if (showAuth) {
    return <AuthModal 
      onComplete={handleRegistrationComplete} // Passa função de callback
      title="Complete o seu registo"
      subtitle="Crie a sua conta para finalizar o seu perfil de explicador"
    />
  }

  const question = questions[currentQuestion] // Pergunta atual
  const progress = ((currentQuestion + 1) / questions.length) * 100 // Calcula progresso percentual

  // Renderização do questionário
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Barra de progresso */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Estado inicial da animação
          animate={{ opacity: 1, y: 0 }} // Estado final
          className="mb-8"
        >
          <div className="bg-white rounded-full h-3 overflow-hidden shadow-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-green-400"
              initial={{ width: 0 }} // Largura inicial
              animate={{ width: `${progress}%` }} // Largura animada
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Pergunta {currentQuestion + 1} de {questions.length} {/* Texto de progresso */}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion} // Chave única para animação ao trocar de pergunta
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {question.title} {/* Mostra título da pergunta */}
              </h2>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={option.value} // Chave única
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(question.id, option.value)} // Chama função ao clicar
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-gray-700 group-hover:text-green-700">
                        {option.label} {/* Mostra texto da opção */}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transform group-hover:translate-x-1 transition-all" /> {/* Ícone de seta */}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={goBack} // Botão de voltar
                  disabled={currentQuestion === 0} // Desativa se estiver na primeira pergunta
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" /> {/* Ícone de seta para trás */}
                  <span>Anterior</span>
                </Button>

                <div className="text-sm text-gray-500">
                  {answers[`question_${question.id}_answer`] && ( // Verifica se pergunta foi respondida
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="h-4 w-4" /> {/* Ícone de check */}
                      <span>Respondido</span> {/* Texto indicando que foi respondido */}
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

