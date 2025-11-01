//Este código define um componente React chamado AuthModal, que mostra um formulário de autenticação (login ou registo). 
//Ele permite que o utilizador crie uma conta nova ou entre numa já existente, usando o email e a palavra-passe. 
//O código também lida com validação, erros, animações visuais e integração com o abse de dadso (Supabase).

import React, { useState } from 'react'  // Importa o React e o hook useState, usado para guardar e alterar valores no estado do componente
import { motion } from 'framer-motion'  // Importa a biblioteca Framer Motion, usada para criar animações suaves
import { Card } from './ui/card'  // Importa o componente "Card" (caixa visual estilizada)
import { Button } from './ui/button'  // Importa o componente "Button" (botão personalizado)
import { Input } from './ui/input'  // Importa o componente "Input" (campo de texto)
import { Label } from './ui/label'  // Importa o componente "Label" (texto descritivo para inputs)
import { useAuth } from '../contexts/AuthContext'  // Importa o contexto de autenticação, que fornece funções de login e registo
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'  // Importa ícones visuais (email, cadeado, utilizador, etc.)

interface AuthModalProps {  // Define as propriedades que o componente AuthModal pode receber
  onComplete: (userId: string) => void  // Função a executar quando o processo for concluído (recebe o ID do utilizador)
  title?: string  // Título opcional
  subtitle?: string  // Subtítulo opcional
}

export const AuthModal = ({ onComplete, title, subtitle }: AuthModalProps) => {  // Define o componente AuthModal e recebe as props
  const [isSignUp, setIsSignUp] = useState(true)  // Guarda se o utilizador está no modo "criar conta" (true) ou "entrar" (false)
  const [email, setEmail] = useState('')  // Guarda o valor do campo de email
  const [password, setPassword] = useState('')  // Guarda o valor do campo da palavra-passe
  const [name, setName] = useState('')  // Guarda o nome do utilizador (usado apenas no registo)
  const [showPassword, setShowPassword] = useState(false)  // Controla se a palavra-passe está visível ou escondida
  const [loading, setLoading] = useState(false)  // Indica se o formulário está a processar algo (para mostrar um "spinner")
  const [error, setError] = useState('')  // Guarda mensagens de erro

  const { signUp, signIn } = useAuth()  // Obtém as funções signUp (registar) e signIn (entrar) do contexto de autenticação

  const handleSubmit = async (e: React.FormEvent) => {  // Define a função chamada quando o utilizador envia o formulário
    e.preventDefault()  // Impede o comportamento padrão do formulário (recarregar a página)
    setLoading(true)  // Ativa o estado de carregamento
    setError('')  // Limpa mensagens de erro anteriores

    try {
      // Verifica se o Supabase (sistema de autenticação) está configurado corretamente
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL  // Obtém o endereço do Supabase das variáveis de ambiente
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('xyzcompany')) {
        throw new Error('Supabase não está configurado. Por favor, configure as suas credenciais Supabase.')  // Mostra erro se não estiver configurado
      }

      let result  // Variável que vai guardar o resultado do login ou registo
      if (isSignUp) {  // Se o utilizador estiver a criar conta
        result = await signUp(email, password)  // Tenta criar a conta com o email e palavra-passe
        if (result.data?.user) {  // Se o registo for bem-sucedido
          // Atualização de dados do utilizador (comentada)
          // await supabase.auth.updateUser({
          //   data: { name }
          // })
          onComplete(result.data.user.id)  // Chama a função passada por props com o ID do novo utilizador
        }
      } else {  // Caso contrário, é um login
        result = await signIn(email, password)  // Tenta iniciar sessão com as credenciais
        if (result.data?.user) {  // Se o login for bem-sucedido
          onComplete(result.data.user.id)  // Chama a função onComplete com o ID do utilizador
        }
      }

      if (result.error) {  // Se houver erro no processo
        throw result.error  // Lança o erro para ser tratado abaixo
      }
    } catch (error: any) {  // Caso ocorra algum erro
      setError(error.message || 'Ocorreu um erro. Tente novamente.')  // Guarda a mensagem de erro para mostrar ao utilizador
    } finally {
      setLoading(false)  // Desativa o estado de carregamento
    }
  }

  return (  // Início da parte visual do componente
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 py-8 flex items-center justify-center">  {/* Fundo com gradiente e centralização */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}  // Define o estado inicial da animação (ligeiramente pequeno e transparente)
        animate={{ opacity: 1, scale: 1 }}  // Define o estado final (totalmente visível e tamanho normal)
        className="w-full max-w-md px-4"  // Define a largura máxima do conteúdo
      >
        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">  {/* Caixa visual com fundo branco e sombra */}
          <div className="text-center mb-6">  {/* Cabeçalho com título e subtítulo */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title || (isSignUp ? 'Criar conta' : 'Iniciar sessão')}  {/* Mostra título personalizado ou padrão */}
            </h2>
            <p className="text-gray-600">
              {subtitle || (isSignUp ? 'Complete o seu registo para continuar' : 'Entre na sua conta')}  {/* Mostra subtítulo conforme o modo */}
            </p>
          </div>

          {error && (  // Se existir uma mensagem de erro
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>  // Mostra o texto do erro
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">  {/* Início do formulário */}
            {isSignUp && (  // Se estiver no modo de registo, mostra o campo "Nome completo"
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />  // Ícone de utilizador dentro do campo
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}  // Atualiza o estado "name" conforme o utilizador escreve
                    placeholder="O seu nome"
                    className="pl-10"
                    required={isSignUp}  // Torna o campo obrigatório apenas no registo
                  />
                </div>
              </div>
            )}

            <div>  {/* Campo de email */}
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />  // Ícone de email
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  // Atualiza o estado "email"
                  placeholder="exemplo@email.com"
                  className="pl-10"
                  required  // Campo obrigatório
                />
              </div>
            </div>

            <div>  {/* Campo da palavra-passe */}
              <Label htmlFor="password">Palavra-passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />  // Ícone de cadeado
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}  // Mostra ou esconde o texto da palavra-passe
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}  // Atualiza o estado "password"
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}  // Alterna entre mostrar e esconder a palavra-passe
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}  // Mostra o ícone correspondente (olho aberto ou fechado)
                </button>
              </div>
              {isSignUp && (  // Mostra uma dica se for registo
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <Button
              type="submit"  // Botão que envia o formulário
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              disabled={loading}  // Desativa o botão enquanto está a carregar
            >
              {loading ? (  // Se estiver a carregar, mostra um ícone animado
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isSignUp ? 'A criar conta...' : 'A iniciar sessão...'}  // Mostra texto diferente conforme o modo
                </>
              ) : (
                isSignUp ? 'Criar conta' : 'Iniciar sessão'  // Texto normal do botão
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">  {/* Secção para alternar entre login e registo */}
            <p className="text-gray-600">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}  // Pergunta adequada conforme o modo atual
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp)  // Troca entre os modos login/registo
                setError('')  // Limpa erros ao mudar de modo
              }}
              className="text-green-600 hover:text-green-700"
            >
              {isSignUp ? 'Iniciar sessão' : 'Criar conta'}  // Botão que muda o modo
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
