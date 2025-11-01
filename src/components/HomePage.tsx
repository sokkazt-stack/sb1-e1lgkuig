import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { GraduationCap, Search, BookOpen, Users, Star, ArrowRight } from 'lucide-react'

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                Encontre o{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-green-600">
                  explicador perfeito
                </span>{' '}
                para si
              </h1>
              <p className="text-lg leading-8 text-gray-600 mb-10">
                Conectamos estudantes com os melhores explicadores de Portugal. 
                Aprenda ao seu ritmo, no seu tempo, com quem entende as suas necessidades.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
            >
              <Link to="/student-questionnaire" className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Encontrar explicador ideal
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/tutor-questionnaire" className="flex-1">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <GraduationCap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Quero ser explicador
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 opacity-20"
        >
          <BookOpen className="h-12 w-12 text-yellow-500" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-32 right-16 opacity-20"
        >
          <Users className="h-16 w-16 text-green-500" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Como funciona?
            </h2>
            <p className="text-lg text-gray-600">
              Um processo simples e eficaz para encontrar o explicador ideal
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
            {[
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
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-green-100">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl px-6 text-center"
        >
          <div className="rounded-3xl bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 p-8 sm:p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Junte-se a milhares de estudantes que já encontraram o seu explicador ideal
            </p>
            <Link to="/marketplace">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Explorar explicadores
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}