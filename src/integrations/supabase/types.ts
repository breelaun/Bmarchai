export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "App Editors": {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: number
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          font_family: string | null
          id: number
          image_url: string | null
          is_private: boolean | null
          language: string | null
          reading_time: number | null
          scheduled_for: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          font_family?: string | null
          id?: number
          image_url?: string | null
          is_private?: boolean | null
          language?: string | null
          reading_time?: number | null
          scheduled_for?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          font_family?: string | null
          id?: number
          image_url?: string | null
          is_private?: boolean | null
          language?: string | null
          reading_time?: number | null
          scheduled_for?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      communication_logs: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          type: string
          vendor_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          type: string
          vendor_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          type?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_logs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          company: string | null
          contact_type: string | null
          created_at: string | null
          emails: string[] | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          social_links: Json | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
          website: string | null
        }
        Insert: {
          company?: string | null
          contact_type?: string | null
          created_at?: string | null
          emails?: string[] | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          website?: string | null
        }
        Update: {
          company?: string | null
          contact_type?: string | null
          created_at?: string | null
          emails?: string[] | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_clients_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tasks: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_stocks: {
        Row: {
          company_name: string
          created_at: string
          id: string
          symbol: string
          user_id: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          symbol: string
          user_id?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          symbol?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorite_stocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          description: string
          id: string
          recurring: boolean | null
          timeframe: string
          type: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          description: string
          id?: string
          recurring?: boolean | null
          timeframe: string
          type: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          recurring?: boolean | null
          timeframe?: string
          type?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          inventory_count: number | null
          is_featured: boolean | null
          name: string
          price: number
          tags: string[] | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          inventory_count?: number | null
          is_featured?: boolean | null
          name: string
          price: number
          tags?: string[] | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          inventory_count?: number | null
          is_featured?: boolean | null
          name?: string
          price?: number
          tags?: string[] | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          date_of_birth: string
          default_banner_url: string | null
          email_notifications: boolean | null
          full_name: string | null
          gender: string | null
          id: string
          is_vendor: boolean | null
          phone_number: string | null
          sms_notifications: boolean | null
          two_factor_enabled: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string
          default_banner_url?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_vendor?: boolean | null
          phone_number?: string | null
          sms_notifications?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string
          default_banner_url?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_vendor?: boolean | null
          phone_number?: string | null
          sms_notifications?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      sales_transactions: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          id: string
          product_id: number | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: number | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: number | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_usage: {
        Row: {
          action: string
          created_at: string
          id: number
          metadata: Json | null
          tool_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: number
          metadata?: Json | null
          tool_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: number
          metadata?: Json | null
          tool_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          business_description: string | null
          business_name: string | null
          contact_email: string | null
          created_at: string
          customizations: Json | null
          id: string
          social_links: Json | null
          template_id: number | null
          updated_at: string
        }
        Insert: {
          business_description?: string | null
          business_name?: string | null
          contact_email?: string | null
          created_at?: string
          customizations?: Json | null
          id: string
          social_links?: Json | null
          template_id?: number | null
          updated_at?: string
        }
        Update: {
          business_description?: string | null
          business_name?: string | null
          contact_email?: string | null
          created_at?: string
          customizations?: Json | null
          id?: string
          social_links?: Json | null
          template_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_profiles_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "vendor_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_templates: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean | null
          layout_config: Json
          name: string
          style_config: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean | null
          layout_config?: Json
          name: string
          style_config?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean | null
          layout_config?: Json
          name?: string
          style_config?: Json
          updated_at?: string
        }
        Relationships: []
      }
      video_analytics: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          vendor_id: string | null
          video_id: string
          view_count: number | null
          watch_time_seconds: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          vendor_id?: string | null
          video_id: string
          view_count?: number | null
          watch_time_seconds?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
          video_id?: string
          view_count?: number | null
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_analytics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: {
          title: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
