'use client'

import { useState, useEffect } from 'react'
import { apiKeyService } from '../../services/apiKeyService'
import Sidebar from '../../components/Sidebar'
import Toast from '../../components/Toast'

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [editingKey, setEditingKey] = useState(null)
  const [keyType, setKeyType] = useState('dev')
  const [visibleKeys, setVisibleKeys] = useState({})
  const [loading, setLoading] = useState(true)
  const [copyStatus, setCopyStatus] = useState({})
  const [toast, setToast] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast(null)
    setTimeout(() => {
      setToast({ message, type })
    }, 100)
  }

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await apiKeyService.fetchApiKeys()
      if (error) throw error
      setApiKeys(data || [])
      showToast('API keys loaded successfully')
    } catch (error) {
      console.error('Error fetching API keys:', error)
      showToast('Failed to fetch API keys', 'error')
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async (e) => {
    e.preventDefault()
    if (!newKeyName) return

    try {
      const { data, error } = await apiKeyService.createApiKey(newKeyName, keyType)
      if (error) throw error

      setApiKeys([...(data || []), ...apiKeys])
      setNewKeyName('')
      setKeyType('dev')
      setIsModalOpen(false)
      showToast('API key created successfully')
    } catch (error) {
      console.error('Error creating API key:', error)
      showToast('Failed to create API key', 'error')
    }
  }

  const toggleKeyStatus = async (id) => {
    try {
      const keyToUpdate = apiKeys.find(key => key.id === id)
      const newStatus = keyToUpdate.status === 'active' ? 'inactive' : 'active'

      const { error } = await apiKeyService.updateKeyStatus(id, newStatus)
      if (error) throw error

      setApiKeys(apiKeys.map(key => {
        if (key.id === id) {
          return { ...key, status: newStatus }
        }
        return key
      }))
      showToast(`API key ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'warning')
    } catch (error) {
      console.error('Error updating API key status:', error)
      showToast('Failed to update API key status', 'error')
    }
  }

  const updateKeyName = async (e) => {
    e.preventDefault()
    if (!newKeyName || !editingKey) return

    try {
      const { error } = await apiKeyService.updateKeyName(editingKey.id, newKeyName)
      if (error) throw error

      setApiKeys(apiKeys.map(key => {
        if (key.id === editingKey.id) {
          return { ...key, name: newKeyName }
        }
        return key
      }))
      setNewKeyName('')
      setEditingKey(null)
      setIsEditModalOpen(false)
      showToast('API key name updated successfully')
    } catch (error) {
      console.error('Error updating API key:', error)
      showToast('Failed to update API key name', 'error')
    }
  }

  const deleteKey = async (id) => {
    try {
      const { error } = await apiKeyService.deleteApiKey(id)
      if (error) throw error

      setApiKeys(apiKeys.filter(key => key.id !== id))
      showToast('API key deleted successfully', 'warning')
    } catch (error) {
      console.error('Error deleting API key:', error)
      showToast('Failed to delete API key', 'error')
    }
  }

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const maskKey = (key) => {
    const prefix = key.split('-').slice(0, 2).join('-')
    return `${prefix}-${'•'.repeat(13)}`
  }

  const copyToClipboard = async (key, id) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopyStatus({ [id]: true })
      setTimeout(() => setCopyStatus({}), 2000)
      showToast('API key copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
      showToast('Failed to copy to clipboard', 'error')
    }
  }

  const startEditingKey = (key) => {
    setEditingKey(key)
    setNewKeyName(key.name)
    setIsEditModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-200 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    )
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
              <span>Overview</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/10 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <h1 className="text-5xl font-bold mb-12">Researcher</h1>

          {/* API Usage Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">API Usage</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Plan</span>
              <span className="text-sm">0 / 1,000 Credits</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-4 h-4 relative">
                <input type="checkbox" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                <div className="w-full h-full border-2 border-gray-300 rounded"></div>
              </div>
              <span className="text-sm">Pay as you go</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                + Create New Key
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              The key is used to authenticate your requests to the Research API. To learn more, see the{' '}
              <a href="#" className="underline">documentation</a> page.
            </p>

            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">NAME</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">TYPE</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">USAGE</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">KEY</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm">{key.name}</td>
                    <td className="py-3 px-4 text-sm">{key.type}</td>
                    <td className="py-3 px-4 text-sm">{key.usage}</td>
                    <td className="py-3 px-4 text-sm font-mono">
                      <div className="flex items-center gap-2">
                        {visibleKeys[key.id] ? key.key : maskKey(key.key)}
                        <button 
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {visibleKeys[key.id] ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            ) : (
                              <>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </>
                            )}
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg group relative" 
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {visibleKeys[key.id] ? 'Hide API Key' : 'Show API Key'}
                          </span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {visibleKeys[key.id] ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            ) : (
                              <>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </>
                            )}
                          </svg>
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg group relative"
                          onClick={() => copyToClipboard(key.key, key.id)}
                        >
                          <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {copyStatus[key.id] ? 'Copied!' : 'Copy to Clipboard'}
                          </span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg group relative"
                          onClick={() => startEditingKey(key)}
                        >
                          <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Edit Key Name
                          </span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg text-red-600 group relative"
                          onClick={() => deleteKey(key.id)}
                        >
                          <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Delete Key
                          </span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-white/5 pointer-events-none" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white/95 rounded-xl p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Create New API Key</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={createApiKey}>
                <div className="mb-4">
                  <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name
                  </label>
                  <input
                    id="keyName"
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Enter key name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="keyType" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Type
                  </label>
                  <select
                    id="keyType"
                    value={keyType}
                    onChange={(e) => setKeyType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dev">Development</option>
                    <option value="prod">Production</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Create Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {isEditModalOpen && (
        <>
          <div className="fixed inset-0 bg-white/5 pointer-events-none" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white/95 rounded-xl p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit API Key</h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingKey(null)
                    setNewKeyName('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={updateKeyName}>
                <div className="mb-4">
                  <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name
                  </label>
                  <input
                    id="keyName"
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Enter key name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false)
                      setEditingKey(null)
                      setNewKeyName('')
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 