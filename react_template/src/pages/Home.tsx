import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Palette } from 'lucide-react'
import { Card } from '@/components/Card'
import config from '@/config'

/**
 * Home Page
 *
 * Landing page for authenticated users.
 * TODO: Customize this page with your own content.
 */
export function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Fast & Modern',
      description: 'Built with React 18, TypeScript, and Vite for lightning-fast performance.',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with protected routes and role-based access control.',
    },
    {
      icon: Palette,
      title: 'Dark Mode',
      description: 'Beautiful dark mode support with Tailwind CSS and persistent preferences.',
    },
  ]

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Hero Section */}
        <div className="text-center py-12 md:py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600 dark:text-blue-400">{config.appName}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {config.appDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={config.routes.dashboard} className="btn-primary inline-flex items-center justify-center">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center justify-center"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title}>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="py-12">
          <Card>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Built With Modern Technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'TanStack Query'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="py-12 text-center">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This template provides everything you need to get started quickly.
            </p>
            <Link to={config.routes.dashboard} className="btn-primary inline-flex items-center">
              Explore Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
