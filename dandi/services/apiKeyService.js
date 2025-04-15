import { supabase } from '../lib/supabase'

export const apiKeyService = {
  fetchApiKeys: async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      return { data: null, error }
    }
  },

  createApiKey: async (keyName, keyType) => {
    try {
      const newKey = {
        name: keyName,
        type: keyType,
        usage: 0,
        key: `dandi-${keyType}-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        status: 'active'    
      }

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating API key:', error)
      return { data: null, error }
    }
  },

  updateKeyStatus: async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error updating API key status:', error)
      return { error }
    }
  },

  updateKeyName: async (id, newName) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name: newName })
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error updating API key:', error)
      return { error }
    }
  },

  deleteApiKey: async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error deleting API key:', error)
      return { error }
    }
  },

  validateApiKey: async (apiKey) => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return { error: error || new Error('Invalid API key') }
    }

    // Update usage count
    await supabase
      .from('api_keys')
      .update({ usage: data.usage + 1 })
      .eq('id', data.id)

    return { data }
  }
} 