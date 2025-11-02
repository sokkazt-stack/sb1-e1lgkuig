//-----------RESUMO----------------------------
//Este código cria um questionário interativo para estudantes numa aplicação feita com React.
//O questionário recolhe respostas do utilizador (por exemplo, em que área precisa de ajuda) e, no final, mostra uma lista de explicadores (tutores) que correspondem às suas preferências.
//Cada tutor é apresentado com o seu nome, foto, descrição e avaliação. O utilizador pode depois ver o perfil completo ou entrar em contacto por e-mail diretamente.

//--------- FLUXO DO CÒDIGO --------------------
//O código começa por importar bibliotecas e componentes necessários, como React, animações (Framer Motion) e ícones (Lucide).
//Define uma lista chamada questions com perguntas e opções de resposta (neste caso, apenas uma pergunta de exemplo).
//Define também uma lista chamada mockTutors com dados fictícios de explicadores (nome, disciplina, avaliação, foto, etc.).
//Cria o componente StudentQuestionnaire, que:
  //Usa o estado (useState) para guardar qual a pergunta atual, as respostas do utilizador e se os resultados devem ser mostrados.
  //Usa a função navigate (de React Router) para mudar de página ou perfil.
  //Define handleAnswer — uma função que guarda a resposta e avança para a próxima pergunta (ou mostra os resultados se for a última).
  //Define handleContactTutor — que abre um e-mail com uma mensagem pré-escrita para o tutor selecionado.
  //Define goBack — que permite voltar à pergunta anterior ou sair dos resultados.
//Se showResults for verdadeiro, o código mostra a lista de explicadores compatíveis, com animações e botões para ver o perfil ou contactar.
//Caso contrário, mostra o questionário com uma barra de progresso, as opções de resposta e um botão “Anterior”.

//---------CODE----------------
import React, { useState } from 'react'  // Importa React e a função useState para gerir valores que mudam ao longo do tempo
import { useNavigate } from 'react-router-dom'  // Importa a função para navegar entre páginas
import { motion, AnimatePresence } from 'framer-motion'  // Importa componentes que criam animações suaves
import { Button } from './ui/button'  // Importa o componente de botão personalizado
import { Card } from './ui/card'  // Importa o componente de cartão personalizado (estrutura visual)
import { ChevronRight, ChevronLeft, Check, Star, Mail } from 'lucide-react'  // Importa ícones prontos a usar

// Define a lista de perguntas do questionário
const questions = [
  {
    id: 1,  // Identificador da pergunta
    title: "Em que área precisa de ajuda?",  // Texto da pergunta mostrado ao utilizador
    options: [  // Lista das possíveis respostas
      { value: "matematica", label: "A) Matemática e Ciências Exatas" },
      { value: "linguas", label: "B) Línguas e Literatura" },
      { value: "ciencias", label: "C) Ciências Naturais e Biologia" },
      { value: "humanas", label: "D) Ciências Humanas e Sociais" }
    ]
  }
]

// Dados fictícios de tutores — simulam resultados que apareceriam depois do questionário
const mockTutors = [
  {
    id: 1,
    name: "Ana Silva",
    subject: "Matemática",
    bio: "Professora experiente com 8 anos de ensino. Especializada em álgebra e cálculo.",
    rating: 4.9,  // Avaliação média
    email: "ana.silva@email.com",  // Email de contacto
    profilePicture: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"  // Foto do tutor
  },
  {
    id: 2,
    name: "João Santos",
    subject: "Física e Química",
    bio: "Engenheiro químico com paixão pelo ensino. Métodos práticos e eficazes.",
    rating: 4.8,
    email: "joao.santos@email.com",
    profilePicture: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Maria Costa",
    subject: "Biologia",
    bio: "Doutora em biologia molecular. Abordagem científica e didática personalizada.",
    rating: 4.9,
    email: "maria.costa@email.com",
    profilePicture: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
]

// Cria o componente principal do questionário do estudante
export const StudentQuestionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)  // Guarda qual é a pergunta atual (começa na 1ª)
  const [answers, setAnswers] = useState<Record<string, string>>({})  // Guarda as respostas do utilizador
  const [showResults, setShowResults] = useState(false)  // Define se já deve mostrar os tutores (resultados)
  const navigate = useNavigate()  // Permite mudar de página

  // Função chamada quando o utilizador escolhe uma resposta
  const handleAnswer = (questionId: number, answer: string) => {
    const newAnswers = { ...answers, [`question_${questionId}_answer`]: answer }  // Cria uma nova lista de respostas incluindo a nova
    setAnswers(newAnswers)  // Atualiza o estado com as respostas mais recentes

    // Verifica se há mais perguntas ou se é a última
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)  // Avança para a próxima pergunta
    } else {
      setShowResults(true)  // Se for a última, mostra os resultados (tutores)
    }
  }

  // Função para abrir o e-mail de contacto do tutor com uma mensagem pré-escrita
  const handleContactTutor = (email: string, tutorName: string) => {
    const subject = encodeURIComponent(`Interessado em explicações - Plastudo`)  // Define o assunto do e-mail
    const body = encodeURIComponent(`Olá ${tutorName},\n\nEncontrei o seu perfil na Plastudo e estou interessado(a) nas suas explicações.\n\nPodemos conversar sobre disponibilidade e condições?\n\nObrigado(a)!`)  // Define o corpo do e-mail
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`  // Abre o programa de e-mail do utilizador
  }

  // Função para voltar atrás (no questionário ou nos resultados)
  const goBack = () => {
    if (showResults) {  // Se estiver a mostrar resultados...
      setShowResults(false)  // Volta ao modo do questionário
      setCurrentQuestion(questions.length - 1)  // Volta à última pergunta
    } else if (currentQuestion > 0) {  // Se não for a primeira pergunta
      setCurrentQuestion(currentQuestion - 1)  // Volta uma pergunta atrás
    }
  }

  // Se o utilizador já chegou ao fim e está a ver os resultados (tutores)
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">  {/* Fundo colorido */}
        <div className="max-w-6xl mx-auto px-4">  {/* Centraliza o conteúdo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}  // Começa invisível e deslocado para baixo
            animate={{ opacity: 1, y: 0 }}  // Aparece suavemente
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Os seus matches perfeitos!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Baseado nas suas respostas, encontrámos estes explicadores ideais para si.
            </p>
            <Button
              variant="outline"
              onClick={goBack}  // Volta ao questionário
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />  {/* Ícone de seta para a esquerda */}
              Voltar ao questionário
            </Button>
          </motion.div>

          {/* Lista de tutores correspondentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockTutors.map((tutor, index) => (  // Percorre cada tutor da lista
              <motion.div
                key={tutor.id}  // Identifica cada elemento
                initial={{ opacity: 0, y: 30 }}  // Começa invisível
                animate={{ opacity: 1, y: 0 }}  // Anima para visível
                transition={{ delay: index * 0.1 }}  // Pequeno atraso entre cada card
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="text-center mb-4">
                    <img
                      src={tutor.profilePicture}  // Mostra a foto do tutor
                      alt={tutor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {tutor.name}  // Nome do tutor
                    </h3>
                    <p className="text-green-600 font-medium mb-2">{tutor.subject}</p>  // Disciplina
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />  // Ícone estrela
                      <span className="text-sm font-medium text-gray-700">{tutor.rating}</span>  // Avaliação
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tutor.bio}  // Pequena biografia
                  </p>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(`/profile/${tutor.id}`)}  // Abre o perfil do tutor
                      variant="outline"
                      className="w-full"
                    >
                      Ver perfil completo
                    </Button>
                    <Button
                      onClick={() => handleContactTutor(tutor.email, tutor.name)}  // Abre o e-mail
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      <Mail className="h-4 w-4 mr-2" />  // Ícone de e-mail
                      Contactar
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Secção final com botão para explorar mais */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-4">Quer ver mais opções?</p>
            <Button
              onClick={() => navigate('/marketplace')}  // Vai para a página de todos os explicadores
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
            >
              Explorar todos os explicadores
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Se ainda não terminou o questionário, mostra a pergunta atual
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100  // Calcula a percentagem de progresso

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Barra de progresso do questionário */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-full h-3 overflow-hidden shadow-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}  // Aumenta conforme as perguntas respondidas
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Pergunta {currentQuestion + 1} de {questions.length}  // Mostra o número da pergunta
          </p>
        </motion.div>

        {/* Área da pergunta atual */}
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
                {question.title}  // Mostra o título da pergunta
              </h2>

              <div className="space-y-4">
                {question.options.map((option, index) => (  // Mostra todas as opções de resposta
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(question.id, option.value)}  // Quando o utilizador clica, guarda a resposta
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-gray-700 group-hover:text-blue-700">
                        {option.label}  // Texto da opção
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />  // Ícone decorativo
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={goBack}  // Botão para voltar à pergunta anterior
                  disabled={currentQuestion === 0}  // Desativado na primeira pergunta
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </Button>

                {/* Indicação visual de que a pergunta foi respondida */}
                <div className="text-sm text-gray-500">
                  {answers[`question_${question.id}_answer`] && (
                    <div className="flex items-center space-x-2 text-blue-600">
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
