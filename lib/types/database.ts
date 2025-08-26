export interface Database {
  public: {
    Tables: {
      visa_types: {
        Row: {
          id: string
          country: string
          country_code: string
          flag: string
          visa_type: string
          price: number
          processing_time: string
          duration: string
          validity: string
          is_active: boolean
          overview: {
            description: string
            features: string[]
            guaranteedDate?: string
          }
          eligibility: string[]
          timeline: {
            step: string
            time: string
            description: string
          }[]
          documents: string[]
          faqs: {
            question: string
            answer: string
          }[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country: string
          country_code: string
          flag: string
          visa_type: string
          price: number
          processing_time: string
          duration: string
          validity: string
          is_active?: boolean
          overview?: {
            description: string
            features: string[]
            guaranteedDate?: string
          }
          eligibility?: string[]
          timeline?: {
            step: string
            time: string
            description: string
          }[]
          documents?: string[]
          faqs?: {
            question: string
            answer: string
          }[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country?: string
          country_code?: string
          flag?: string
          visa_type?: string
          price?: number
          processing_time?: string
          duration?: string
          validity?: string
          is_active?: boolean
          overview?: {
            description: string
            features: string[]
            guaranteedDate?: string
          }
          eligibility?: string[]
          timeline?: {
            step: string
            time: string
            description: string
          }[]
          documents?: string[]
          faqs?: {
            question: string
            answer: string
          }[]
          created_at?: string
          updated_at?: string
        }
      }
      visa_applications: {
        Row: {
          id: string
          user_id: string
          visa_type_id: string
          status: 'pending' | 'approved' | 'rejected' | 'processing'
          application_data: Record<string, any>
          submitted_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          visa_type_id: string
          status?: 'pending' | 'approved' | 'rejected' | 'processing'
          application_data?: Record<string, any>
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          visa_type_id?: string
          status?: 'pending' | 'approved' | 'rejected' | 'processing'
          application_data?: Record<string, any>
          submitted_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          application_id: string
          filename: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          application_id: string
          filename: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          filename?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_at?: string
        }
      }
    }
  }
}

export type VisaType = Database['public']['Tables']['visa_types']['Row']
export type VisaTypeInsert = Database['public']['Tables']['visa_types']['Insert']
export type VisaTypeUpdate = Database['public']['Tables']['visa_types']['Update']

// User types based on Supabase auth.users
export interface User {
  id: string
  email: string
  user_metadata: {
    role?: 'user' | 'admin'
    first_name?: string
    last_name?: string
  }
  created_at: string
  updated_at: string
}

export type VisaApplication = Database['public']['Tables']['visa_applications']['Row']
export type VisaApplicationInsert = Database['public']['Tables']['visa_applications']['Insert']
export type VisaApplicationUpdate = Database['public']['Tables']['visa_applications']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']