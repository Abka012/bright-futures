import { School, Users, Calendar, Handshake, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { schools, volunteers, schedules, partners } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const Dashboard = () => {
  const activeSchools = schools.filter((s) => s.status === "active").length;
  const activeVolunteers = volunteers.filter((v) => v.status === "active").length;
  const upcomingVisits = schedules.filter((s) => s.status === "scheduled").length;
  const activePartners = partners.filter((p) => p.status === "active").length;
  const totalHours = volunteers.reduce((sum, v) => sum + v.hoursLogged, 0);

  const upcoming = schedules
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date))
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
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back. Here's your overview for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Active Schools" value={activeSchools} icon={School} trend={{ value: "2 this month", positive: true }} />
        <StatCard title="Volunteers" value={activeVolunteers} icon={Users} trend={{ value: "12% increase", positive: true }} />
        <StatCard title="Upcoming Visits" value={upcomingVisits} icon={Calendar} />
        <StatCard title="Partners" value={activePartners} icon={Handshake} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Volunteer Hours</span>
          </div>
          <p className="text-4xl font-bold font-display">{totalHours}</p>
          <p className="text-sm text-muted-foreground mt-1">Across all volunteers</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Completed Visits</span>
          </div>
          <p className="text-4xl font-bold font-display">{schedules.filter(s => s.status === "completed").length}</p>
          <p className="text-sm text-muted-foreground mt-1">This quarter</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <School className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Students Reached</span>
          </div>
          <p className="text-4xl font-bold font-display">{schools.reduce((sum, s) => sum + s.studentCount, 0).toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Across active schools</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Upcoming Visits</h2>
          <div className="space-y-3">
            {upcoming.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{visit.schoolName}</p>
                  <p className="text-xs text-muted-foreground">{visit.date} at {visit.time} · {visit.volunteerNames.join(", ")}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{typeLabel[visit.type]}</Badge>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h2 className="text-lg font-semibold font-display mb-4">Recent Schools</h2>
          <div className="space-y-3">
            {recentSchools.map((school) => (
              <div key={school.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.city}, {school.state} · {school.studentCount} students</p>
                </div>
                <Badge variant={school.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{school.status}</Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
