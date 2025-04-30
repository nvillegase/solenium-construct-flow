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
      activities: {
        Row: {
          contractor_id: string
          created_at: string | null
          date: string
          estimated_quantity: number
          executed_quantity: number
          id: string
          name: string
          notes: string | null
          progress: number
          project_id: string
          project_work_quantity_id: string
          unit: string
        }
        Insert: {
          contractor_id: string
          created_at?: string | null
          date: string
          estimated_quantity: number
          executed_quantity?: number
          id?: string
          name: string
          notes?: string | null
          progress?: number
          project_id: string
          project_work_quantity_id: string
          unit: string
        }
        Update: {
          contractor_id?: string
          created_at?: string | null
          date?: string
          estimated_quantity?: number
          executed_quantity?: number
          id?: string
          name?: string
          notes?: string | null
          progress?: number
          project_id?: string
          project_work_quantity_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_project_work_quantity_id_fkey"
            columns: ["project_work_quantity_id"]
            isOneToOne: false
            referencedRelation: "project_work_quantities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_materials: {
        Row: {
          activity_id: string
          created_at: string | null
          project_material_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          project_material_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          project_material_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_materials_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_materials_project_material_id_fkey"
            columns: ["project_material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      daily_executions: {
        Row: {
          activity_id: string
          created_at: string | null
          date: string
          executed_quantity: number
          id: string
          issue_category: Database["public"]["Enums"]["issue_category"] | null
          issue_other_description: string | null
          notes: string | null
          photos: string[] | null
          project_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          date: string
          executed_quantity: number
          id?: string
          issue_category?: Database["public"]["Enums"]["issue_category"] | null
          issue_other_description?: string | null
          notes?: string | null
          photos?: string[] | null
          project_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          date?: string
          executed_quantity?: number
          id?: string
          issue_category?: Database["public"]["Enums"]["issue_category"] | null
          issue_other_description?: string | null
          notes?: string | null
          photos?: string[] | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_executions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_executions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_projection_activities: {
        Row: {
          activity_id: string
          contractor_id: string
          created_at: string | null
          daily_projection_id: string
          id: string
          quantity: number
          unit: string
        }
        Insert: {
          activity_id: string
          contractor_id: string
          created_at?: string | null
          daily_projection_id: string
          id?: string
          quantity: number
          unit: string
        }
        Update: {
          activity_id?: string
          contractor_id?: string
          created_at?: string | null
          daily_projection_id?: string
          id?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_projection_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_projection_activities_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_projection_activities_daily_projection_id_fkey"
            columns: ["daily_projection_id"]
            isOneToOne: false
            referencedRelation: "daily_projections"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_projections: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_execution_complete: boolean
          project_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_execution_complete?: boolean
          project_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_execution_complete?: boolean
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_projections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_catalog: {
        Row: {
          created_at: string | null
          id: string
          name: string
          unit: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          unit: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          unit?: string
        }
        Relationships: []
      }
      material_deliveries: {
        Row: {
          created_at: string
          date: string
          id: string
          project_id: string
          project_material_id: string
          quantity: number
          received_by: string | null
          received_by_profile: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          project_id: string
          project_material_id: string
          quantity: number
          received_by?: string | null
          received_by_profile?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          project_id?: string
          project_material_id?: string
          quantity?: number
          received_by?: string | null
          received_by_profile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_deliveries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_deliveries_project_material_id_fkey"
            columns: ["project_material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_deliveries_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_deliveries_received_by_profile_fkey"
            columns: ["received_by_profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      material_receptions: {
        Row: {
          created_at: string | null
          date: string
          id: string
          observation: string | null
          order_id: string
          photos: string[] | null
          project_id: string
          project_material_id: string
          quantity: number
          status: Database["public"]["Enums"]["material_reception_status"]
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          observation?: string | null
          order_id: string
          photos?: string[] | null
          project_id: string
          project_material_id: string
          quantity: number
          status: Database["public"]["Enums"]["material_reception_status"]
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          observation?: string | null
          order_id?: string
          photos?: string[] | null
          project_id?: string
          project_material_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["material_reception_status"]
        }
        Relationships: [
          {
            foreignKeyName: "material_receptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_receptions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_receptions_project_material_id_fkey"
            columns: ["project_material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          role: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      project_materials: {
        Row: {
          created_at: string | null
          estimated_quantity: number
          id: string
          material_id: string
          project_id: string
          received_quantity: number
          used_quantity: number
        }
        Insert: {
          created_at?: string | null
          estimated_quantity?: number
          id?: string
          material_id: string
          project_id: string
          received_quantity?: number
          used_quantity?: number
        }
        Update: {
          created_at?: string | null
          estimated_quantity?: number
          id?: string
          material_id?: string
          project_id?: string
          received_quantity?: number
          used_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "material_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_work_quantities: {
        Row: {
          created_at: string | null
          expected_execution_date: string | null
          id: string
          project_id: string
          quantity: number
          work_quantity_id: string
        }
        Insert: {
          created_at?: string | null
          expected_execution_date?: string | null
          id?: string
          project_id: string
          quantity: number
          work_quantity_id: string
        }
        Update: {
          created_at?: string | null
          expected_execution_date?: string | null
          id?: string
          project_id?: string
          quantity?: number
          work_quantity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_work_quantities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_work_quantities_work_quantity_id_fkey"
            columns: ["work_quantity_id"]
            isOneToOne: false
            referencedRelation: "work_quantity_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          expected_end_date: string
          id: string
          location: string
          name: string
          progress: number
          projected_progress: number
          start_date: string
          status: Database["public"]["Enums"]["project_status"]
        }
        Insert: {
          created_at?: string | null
          expected_end_date: string
          id?: string
          location: string
          name: string
          progress?: number
          projected_progress?: number
          start_date: string
          status?: Database["public"]["Enums"]["project_status"]
        }
        Update: {
          created_at?: string | null
          expected_end_date?: string
          id?: string
          location?: string
          name?: string
          progress?: number
          projected_progress?: number
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"]
        }
        Relationships: []
      }
      purchase_order_materials: {
        Row: {
          created_at: string | null
          id: string
          project_material_id: string
          purchase_order_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_material_id: string
          purchase_order_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          project_material_id?: string
          purchase_order_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_materials_project_material_id_fkey"
            columns: ["project_material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_materials_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery_date: string | null
          created_at: string | null
          estimated_delivery_date: string
          id: string
          status: Database["public"]["Enums"]["purchase_order_status"]
          supplier: string
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string | null
          estimated_delivery_date: string
          id?: string
          status?: Database["public"]["Enums"]["purchase_order_status"]
          supplier: string
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string | null
          estimated_delivery_date?: string
          id?: string
          status?: Database["public"]["Enums"]["purchase_order_status"]
          supplier?: string
        }
        Relationships: []
      }
      user_projects: {
        Row: {
          created_at: string | null
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_quantity_catalog: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          unit: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          unit: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          unit?: string
        }
        Relationships: []
      }
      work_quantity_materials: {
        Row: {
          created_at: string | null
          project_material_id: string
          project_work_quantity_id: string
          quantity: number | null
        }
        Insert: {
          created_at?: string | null
          project_material_id: string
          project_work_quantity_id: string
          quantity?: number | null
        }
        Update: {
          created_at?: string | null
          project_material_id?: string
          project_work_quantity_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_quantity_materials_project_material_id_fkey"
            columns: ["project_material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_quantity_materials_project_work_quantity_id_fkey"
            columns: ["project_work_quantity_id"]
            isOneToOne: false
            referencedRelation: "project_work_quantities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_construction: {
        Args: { user_id: string }
        Returns: boolean
      }
      can_manage_work_quantity_materials: {
        Args: { user_id: string }
        Returns: boolean
      }
      can_read_contractors: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      issue_category:
        | "Lluvia moderada"
        | "Tormenta"
        | "Falta de suministro"
        | "Vandalismo"
        | "Delincuencia organizada"
        | "Paros o manifestaciones en las vías"
        | "Falta de especificaciones técnicas en los diseños"
        | "RTB incompleto"
        | "Daño de maquinaria o herramienta"
        | "Sin novedad"
        | "Programación hincadora"
        | "Otros"
      material_reception_status: "Bueno" | "Regular" | "Defectuoso"
      project_status:
        | "Planificación"
        | "En Ejecución"
        | "Pausado"
        | "Completado"
        | "Cancelado"
      purchase_order_status:
        | "Pendiente"
        | "En Tránsito"
        | "Recibido Parcial"
        | "Recibido Total"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      issue_category: [
        "Lluvia moderada",
        "Tormenta",
        "Falta de suministro",
        "Vandalismo",
        "Delincuencia organizada",
        "Paros o manifestaciones en las vías",
        "Falta de especificaciones técnicas en los diseños",
        "RTB incompleto",
        "Daño de maquinaria o herramienta",
        "Sin novedad",
        "Programación hincadora",
        "Otros",
      ],
      material_reception_status: ["Bueno", "Regular", "Defectuoso"],
      project_status: [
        "Planificación",
        "En Ejecución",
        "Pausado",
        "Completado",
        "Cancelado",
      ],
      purchase_order_status: [
        "Pendiente",
        "En Tránsito",
        "Recibido Parcial",
        "Recibido Total",
      ],
    },
  },
} as const
