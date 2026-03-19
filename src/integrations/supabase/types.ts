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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          date: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed: boolean | null
          due_date: string | null
          id: string
          roadmap_id: string
          title: string
        }
        Insert: {
          completed?: boolean | null
          due_date?: string | null
          id?: string
          roadmap_id: string
          title: string
        }
        Update: {
          completed?: boolean | null
          due_date?: string | null
          id?: string
          roadmap_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          mood_score: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          mood_score: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          mood_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          level: number | null
          notifications_enabled: boolean | null
          plan: string | null
          theme_preference: string | null
          total_xp: number | null
          vacation_end: string | null
          vacation_start: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          level?: number | null
          notifications_enabled?: boolean | null
          plan?: string | null
          theme_preference?: string | null
          total_xp?: number | null
          vacation_end?: string | null
          vacation_start?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          level?: number | null
          notifications_enabled?: boolean | null
          plan?: string | null
          theme_preference?: string | null
          total_xp?: number | null
          vacation_end?: string | null
          vacation_start?: string | null
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          progress_percent: number | null
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          progress_percent?: number | null
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          progress_percent?: number | null
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_config: {
        Row: {
          gaming_hours: number | null
          id: string
          meal_hours: number | null
          other_hours: number | null
          sleep_hours: number | null
          user_id: string
        }
        Insert: {
          gaming_hours?: number | null
          id?: string
          meal_hours?: number | null
          other_hours?: number | null
          sleep_hours?: number | null
          user_id: string
        }
        Update: {
          gaming_hours?: number | null
          id?: string
          meal_hours?: number | null
          other_hours?: number | null
          sleep_hours?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_logs: {
        Row: {
          date: string | null
          id: string
          status: string
          task_id: string
          user_id: string
        }
        Insert: {
          date?: string | null
          id?: string
          status: string
          task_id: string
          user_id: string
        }
        Update: {
          date?: string | null
          id?: string
          status?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          duration_min: number | null
          frequency_config: Json | null
          frequency_type: string | null
          id: string
          name: string
          reminder_time: string | null
          sort_order: number | null
          start_date: string | null
          total_days: number | null
          type: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          duration_min?: number | null
          frequency_config?: Json | null
          frequency_type?: string | null
          id?: string
          name: string
          reminder_time?: string | null
          sort_order?: number | null
          start_date?: string | null
          total_days?: number | null
          type?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          duration_min?: number | null
          frequency_config?: Json | null
          frequency_type?: string | null
          id?: string
          name?: string
          reminder_time?: string | null
          sort_order?: number | null
          start_date?: string | null
          total_days?: number | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          notifications_enabled: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
          vacation_end: string | null
          vacation_start: string | null
        }
        Insert: {
          created_at?: string | null
          notifications_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
          vacation_end?: string | null
          vacation_start?: string | null
        }
        Update: {
          created_at?: string | null
          notifications_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
          vacation_end?: string | null
          vacation_start?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_roadmap: { Args: { _roadmap_id: string }; Returns: boolean }
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
