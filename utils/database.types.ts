export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      achivements: {
        Row: {
          desc: string | null;
          id: number;
          image: string | null;
          link: string | null;
          name: string | null;
        };
        Insert: {
          desc?: string | null;
          id?: number;
          image?: string | null;
          link?: string | null;
          name?: string | null;
        };
        Update: {
          desc?: string | null;
          id?: number;
          image?: string | null;
          link?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      guestbook: {
        Row: {
          created_at: string | null;
          id: string;
          message: string | null;
          user_id: string | null;
          username: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message?: string | null;
          user_id?: string | null;
          username?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string | null;
          user_id?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          Description: string | null;
          id: number;
          Image: string | null;
          Title: string | null;
          Url: string | null;
        };
        Insert: {
          Description?: string | null;
          id?: number;
          Image?: string | null;
          Title?: string | null;
          Url?: string | null;
        };
        Update: {
          Description?: string | null;
          id?: number;
          Image?: string | null;
          Title?: string | null;
          Url?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          category: string | null;
          desc: string | null;
          github: string | null;
          id: number;
          img: string | null;
          name: string | null;
          tech: string[] | null;
          web: string | null;
        };
        Insert: {
          category?: string | null;
          desc?: string | null;
          github?: string | null;
          id?: number;
          img?: string | null;
          name?: string | null;
          tech?: string[] | null;
          web?: string | null;
        };
        Update: {
          category?: string | null;
          desc?: string | null;
          github?: string | null;
          id?: number;
          img?: string | null;
          name?: string | null;
          tech?: string[] | null;
          web?: string | null;
        };
        Relationships: [];
      };
      work: {
        Row: {
          Company_name: string | null;
          Desc: string | null;
          endYear: string | null;
          id: number;
          position: number | null;
          startYear: string | null;
        };
        Insert: {
          Company_name?: string | null;
          Desc?: string | null;
          endYear?: string | null;
          id: number;
          position?: number | null;
          startYear?: string | null;
        };
        Update: {
          Company_name?: string | null;
          Desc?: string | null;
          endYear?: string | null;
          id?: number;
          position?: number | null;
          startYear?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
