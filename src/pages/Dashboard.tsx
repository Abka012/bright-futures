import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  School,
  Users,
  Calendar,
  Handshake,
  TrendingUp,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { demoSchools, demoVolunteers, demoSchedules, demoPartners } from "@/lib/demoData";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
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
      try {
        const { data } = await supabase.from("schools").select("*");
        return data || [];
      } catch { return []; }
    },
    enabled: !isDemoMode,
  });

  const { data: supabaseVolunteers = [] } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("volunteers").select("*");
        return data || [];
      } catch { return []; }
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
      try {
        const { data } = await supabase.from("partners").select("*");
        return data || [];
      } catch { return []; }
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

  const activeSchools = schools.filter((s: any) => s.status === "active").length;
  const activeVolunteers = volunteers.filter((v: any) => v.status === "active").length;
  const upcomingVisits = schedules.filter((s: any) => s.status === "scheduled").length;
  const activePartners = partners.filter((p: any) => p.status === "active").length;

  const completedVisits = schedules.filter((s: any) => s.status === "completed").length;
  const totalVisits = schedules.length;
  const completionRate = totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0;

  const totalVolunteerHours = volunteers.reduce((sum: number, v: any) => sum + (v.hours_logged || 0), 0);
  const activeVolunteersList = volunteers.filter((v: any) => v.status === "active");
  const avgHoursPerVolunteer = activeVolunteersList.length > 0 ? Math.round(totalVolunteerHours / activeVolunteersList.length) : 0;

  const upcoming = schedules
    .filter((s: any) => s.status === "scheduled")
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentSchools = schools.slice(0, 4);

  const typeLabel: Record<string, string> = {
    "campus-tour": "Campus Tour",
    workshop: "Workshop",
    mentoring: "Mentoring",
    "career-day": "Career Day",
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back. Here's your overview for today.
          </p>
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
        <StatCard title="Active Schools" value={activeSchools} icon={School} />
        <StatCard title="Volunteers" value={activeVolunteers} icon={Users} />
        <StatCard title="Upcoming Visits" value={upcomingVisits} icon={Calendar} />
        <StatCard title="Partners" value={activePartners} icon={Handshake} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Volunteer Hours</span>
          </div>
          <p className="text-4xl font-bold font-display">{totalVolunteerHours}</p>
          <p className="text-sm text-muted-foreground mt-1">Across all volunteers</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Completed Visits</span>
          </div>
          <p className="text-4xl font-bold font-display">{completedVisits}</p>
          <p className="text-sm text-muted-foreground mt-1">In selected period</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
          </div>
          <p className="text-4xl font-bold font-display">{completionRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">{totalVisits} total visits</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Avg Hours per Volunteer</span>
          </div>
          <p className="text-4xl font-bold font-display">{avgHoursPerVolunteer}</p>
          <p className="text-sm text-muted-foreground mt-1">Hours per active volunteer</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Upcoming Visits</h2>
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming visits</p>
            ) : (
              upcoming.map((visit: any) => (
                <div key={visit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{visit.school_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {visit.date} at {visit.time} · {visit.volunteer_names?.join(", ")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{typeLabel[visit.type]}</Badge>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Recent Schools</h2>
          <div className="space-y-3">
            {recentSchools.length === 0 ? (
              <p className="text-sm text-muted-foreground">No schools yet</p>
            ) : (
              recentSchools.map((school: any) => (
                <div key={school.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{school.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {school.city}, {school.state} · {school.student_count} students
                    </p>
                  </div>
                  <Badge variant={school.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{school.status}</Badge>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;