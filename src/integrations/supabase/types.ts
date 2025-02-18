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
      ad_analytics: {
        Row: {
          ad_id: string | null
          city: string | null
          clicks: number | null
          conversions: number | null
          country: string | null
          created_at: string
          date: string
          device_type: string | null
          id: string
          views: number | null
        }
        Insert: {
          ad_id?: string | null
          city?: string | null
          clicks?: number | null
          conversions?: number | null
          country?: string | null
          created_at?: string
          date: string
          device_type?: string | null
          id?: string
          views?: number | null
        }
        Update: {
          ad_id?: string | null
          city?: string | null
          clicks?: number | null
          conversions?: number | null
          country?: string | null
          created_at?: string
          date?: string
          device_type?: string | null
          id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_analytics_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_placements: {
        Row: {
          ad_id: string | null
          created_at: string
          id: string
          page_path: string
          position: string
        }
        Insert: {
          ad_id?: string | null
          created_at?: string
          id?: string
          page_path: string
          position: string
        }
        Update: {
          ad_id?: string | null
          created_at?: string
          id?: string
          page_path?: string
          position?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_placements_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_targeting: {
        Row: {
          ad_id: string | null
          age_max: number | null
          age_min: number | null
          center_location: unknown | null
          city: string[] | null
          country: string[] | null
          created_at: string
          gender: string[] | null
          id: string
          interests: string[] | null
          radius_miles: number | null
          state: string[] | null
        }
        Insert: {
          ad_id?: string | null
          age_max?: number | null
          age_min?: number | null
          center_location?: unknown | null
          city?: string[] | null
          country?: string[] | null
          created_at?: string
          gender?: string[] | null
          id?: string
          interests?: string[] | null
          radius_miles?: number | null
          state?: string[] | null
        }
        Update: {
          ad_id?: string | null
          age_max?: number | null
          age_min?: number | null
          center_location?: unknown | null
          city?: string[] | null
          country?: string[] | null
          created_at?: string
          gender?: string[] | null
          id?: string
          interests?: string[] | null
          radius_miles?: number | null
          state?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_targeting_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          ad_type: string
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          embed_code: string | null
          end_date: string
          file_urls: string[] | null
          id: string
          media_type: string | null
          media_url: string | null
          name: string
          start_date: string
          status: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ad_type: string
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          embed_code?: string | null
          end_date: string
          file_urls?: string[] | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          name: string
          start_date: string
          status?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ad_type?: string
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          embed_code?: string | null
          end_date?: string
          file_urls?: string[] | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          name?: string
          start_date?: string
          status?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      chat_channel_products: {
        Row: {
          added_at: string | null
          added_by: string | null
          channel_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          product_id: number | null
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          channel_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          product_id?: number | null
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          channel_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          product_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_channel_products_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_channel_products_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_channel_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_channels: {
        Row: {
          active_products: Json[] | null
          channel_type: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          owner_id: string
          stream_config: Json | null
          updated_at: string
        }
        Insert: {
          active_products?: Json[] | null
          channel_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          owner_id: string
          stream_config?: Json | null
          updated_at?: string
        }
        Update: {
          active_products?: Json[] | null
          channel_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          owner_id?: string
          stream_config?: Json | null
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
      chat_live_sessions: {
        Row: {
          channel_id: string | null
          created_at: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          session_type: string
          started_at: string | null
          status: string
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          session_type: string
          started_at?: string | null
          status?: string
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          session_type?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_live_sessions_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
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
      class_bookings: {
        Row: {
          attended: boolean | null
          booking_date: string
          cancelled_at: string | null
          class_id: string
          created_at: string
          id: string
          member_id: string
          status: string | null
        }
        Insert: {
          attended?: boolean | null
          booking_date: string
          cancelled_at?: string | null
          class_id: string
          created_at?: string
          id?: string
          member_id: string
          status?: string | null
        }
        Update: {
          attended?: boolean | null
          booking_date?: string
          cancelled_at?: string | null
          class_id?: string
          created_at?: string
          id?: string
          member_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "gym_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_bookings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
      client_activities: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          metadata: Json | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          metadata?: Json | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "client_activities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_communications: {
        Row: {
          client_id: string
          content: string | null
          created_at: string | null
          created_by: string | null
          date: string | null
          id: string
          subject: string | null
          type: Database["public"]["Enums"]["communication_type"]
        }
        Insert: {
          client_id: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          subject?: string | null
          type: Database["public"]["Enums"]["communication_type"]
        }
        Update: {
          client_id?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          subject?: string | null
          type?: Database["public"]["Enums"]["communication_type"]
        }
        Relationships: [
          {
            foreignKeyName: "client_communications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_communications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      contacts: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["contact_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["contact_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["contact_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_profiles_receiver_fk"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_profiles_requester_fk"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          expected_value: number | null
          id: string
          lead_source_id: string | null
          lead_stage: string | null
          lead_temperature: string | null
          name: string
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          probability: number | null
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
          expected_value?: number | null
          id?: string
          lead_source_id?: string | null
          lead_stage?: string | null
          lead_temperature?: string | null
          name: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          probability?: number | null
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
          expected_value?: number | null
          id?: string
          lead_source_id?: string | null
          lead_stage?: string | null
          lead_temperature?: string | null
          name?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          probability?: number | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_clients_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "lead_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_clients_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_task_dependencies: {
        Row: {
          created_at: string | null
          dependent_on_task_id: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          dependent_on_task_id: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          dependent_on_task_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_task_dependencies_dependent_on_task_id_fkey"
            columns: ["dependent_on_task_id"]
            isOneToOne: false
            referencedRelation: "crm_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "crm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tasks: {
        Row: {
          assigned_to: string | null
          category: string | null
          client_id: string | null
          completion_percentage: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_milestone: boolean | null
          priority: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          client_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_milestone?: boolean | null
          priority?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          client_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_milestone?: boolean | null
          priority?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      guest_passes: {
        Row: {
          created_at: string | null
          email: string | null
          guest_name: string
          id: string
          pass_type: string | null
          phone: string | null
          referred_by: string | null
          status: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          guest_name: string
          id?: string
          pass_type?: string | null
          phone?: string | null
          referred_by?: string | null
          status?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          guest_name?: string
          id?: string
          pass_type?: string | null
          phone?: string | null
          referred_by?: string | null
          status?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_passes_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_classes: {
        Row: {
          capacity: number
          class_type: Database["public"]["Enums"]["class_type"]
          created_at: string
          description: string | null
          duration: unknown
          id: string
          instructor_id: string | null
          name: string
          room: string | null
          schedule: Json
          updated_at: string
        }
        Insert: {
          capacity: number
          class_type: Database["public"]["Enums"]["class_type"]
          created_at?: string
          description?: string | null
          duration: unknown
          id?: string
          instructor_id?: string | null
          name: string
          room?: string | null
          schedule: Json
          updated_at?: string
        }
        Update: {
          capacity?: number
          class_type?: Database["public"]["Enums"]["class_type"]
          created_at?: string
          description?: string | null
          duration?: unknown
          id?: string
          instructor_id?: string | null
          name?: string
          room?: string | null
          schedule?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gym_classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_equipment: {
        Row: {
          created_at: string
          description: string | null
          id: string
          last_maintenance_date: string | null
          maintenance_history: Json[] | null
          name: string
          next_maintenance_date: string | null
          purchase_date: string | null
          status: Database["public"]["Enums"]["equipment_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          last_maintenance_date?: string | null
          maintenance_history?: Json[] | null
          name: string
          next_maintenance_date?: string | null
          purchase_date?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          last_maintenance_date?: string | null
          maintenance_history?: Json[] | null
          name?: string
          next_maintenance_date?: string | null
          purchase_date?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      gym_members: {
        Row: {
          created_at: string
          email: string | null
          emergency_contact: Json | null
          end_date: string | null
          full_name: string | null
          goals: string[] | null
          health_info: Json | null
          id: string
          measurements: Json | null
          membership_plan_id: string | null
          notes: string | null
          owner_id: string | null
          phone: string | null
          start_date: string
          status: Database["public"]["Enums"]["membership_status"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          end_date?: string | null
          full_name?: string | null
          goals?: string[] | null
          health_info?: Json | null
          id?: string
          measurements?: Json | null
          membership_plan_id?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["membership_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          end_date?: string | null
          full_name?: string | null
          goals?: string[] | null
          health_info?: Json | null
          id?: string
          measurements?: Json | null
          membership_plan_id?: string | null
          notes?: string | null
          owner_id?: string | null
          phone?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["membership_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gym_members_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gym_members_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_trainers: {
        Row: {
          certification_details: Json | null
          created_at: string | null
          email: string | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          owner_id: string | null
          phone: string | null
          specializations: string[] | null
          status: Database["public"]["Enums"]["trainer_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          certification_details?: Json | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          owner_id?: string | null
          phone?: string | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["trainer_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          certification_details?: Json | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          owner_id?: string | null
          phone?: string | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["trainer_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gym_trainers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scores: {
        Row: {
          client_id: string | null
          criteria: Json | null
          id: string
          last_updated: string
          score: number
        }
        Insert: {
          client_id?: string | null
          criteria?: Json | null
          id?: string
          last_updated?: string
          score?: number
        }
        Update: {
          client_id?: string | null
          criteria?: Json | null
          id?: string
          last_updated?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_scores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_check_ins: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          created_at: string
          id: string
          member_id: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          id?: string
          member_id: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string
          id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_check_ins_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_progress: {
        Row: {
          bmi: number | null
          body_fat_percentage: number | null
          created_at: string | null
          id: string
          measurement_date: string | null
          measurements: Json | null
          member_id: string | null
          muscle_mass: number | null
          notes: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          bmi?: number | null
          body_fat_percentage?: number | null
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          measurements?: Json | null
          member_id?: string | null
          muscle_mass?: number | null
          notes?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          bmi?: number | null
          body_fat_percentage?: number | null
          created_at?: string | null
          id?: string
          measurement_date?: string | null
          measurements?: Json | null
          member_id?: string | null
          muscle_mass?: number | null
          notes?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_progress_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          created_at: string
          description: string | null
          duration: unknown
          features: Json | null
          frequency: Database["public"]["Enums"]["payment_frequency"]
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: unknown
          features?: Json | null
          frequency: Database["public"]["Enums"]["payment_frequency"]
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: unknown
          features?: Json | null
          frequency?: Database["public"]["Enums"]["payment_frequency"]
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
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
          order_status: string | null
          payment_method: string
          payment_status: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
          user_profile_name: string | null
          vendor_id: string | null
          vendor_notes: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_status?: string | null
          payment_method: string
          payment_status?: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
          user_profile_name?: string | null
          vendor_id?: string | null
          vendor_notes?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_status?: string | null
          payment_method?: string
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          user_profile_name?: string | null
          vendor_id?: string | null
          vendor_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          user_name: string | null
          vendor_id: string
          vendor_profile_id: string | null
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
          user_name?: string | null
          vendor_id: string
          vendor_profile_id?: string | null
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
          user_name?: string | null
          vendor_id?: string
          vendor_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            referencedRelation: "completed_sessions"
            referencedColumns: ["id"]
          },
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
          can_share_screen: boolean | null
          created_at: string
          has_completed: boolean | null
          id: string
          payment_confirmed_at: string | null
          payment_confirmed_by: string | null
          payment_method:
            | Database["public"]["Enums"]["payment_method_type"]
            | null
          payment_notes: string | null
          payment_status: string | null
          rating: number | null
          screen_share_enabled: boolean | null
          session_id: string
          tip_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          can_share_screen?: boolean | null
          created_at?: string
          has_completed?: boolean | null
          id?: string
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          payment_method?:
            | Database["public"]["Enums"]["payment_method_type"]
            | null
          payment_notes?: string | null
          payment_status?: string | null
          rating?: number | null
          screen_share_enabled?: boolean | null
          session_id: string
          tip_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          can_share_screen?: boolean | null
          created_at?: string
          has_completed?: boolean | null
          id?: string
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          payment_method?:
            | Database["public"]["Enums"]["payment_method_type"]
            | null
          payment_notes?: string | null
          payment_status?: string | null
          rating?: number | null
          screen_share_enabled?: boolean | null
          session_id?: string
          tip_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_payment_confirmed_by_fkey"
            columns: ["payment_confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "completed_sessions"
            referencedColumns: ["id"]
          },
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
      session_product_showcases: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          product_id: number | null
          session_id: string | null
          showcased_at: string | null
          showcased_by: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          product_id?: number | null
          session_id?: string | null
          showcased_at?: string | null
          showcased_by?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          product_id?: number | null
          session_id?: string | null
          showcased_at?: string | null
          showcased_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_product_showcases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_product_showcases_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "completed_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_product_showcases_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_product_showcases_showcased_by_fkey"
            columns: ["showcased_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_recordings: {
        Row: {
          channel_id: string | null
          created_at: string | null
          created_by: string | null
          ended_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          metadata: Json | null
          recording_url: string | null
          session_id: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          voice_over: boolean | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          created_by?: string | null
          ended_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          recording_url?: string | null
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          voice_over?: boolean | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          created_by?: string | null
          ended_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          recording_url?: string | null
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          voice_over?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "session_recordings_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "chat_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "completed_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          autoplay_end: unknown | null
          autoplay_start: unknown | null
          camera_config: Json | null
          completed_at: string | null
          created_at: string
          description: string | null
          duration: unknown
          embed_url: string | null
          id: string
          is_reusable: boolean | null
          max_participants: number | null
          name: string
          price: number
          recording_id: string | null
          session_type: string | null
          start_time: string
          status: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          autoplay_end?: unknown | null
          autoplay_start?: unknown | null
          camera_config?: Json | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration: unknown
          embed_url?: string | null
          id?: string
          is_reusable?: boolean | null
          max_participants?: number | null
          name: string
          price: number
          recording_id?: string | null
          session_type?: string | null
          start_time: string
          status?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          autoplay_end?: unknown | null
          autoplay_start?: unknown | null
          camera_config?: Json | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration?: unknown
          embed_url?: string | null
          id?: string
          is_reusable?: boolean | null
          max_participants?: number | null
          name?: string
          price?: number
          recording_id?: string | null
          session_type?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "session_recordings"
            referencedColumns: ["id"]
          },
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
      team_calendar_events: {
        Row: {
          all_day: boolean | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          start_time: string
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          all_day?: boolean | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          start_time: string
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          all_day?: boolean | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          start_time?: string
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_calendar_events_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_games: {
        Row: {
          created_at: string | null
          game_date: string
          id: string
          is_home_game: boolean | null
          location: string | null
          notes: string | null
          opponent: string
          result: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_date: string
          id?: string
          is_home_game?: boolean | null
          location?: string | null
          notes?: string | null
          opponent: string
          result?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_date?: string
          id?: string
          is_home_game?: boolean | null
          location?: string | null
          notes?: string | null
          opponent?: string
          result?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_games_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          full_name: string
          id: string
          jersey_number: number | null
          joined_date: string | null
          position: string | null
          role: Database["public"]["Enums"]["team_role"]
          status: Database["public"]["Enums"]["player_status"] | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          jersey_number?: number | null
          joined_date?: string | null
          position?: string | null
          role: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["player_status"] | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          jersey_number?: number | null
          joined_date?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["team_role"]
          status?: Database["public"]["Enums"]["player_status"] | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          sport: Database["public"]["Enums"]["sport_type"]
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          sport: Database["public"]["Enums"]["sport_type"]
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          sport?: Database["public"]["Enums"]["sport_type"]
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      trainer_clients: {
        Row: {
          client_id: string
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          status: string | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_clients_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "gym_trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_sessions: {
        Row: {
          created_at: string | null
          duration: unknown | null
          id: string
          member_id: string | null
          notes: string | null
          session_date: string | null
          status: Database["public"]["Enums"]["session_status"] | null
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: unknown | null
          id?: string
          member_id?: string | null
          notes?: string | null
          session_date?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: unknown | null
          id?: string
          member_id?: string | null
          notes?: string | null
          session_date?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_sessions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "gym_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_sessions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "gym_trainers"
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
          business_hours: Json | null
          business_name: string | null
          contact_email: string | null
          country: string | null
          created_at: string
          current_sale: Json | null
          customizations: Json | null
          id: string
          locations: Json[] | null
          order_notifications: boolean | null
          social_links: Json | null
          template_id: number | null
          timezone: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          banner_data?: Json | null
          business_description?: string | null
          business_hours?: Json | null
          business_name?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          current_sale?: Json | null
          customizations?: Json | null
          id: string
          locations?: Json[] | null
          order_notifications?: boolean | null
          social_links?: Json | null
          template_id?: number | null
          timezone?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          banner_data?: Json | null
          business_description?: string | null
          business_hours?: Json | null
          business_name?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          current_sale?: Json | null
          customizations?: Json | null
          id?: string
          locations?: Json[] | null
          order_notifications?: boolean | null
          social_links?: Json | null
          template_id?: number | null
          timezone?: string | null
          updated_at?: string
          website_url?: string | null
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
      youtube_sources: {
        Row: {
          active: boolean | null
          category_id: string | null
          created_at: string | null
          id: string
          type: string | null
          value: string
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          type?: string | null
          value: string
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          type?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "youtube_sources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "arts_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      completed_sessions: {
        Row: {
          autoplay_end: unknown | null
          autoplay_start: unknown | null
          camera_config: Json | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          duration: unknown | null
          embed_url: string | null
          id: string | null
          is_reusable: boolean | null
          max_participants: number | null
          media_type: string | null
          media_url: string | null
          name: string | null
          price: number | null
          recording_id: string | null
          recording_url: string | null
          session_type: string | null
          start_time: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
          voice_over: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "session_recordings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      are_contacts: {
        Args: {
          user_a: string
          user_b: string
        }
        Returns: boolean
      }
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
      activity_type: "stage_change" | "communication" | "task" | "note"
      class_type: "group" | "personal" | "specialty"
      communication_type: "email" | "phone" | "meeting" | "note"
      contact_status: "pending" | "accepted" | "blocked"
      equipment_status: "available" | "in_use" | "maintenance" | "retired"
      membership_status: "active" | "expired" | "cancelled" | "frozen"
      payment_frequency: "monthly" | "quarterly" | "yearly" | "lifetime"
      payment_method_type: "cash" | "card" | "bank_transfer"
      payment_provider: "stripe" | "paypal" | "google_pay"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      player_status: "active" | "inactive" | "injured" | "suspended"
      product_category:
        | "Books"
        | "Clothing"
        | "Consultation"
        | "Ebook"
        | "Photo"
        | "Podcast"
        | "Session"
      session_format_type: "live" | "embed" | "product"
      session_payment_type: "free" | "paid"
      session_status: "scheduled" | "completed" | "cancelled" | "no_show"
      sport_type:
        | "football"
        | "basketball"
        | "baseball"
        | "soccer"
        | "volleyball"
        | "tennis"
        | "rugby"
        | "cricket"
      team_role:
        | "coach"
        | "player"
        | "assistant"
        | "medical"
        | "ball_kid"
        | "water_kid"
        | "media"
      trainer_status: "active" | "inactive" | "on_leave"
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
