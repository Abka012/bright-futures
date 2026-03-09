import { schools, volunteers, schedules, partners } from "@/lib/data";
import { StatCard } from "@/components/StatCard";
import { School, Users, Calendar, Handshake, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ReportsPage = () => {
  const visitsByType = [
    { name: "Campus Tour", value: schedules.filter((s) => s.type === "campus-tour").length },
    { name: "Workshop", value: schedules.filter((s) => s.type === "workshop").length },
    { name: "Mentoring", value: schedules.filter((s) => s.type === "mentoring").length },
    { name: "Career Day", value: schedules.filter((s) => s.type === "career-day").length },
  ];

  const volunteerHours = volunteers
    .filter((v) => v.status === "active")
    .sort((a, b) => b.hoursLogged - a.hoursLogged)
    .map((v) => ({ name: v.name.split(" ")[0], hours: v.hoursLogged }));

  const schoolsByStatus = [
    { name: "Active", value: schools.filter((s) => s.status === "active").length },
    { name: "Pending", value: schools.filter((s) => s.status === "pending").length },
    { name: "Inactive", value: schools.filter((s) => s.status === "inactive").length },
  ];

  const COLORS = ["hsl(38, 92%, 50%)", "hsl(220, 30%, 60%)", "hsl(0, 72%, 51%)"];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Analytics and insights for informed decision-making.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Schools" value={schools.length} icon={School} />
        <StatCard title="Active Volunteers" value={volunteers.filter((v) => v.status === "active").length} icon={Users} />
        <StatCard title="Total Visits" value={schedules.length} icon={Calendar} />
        <StatCard title="Active Partners" value={partners.filter((p) => p.status === "active").length} icon={Handshake} />
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
              <span className="font-bold font-display">{volunteers.reduce((s, v) => s + v.hoursLogged, 0)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2"><School className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Students Reached</span></div>
              <span className="font-bold font-display">{schools.reduce((s, sc) => s + sc.studentCount, 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Completion Rate</span></div>
              <span className="font-bold font-display">{Math.round((schedules.filter(s => s.status === "completed").length / schedules.length) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Avg Hours per Volunteer</span></div>
              <span className="font-bold font-display">{Math.round(volunteers.reduce((s, v) => s + v.hoursLogged, 0) / volunteers.length)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsPage;
