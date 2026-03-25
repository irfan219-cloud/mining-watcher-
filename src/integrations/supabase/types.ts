export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          detection_result_id: string | null
          email_sent: boolean | null
          id: string
          is_read: boolean | null
          location_description: string | null
          message: string
          mining_area_id: string
          severity: string
          sms_sent: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          alert_type?: string
          created_at?: string | null
          detection_result_id?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          location_description?: string | null
          message: string
          mining_area_id: string
          severity?: string
          sms_sent?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          detection_result_id?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          location_description?: string | null
          message?: string
          mining_area_id?: string
          severity?: string
          sms_sent?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_detection_result_id_fkey"
            columns: ["detection_result_id"]
            isOneToOne: false
            referencedRelation: "detection_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_mining_area_id_fkey"
            columns: ["mining_area_id"]
            isOneToOne: false
            referencedRelation: "mining_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      approved_boundaries: {
        Row: {
          boundary_geojson: Json
          created_at: string | null
          id: string
          license_number: string | null
          mining_area_id: string
          name: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          boundary_geojson: Json
          created_at?: string | null
          id?: string
          license_number?: string | null
          mining_area_id: string
          name: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          boundary_geojson?: Json
          created_at?: string | null
          id?: string
          license_number?: string | null
          mining_area_id?: string
          name?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approved_boundaries_mining_area_id_fkey"
            columns: ["mining_area_id"]
            isOneToOne: false
            referencedRelation: "mining_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      detection_results: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          detected_boundaries: Json
          detection_date: string
          id: string
          illegal_area: number | null
          illegal_zones: Json | null
          legal_area: number | null
          mining_area_id: string
          processing_status: string | null
          total_detected_area: number | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          detected_boundaries: Json
          detection_date: string
          id?: string
          illegal_area?: number | null
          illegal_zones?: Json | null
          legal_area?: number | null
          mining_area_id: string
          processing_status?: string | null
          total_detected_area?: number | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          detected_boundaries?: Json
          detection_date?: string
          id?: string
          illegal_area?: number | null
          illegal_zones?: Json | null
          legal_area?: number | null
          mining_area_id?: string
          processing_status?: string | null
          total_detected_area?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detection_results_mining_area_id_fkey"
            columns: ["mining_area_id"]
            isOneToOne: false
            referencedRelation: "mining_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      mining_areas: {
        Row: {
          center_lat: number | null
          center_lng: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          location_name: string | null
          name: string
          updated_at: string | null
          user_id: string
          zoom_level: number | null
        }
        Insert: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_name?: string | null
          name: string
          updated_at?: string | null
          user_id: string
          zoom_level?: number | null
        }
        Update: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_name?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
          zoom_level?: number | null
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_step: string | null
          error_message: string | null
          id: string
          mining_area_id: string
          progress: number | null
          started_at: string | null
          status: string | null
          steps_completed: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          error_message?: string | null
          id?: string
          mining_area_id: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
          steps_completed?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          error_message?: string | null
          id?: string
          mining_area_id?: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
          steps_completed?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_mining_area_id_fkey"
            columns: ["mining_area_id"]
            isOneToOne: false
            referencedRelation: "mining_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          organization: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          organization?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          organization?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
