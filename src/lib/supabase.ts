import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          contact_name: string;
          contact_email: string;
          contact_phone: string;
          student_count: number;
          status: "active" | "pending" | "inactive";
          last_visit: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["schools"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
      };
      volunteers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          skills: string[];
          availability: string;
          hours_logged: number;
          status: "active" | "inactive";
          join_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["volunteers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["volunteers"]["Insert"]>;
      };
      schedules: {
        Row: {
          id: string;
          school_id: string;
          school_name: string;
          date: string;
          time: string;
          volunteer_ids: string[];
          volunteer_names: string[];
          type: "campus-tour" | "workshop" | "mentoring" | "career-day";
          status: "scheduled" | "completed" | "cancelled";
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["schedules"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["schedules"]["Insert"]>;
      };
      partners: {
        Row: {
          id: string;
          name: string;
          type: "corporate" | "nonprofit" | "government" | "educational";
          contact_name: string;
          contact_email: string;
          phone: string;
          contribution: string;
          status: "active" | "prospective" | "inactive";
          since: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["partners"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["partners"]["Insert"]>;
      };
    };
  };
};