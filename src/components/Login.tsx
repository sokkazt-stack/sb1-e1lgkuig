//Este código define um componente React chamado Login, que mostra um formulário de login usando o componente AuthModal. 
//Ele verifica se o utilizador já está autenticado e, nesse caso, redireciona automaticamente para a página de perfil. 
//Caso contrário, permite que o utilizador faça login e, após concluir, também é redirecionado para a página de perfil.

//Resumo do fluxo de autenticação:
//1.Usuário abre a página de login (Login).
//2.Se já estiver logado (user não é null), useEffect redireciona para /profile.
//3.Caso não esteja logado, o AuthModal aparece.
//4.Usuário digita credenciais e envia o formulário.
//5.AuthModal processa login/registo, verifica erros e, se tudo estiver correto, chama onComplete(userId).
//6.handleComplete é chamado, e o utilizador é redirecionado para /profile.

  
import React, { useEffect } from 'react'  // Importa o React e o hook useEffect, usado para executar código quando algo muda
import { useNavigate } from 'react-router-dom'  // Importa o hook para navegar entre páginas sem recarregar o site
import { useAuth } from '../contexts/AuthContext'  // Importa o contexto de autenticação para saber se o utilizador está logado
import { AuthModal } from './AuthModal'  // Importa o componente do formulário de login/registo

export const Login = () => {  // Define o componente funcional Login
  const { user } = useAuth()  // Obtém o utilizador atual do contexto de autenticação
  const navigate = useNavigate()  // Cria uma função para navegar entre páginas

  useEffect(() => {  // Hook que executa código quando o componente é renderizado ou quando "user" ou "navigate" mudam
    if (user) {  // Se já houver um utilizador logado
      navigate('/profile')  // Redireciona automaticamente para a página de perfil
    }
  }, [user, navigate])  // Executa sempre que "user" ou "navigate" mudarem

  const handleComplete = (userId: string) => {  // Função chamada quando o login/registo for concluído
    navigate('/profile')  // Redireciona para a página de perfil após o utilizador concluir o login/registo
  }

  return (  // Parte visual do componente
    <AuthModal 
      onComplete={handleComplete}  // Passa a função que será chamada quando o utilizador completar o login
      title="Bem-vindo de volta"  // Título personalizado do modal
      subtitle="Entre na sua conta para continuar"  // Subtítulo personalizado do modal
    />
  )
}
