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
      arts_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      arts_embeds: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          embed_url: string
          end_date: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          embed_url: string
          end_date?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          embed_url?: string
          end_date?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arts_embeds_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "arts_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arts_embeds_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: number | null
          quantity: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: number | null
          quantity?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: number | null
          quantity?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_channels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_channels_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_members: {
        Row: {
          channel_id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          channel_id: string | null
          content: string
          created_at: string
          id: string
          is_edited: boolean | null
          section_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          channel_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          section_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          channel_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          section_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "chat_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sections: {
        Row: {
          channel_id: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sections_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
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
      financial_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          id: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          id?: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          id?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price_at_time: number
          product_id: number | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_at_time: number
          product_id?: number | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_at_time?: number
          product_id?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_method: string
          payment_status: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method: string
          payment_status?: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: string
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          commission_amount: number
          created_at: string | null
          customer_id: string | null
          id: string
          metadata: Json | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_transaction_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
          vendor_id: string | null
          vendor_payout_amount: number
        }
        Insert: {
          amount: number
          commission_amount: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          vendor_id?: string | null
          vendor_payout_amount: number
        }
        Update: {
          amount?: number
          commission_amount?: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          vendor_id?: string | null
          vendor_payout_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_vendor_id_fkey"
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
          file_urls: string[] | null
          id: number
          image_url: string | null
          inventory_count: number | null
          is_featured: boolean | null
          name: string
          price: number
          start_datetime: string | null
          tags: string[] | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_urls?: string[] | null
          id?: number
          image_url?: string | null
          inventory_count?: number | null
          is_featured?: boolean | null
          name: string
          price: number
          start_datetime?: string | null
          tags?: string[] | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_urls?: string[] | null
          id?: number
          image_url?: string | null
          inventory_count?: number | null
          is_featured?: boolean | null
          name?: string
          price?: number
          start_datetime?: string | null
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
          admin: boolean | null
          avatar_url: string | null
          banner_media_type: string | null
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
          role: Database["public"]["Enums"]["user_role"]
          sms_notifications: boolean | null
          two_factor_enabled: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          admin?: boolean | null
          avatar_url?: string | null
          banner_media_type?: string | null
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
          role?: Database["public"]["Enums"]["user_role"]
          sms_notifications?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          admin?: boolean | null
          avatar_url?: string | null
          banner_media_type?: string | null
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
          role?: Database["public"]["Enums"]["user_role"]
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
      session_media: {
        Row: {
          created_at: string
          display_order: number
          id: string
          media_type: string
          media_url: string
          session_id: string
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          media_type: string
          media_url: string
          session_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          media_type?: string
          media_url?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_media_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          created_at: string
          has_completed: boolean | null
          id: string
          rating: number | null
          session_id: string
          tip_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          has_completed?: boolean | null
          id?: string
          rating?: number | null
          session_id: string
          tip_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          has_completed?: boolean | null
          id?: string
          rating?: number | null
          session_id?: string
          tip_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          autoplay_end: unknown | null
          autoplay_start: unknown | null
          created_at: string
          description: string | null
          duration: unknown
          embed_url: string | null
          id: string
          max_participants: number | null
          name: string
          price: number
          start_time: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          autoplay_end?: unknown | null
          autoplay_start?: unknown | null
          created_at?: string
          description?: string | null
          duration: unknown
          embed_url?: string | null
          id?: string
          max_participants?: number | null
          name: string
          price: number
          start_time: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          autoplay_end?: unknown | null
          autoplay_start?: unknown | null
          created_at?: string
          description?: string | null
          duration?: unknown
          embed_url?: string | null
          id?: string
          max_participants?: number | null
          name?: string
          price?: number
          start_time?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_favorites: {
        Row: {
          company_name: string
          created_at: string
          id: string
          symbol: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          symbol: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      time_options: {
        Row: {
          id: number
          label: string
          value: unknown
        }
        Insert: {
          id?: number
          label: string
          value: unknown
        }
        Update: {
          id?: number
          label?: string
          value?: unknown
        }
        Relationships: []
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
      vendor_payouts: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_payout_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_payout_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_payout_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payouts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          banner_data: Json | null
          business_description: string | null
          business_name: string | null
          contact_email: string | null
          country: string | null
          created_at: string
          customizations: Json | null
          id: string
          social_links: Json | null
          template_id: number | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          banner_data?: Json | null
          business_description?: string | null
          business_name?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          customizations?: Json | null
          id: string
          social_links?: Json | null
          template_id?: number | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          banner_data?: Json | null
          business_description?: string | null
          business_name?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          customizations?: Json | null
          id?: string
          social_links?: Json | null
          template_id?: number | null
          timezone?: string | null
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
      youtube_embeds: {
        Row: {
          active: boolean | null
          category_id: string | null
          created_at: string
          created_by: string | null
          embed_id: string
          embed_type: string
          end_date: string | null
          id: string
          title: string
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          embed_id: string
          embed_type: string
          end_date?: string | null
          id?: string
          title: string
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          embed_id?: string
          embed_type?: string
          end_date?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "youtube_embeds_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "arts_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youtube_embeds_created_by_fkey"
            columns: ["created_by"]
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
      delete_expired_embeds: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_slug: {
        Args: {
          title: string
        }
        Returns: string
      }
    }
    Enums: {
      payment_provider: "stripe" | "paypal" | "google_pay"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      product_category:
        | "Books"
        | "Clothing"
        | "Consultation"
        | "Ebook"
        | "Photo"
        | "Podcast"
        | "Session"
      user_role: "user" | "admin"
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
