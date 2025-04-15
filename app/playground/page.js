'use client'

import { useState } from 'react'
import { apiKeyService } from '../../services/apiKeyService'
import Sidebar from '../../components/Sidebar'
import Toast from '../../components/Toast'

export default function APIPlayground() {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [isValidated, setIsValidated] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast(null)
    setTimeout(() => {
      setToast({ message, type })
    }, 100)
  }

  const validateApiKey = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await apiKeyService.validateApiKey(apiKey)
      
      if (error) {
        showToast('Invalid API key', 'error')
        setIsValidated(false)
      } else {
        showToast('API key validated successfully')
        setIsValidated(true)
      }
    } catch (error) {
      console.error('Error validating API key:', error)
      showToast('Failed to validate API key', 'error')
      setIsValidated(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-200">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(prev => !prev)} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Toast Notification */}
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Pages</span>
              <span>/</span>
              <span>API Playground</span>
            </div>
          </div>

          {/* Title Section */}
          <h1 className="text-5xl font-bold mb-12">API Playground</h1>

          {!isValidated ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-md">
              <h2 className="text-xl font-semibold mb-6">Validate Your API Key</h2>
              <form onSubmit={validateApiKey}>
                <div className="mb-6">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-black text-white px-4 py-2 rounded-lg transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Validating...' : 'Validate Key'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 text-green-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-xl font-semibold">Protected Content</h2>
              </div>
              <p className="text-gray-600">
                You are in a protected page that can only be accessed using a valid API key.
              </p>
              <button
                onClick={() => {
                  setIsValidated(false)
                  setApiKey('')
                }}
                className="mt-6 text-sm text-gray-500 hover:text-gray-700"
              >
                Try another API key
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 