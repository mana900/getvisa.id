import { supabase } from '../supabase'
import type { Setting, SettingInsert, SettingUpdate } from '../types/database'

export class SettingsService {
  // Get all settings
  static async getAllSettings(): Promise<Setting[]> {
    try {
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch settings')
      }
      
      return result || []
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw new Error('Failed to fetch settings')
    }
  }

  // Get a specific setting by key
  static async getSetting(key: string): Promise<string | null> {
    try {
      const { data: setting, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Error fetching setting:', error)
        throw new Error('Failed to fetch setting')
      }

      return setting?.value || null
    } catch (error) {
      console.error('Error fetching setting:', error)
      return null
    }
  }

  // Update or create a setting
  static async updateSetting(key: string, value: string, description?: string): Promise<Setting> {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value, description }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update setting')
      }
      
      return result
    } catch (error) {
      console.error('Error updating setting:', error)
      throw new Error('Failed to update setting')
    }
  }

  // Get WhatsApp number specifically
  static async getWhatsAppNumber(): Promise<string> {
    try {
      const number = await this.getSetting('whatsapp_number')
      return number || '' // Return empty string if not set
    } catch (error) {
      console.error('Error getting WhatsApp number:', error)
      return ''
    }
  }

  // Set WhatsApp number specifically
  static async setWhatsAppNumber(number: string): Promise<void> {
    try {
      await this.updateSetting(
        'whatsapp_number', 
        number, 
        'WhatsApp number for visa consultation messages'
      )
    } catch (error) {
      console.error('Error setting WhatsApp number:', error)
      throw error
    }
  }

  // Get WhatsApp message template
  static async getWhatsAppMessageTemplate(): Promise<string> {
    try {
      const template = await this.getSetting('whatsapp_message_template')
      return template || "I'd like to apply for Visa - ({countryName}) - ({visaType}) - "
    } catch (error) {
      console.error('Error getting WhatsApp message template:', error)
      return "I'd like to apply for Visa - ({countryName}) - ({visaType}) - "
    }
  }
}