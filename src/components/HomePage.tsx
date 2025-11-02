//-----------RESUMO----------------------------
//Objetivo geral: Este ficheiro define um componente React chamado `HomePage` que constrói a página inicial de um site para encontrar explicadores. 
//Mostra um cabeçalho com título e descrição, botões que levam a questionários, secções com passos (features) e uma chamada à ação final. 
//Inclui animações simples (com Framer Motion) e ícones decorativos para tornar a página mais dinâmica e agradável.

//--------- FLUXO DO CÒDIGO --------------------
//O código importa React, Framer Motion, componentes de interface, ícones e Link do React Router.
//Cria o componente HomePage, que apresenta a página inicial do site de forma visual e animada.
//Mostra uma secção principal com título e descrição, destacando “encontrar o explicador perfeito”, com animações de entrada suaves.
//Inclui dois botões principais: um para estudantes responderem ao questionário e outro para quem quer ser explicador, ambos com ícones e efeitos visuais.
//Apresenta uma secção de funcionalidades explicando em três passos como o serviço funciona: responder ao questionário, encontrar matches perfeitos e começar a aprender, cada passo com ícone, título e descrição animados.
//Finaliza com uma secção de chamada para ação (CTA), incentivando o utilizador a explorar o marketplace de explicadores, com botão destacado e animado.

//---------CODE----------------
import React from 'react'  // Importa a biblioteca React, necessária para criar componentes de interface
import { Link } from 'react-router-dom'  // Importa 'Link' para navegar entre páginas sem recarregar o site
import { motion } from 'framer-motion'  // Importa 'motion' para criar animações simples e fluidas
import { Button } from './ui/button'  // Importa um componente de botão personalizado do projeto
import { GraduationCap, Search, BookOpen, Users, Star, ArrowRight } from 'lucide-react'  // Importa vários ícones prontos a usar

export const HomePage = () => {  // Declara um componente funcional chamado 'HomePage'
  return (  // Começa a descrição do que será mostrado no ecrã
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50">  // Contém toda a página; define altura mínima e fundo com gradiente
      {/* Hero Section */}  // Comentário JSX: secção principal de destaque
      <section className="relative overflow-hidden py-20 sm:py-32">  // Secção com espaçamento grande; 'relative' permite posicionar elementos dentro dela
        <div className="mx-auto max-w-7xl px-6 lg:px-8">  // Centraliza o conteúdo e limita a largura máxima
          <div className="mx-auto max-w-2xl text-center">  // Caixa centralizada para o texto principal, com alinhamento ao centro
            <motion.div  // Bloco animado (aparece com uma transição)
              initial={{ y: 20, opacity: 0 }}  // Começa um pouco abaixo e invisível
              animate={{ y: 0, opacity: 1 }}  // Move-se para o lugar e fica visível
              transition={{ duration: 0.6 }}  // Duração da animação: 0.6 segundos
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">  // Título principal grande e em negrito
                Encontre o{' '}  // Texto com um espaço explícito
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-green-600">  // Parte do título com efeito de gradiente no texto
                  explicador perfeito
                </span>{' '}  // Fecha o span e mantém espaço
                para si
              </h1>
              <p className="text-lg leading-8 text-gray-600 mb-10">  // Parágrafo explicativo abaixo do título
                Conectamos estudantes com os melhores explicadores de Portugal. 
                Aprenda ao seu ritmo, no seu tempo, com quem entende as suas necessidades.
              </p>
            </motion.div>

            <motion.div  // Bloco animado para os botões principais
              initial={{ y: 30, opacity: 0 }}  // Inicia mais abaixo e invisível
              animate={{ y: 0, opacity: 1 }}  // Sobe e torna-se visível
              transition={{ duration: 0.6, delay: 0.2 }}  // Pequeno atraso para aparecer depois do título
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"  // Layout responsivo: empilha em telemóveis, alinha em linha em ecrãs maiores
            >
              <Link to="/student-questionnaire" className="flex-1">  // Link que leva ao questionário para estudantes
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"  // Estilos do botão (tamanho, cores, transições)
                >
                  <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />  // Ícone de pesquisa à esquerda do texto do botão
                  Encontrar explicador ideal  // Texto do botão
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />  // Ícone de seta à direita que se move ao passar o rato
                </Button>
              </Link>
              
              <Link to="/tutor-questionnaire" className="flex-1">  // Link que leva ao formulário para quem quer ser explicador
                <Button 
                  size="lg" 
                  variant="outline"  // Variante do botão com contorno
                  className="w-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200 group"  // Estilos do botão (bordas, cores, efeitos)
                >
                  <GraduationCap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />  // Ícone de chapéu de formatura
                  Quero ser explicador  // Texto do botão
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />  // Ícone de seta com pequeno movimento ao passar o rato
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}  // Comentário JSX: elementos decorativos que parecem flutuar
        <motion.div
          animate={{ 
            y: [0, -10, 0],  // Faz um pequeno movimento para cima e volta
            rotate: [0, 5, 0]  // Faz uma rotação suave ligeira
          }}
          transition={{ 
            duration: 6,  // Duração do ciclo de animação
            repeat: Infinity,  // Repete para sempre
            ease: "easeInOut"  // Movimento suave de entrada/saída
          }}
          className="absolute top-20 left-10 opacity-20"  // Posiciona o ícone de forma absoluta e com baixa opacidade
        >
          <BookOpen className="h-12 w-12 text-yellow-500" />  // Ícone de livro decorativo
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 10, 0],  // Movimento ligeiramente diferente (baixo e volta)
            rotate: [0, -5, 0]  // Rotação no sentido oposto
          }}
          transition={{ 
            duration: 8,  // Ciclo mais lento
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2  // Este começa com atraso para variar os movimentos
          }}
          className="absolute top-32 right-16 opacity-20"  // Posição à direita e baixa opacidade
        >
          <Users className="h-16 w-16 text-green-500" />  // Ícone de utilizadores (pessoas)
        </motion.div>
      </section>

      {/* Features Section */}  // Secção que explica como o serviço funciona, em passos
      <section className="py-16 bg-white/60 backdrop-blur-sm">  // Fundo semi-transparente com ligeiro desfoque
        <div className="mx-auto max-w-7xl px-6 lg:px-8">  // Controlo de largura e espaçamento
          <motion.div
            initial={{ y: 20, opacity: 0 }}  // Animação de entrada
            whileInView={{ y: 0, opacity: 1 }}  // Aparece quando entra na vista do utilizador
            viewport={{ once: true }}  // Só anima uma vez
            transition={{ duration: 0.6 }}  // Duração da animação
            className="mx-auto max-w-2xl text-center mb-16"  // Caixa centralizada com margem inferior
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">  // Subtítulo grande
              Como funciona?
            </h2>
            <p className="text-lg text-gray-600">  // Texto explicativo curto
              Um processo simples e eficaz para encontrar o explicador ideal
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">  // Grelha responsiva: 1 coluna em telemóvel, 3 em ecrãs grandes
            {[  // Array de objetos com os passos/features mostrados na página
              {
                icon: Search,
                title: "1. Responda ao questionário",
                description: "Conte-nos sobre as suas necessidades, objetivos e preferências de aprendizagem."
              },
              {
                icon: Users,
                title: "2. Encontre matches perfeitos",
                description: "O nosso algoritmo conecta-o com os explicadores mais adequados ao seu perfil."
              },
              {
                icon: Star,
                title: "3. Comece a aprender",
                description: "Entre em contacto diretamente e comece a sua jornada de aprendizagem personalizada."
              }
            ].map((feature, index) => (  // Para cada objecto no array, cria um bloco visual
              <motion.div
                key={feature.title}  // Chave única para otimizar a renderização (ajuda o React a identificar cada bloco)
                initial={{ y: 20, opacity: 0 }}  // Efeito de entrada
                whileInView={{ y: 0, opacity: 1 }}  // Mostra quando estiver visível no ecrã
                viewport={{ once: true }}  // Anima apenas a primeira vez
                transition={{ duration: 0.6, delay: index * 0.1 }}  // Adiciona um pequeno atraso sequencial entre os itens
                className="text-center"  // Alinha o conteúdo ao centro
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-green-100">  // Caixa circular com gradiente para o ícone
                  <feature.icon className="h-8 w-8 text-green-600" />  // Mostra o ícone definido no objecto (Search, Users, Star)
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">  // Título do passo
                  {feature.title}
                </h3>
                <p className="text-gray-600">  // Descrição do passo
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}  // Seção final com chamada para ação (convidar o utilizador a explorar o marketplace)
      <section className="py-16">  // Espaçamento vertical
        <motion.div
          initial={{ y: 20, opacity: 0 }}  // Animação de entrada
          whileInView={{ y: 0, opacity: 1 }}  // Aparece quando entra na vista
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl px-6 text-center"  // Caixa centralizada para o conteúdo da CTA
        >
          <div className="rounded-3xl bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 p-8 sm:p-12 shadow-xl">  // Caixa com cantos arredondados, gradiente e sombra
            <h2 className="text-3xl font-bold text-gray-900 mb-4">  // Pergunta incentivadora
              Pronto para começar?
            </h2>
            <p className="text-lg text-gray-600 mb-8">  // Mensagem que reforça a confiança
              Junte-se a milhares de estudantes que já encontraram o seu explicador ideal
            </p>
            <Link to="/marketplace">  // Link para explorar os explicadores disponíveis
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"  // Estilos do botão principal da CTA
              >
                Explorar explicadores  // Texto do botão
                <ArrowRight className="ml-2 h-4 w-4" />  // Pequeno ícone de seta à direita do texto
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )  // Fecha o return
}  // Fecha o componente HomePage
