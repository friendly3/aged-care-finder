export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      facilities: {
        Row: {
          id: string
          name: string
          provider: string
          type: string
          address: string
          suburb: string
          state: string
          postcode: string
          phone: string
          star_rating: number
          quality_measures: Json
          services: string[]
          total_beds: number
          available_beds: number
          daily_price: Json
          refundable_deposit: Json
          description: string
          last_audit_date: string
          compliance_status: string
          latitude: number
          longitude: number
          funding: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          provider: string
          type: string
          address: string
          suburb: string
          state: string
          postcode: string
          phone: string
          star_rating: number
          quality_measures?: Json
          services?: string[]
          total_beds: number
          available_beds: number
          daily_price?: Json
          refundable_deposit?: Json
          description: string
          last_audit_date: string
          compliance_status: string
          latitude: number
          longitude: number
          funding?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          // ... other fields
        }
      }
      incidents: {
        Row: {
          id: string
          reference_no: string
          date_received: string
          time: string
          type: string
          driver: string
          team_leader: string
          response: string
          reference_text: string
          action: string
          status: string
          date_response?: string
          time_response?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          reference_no: string
          date_received: string
          time: string
          type: string
          driver: string
          team_leader: string
          response: string
          reference_text: string
          action: string
          status?: string
          date_response?: string
          time_response?: string
        }
        Update: {
          id?: string
          reference_no?: string
          date_received?: string
          time?: string
          type?: string
          driver?: string
          team_leader?: string
          response?: string
          reference_text?: string
          action?: string
          status?: string
          date_response?: string
          time_response?: string
          updated_at?: string
        }
      }
    }
  }
}
