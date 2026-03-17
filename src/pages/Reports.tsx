import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { demoSchools, demoVolunteers, demoSchedules, demoPartners } from "@/lib/demoData";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";
import { School, Users, Calendar, Handshake, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReportsPage = () => {
  const { isDemoMode } = useAuth();
  const [dateRange, setDateRange] = useState("30");

  const getDateFilter = () => {
    const days = parseInt(dateRange);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  };

  const { data: supabaseSchools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      try { const { data } = await supabase.from("schools").select("*"); return data || []; } catch { return []; }
    },
    enabled: !isDemoMode,
  });

  const { data: supabaseVolunteers = [] } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      try { const { data } = await supabase.from("volunteers").select("*"); return data || []; } catch { return []; }
    },
    enabled: !isDemoMode,
  });

  const { data: supabaseSchedules = [] } = useQuery({
    queryKey: ["schedules", dateRange],
    queryFn: async () => {
      try {
        const filterDate = getDateFilter();
        const { data } = await supabase.from("schedules").select("*").gte("date", filterDate).order("date");
        return data || [];
      } catch { return []; }
    },
    enabled: !isDemoMode,
  });

  const { data: supabasePartners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      try { const { data } = await supabase.from("partners").select("*"); return data || []; } catch { return []; }
    },
    enabled: !isDemoMode,
  });

  const schools = isDemoMode ? demoSchools : supabaseSchools;
  const volunteers = isDemoMode ? demoVolunteers : supabaseVolunteers;
  const partners = isDemoMode ? demoPartners : supabasePartners;
  
  const filteredSchedules = isDemoMode 
    ? demoSchedules.filter((s) => s.date >= getDateFilter())
    : supabaseSchedules;
  const schedules = filteredSchedules;

  const visitsByType = [
    { name: "Campus Tour", value: schedules.filter((s: any) => s.type === "campus-tour").length },
    { name: "Workshop", value: schedules.filter((s: any) => s.type === "workshop").length },
    { name: "Mentoring", value: schedules.filter((s: any) => s.type === "mentoring").length },
    { name: "Career Day", value: schedules.filter((s: any) => s.type === "career-day").length },
  ];

  const volunteerHours = volunteers.filter((v: any) => v.status === "active").sort((a: any, b: any) => b.hours_logged - a.hours_logged).map((v: any) => ({ name: v.name.split(" ")[0], hours: v.hours_logged }));

  const schoolsByStatus = [
    { name: "Active", value: schools.filter((s: any) => s.status === "active").length },
    { name: "Pending", value: schools.filter((s: any) => s.status === "pending").length },
    { name: "Inactive", value: schools.filter((s: any) => s.status === "inactive").length },
  ];

  const COLORS = ["hsl(38, 92%, 50%)", "hsl(220, 30%, 60%)", "hsl(0, 72%, 51%)"];

  const totalHours = volunteers.reduce((s: number, v: any) => s + (v.hours_logged || 0), 0);
  const totalStudents = schools.reduce((s: number, sc: any) => s + (sc.student_count || 0), 0);
  const completedVisits = schedules.filter((s: any) => s.status === "completed").length;
  const completionRate = schedules.length > 0 ? Math.round((completedVisits / schedules.length) * 100) : 0;
  const avgHours = volunteers.length > 0 ? Math.round(totalHours / volunteers.length) : 0;

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Analytics and insights for informed decision-making.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show data for:</span>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Schools" value={schools.length} icon={School} />
        <StatCard title="Active Volunteers" value={volunteers.filter((v: any) => v.status === "active").length} icon={Users} />
        <StatCard title="Total Visits" value={schedules.length} icon={Calendar} />
        <StatCard title="Active Partners" value={partners.filter((p: any) => p.status === "active").length} icon={Handshake} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Volunteer Hours</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volunteerHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="hours" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Visits by Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={visitsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(220, 30%, 40%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Schools by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={schoolsByStatus} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {schoolsByStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Key Metrics Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Total Volunteer Hours</span></div>
              <span className="font-bold font-display">{totalHours}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2"><School className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Students Reached</span></div>
              <span className="font-bold font-display">{totalStudents.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Completion Rate</span></div>
              <span className="font-bold font-display">{completionRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Avg Hours per Volunteer</span></div>
              <span className="font-bold font-display">{avgHours}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;