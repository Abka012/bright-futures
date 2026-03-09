import { useState } from "react";
import { schedules as initialSchedules, schools, volunteers, TourSchedule } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const typeLabel: Record<string, string> = {
  "campus-tour": "Campus Tour", workshop: "Workshop", mentoring: "Mentoring", "career-day": "Career Day",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  scheduled: "default", completed: "secondary", cancelled: "destructive",
};

const SchedulesPage = () => {
  const [list, setList] = useState<TourSchedule[]>(initialSchedules);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ schoolId: "", date: "", time: "", type: "campus-tour" as TourSchedule["type"], notes: "", volunteerIds: [] as string[] });

  const filtered = list.filter((s) =>
    s.schoolName.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.date.localeCompare(b.date));

  const handleAdd = () => {
    if (!form.schoolId || !form.date) { toast.error("School and date are required"); return; }
    const school = schools.find((s) => s.id === form.schoolId);
    const vols = volunteers.filter((v) => form.volunteerIds.includes(v.id));
    const newSchedule: TourSchedule = {
      id: `t${Date.now()}`,
      schoolId: form.schoolId,
      schoolName: school?.name || "",
      date: form.date,
      time: form.time,
      volunteerIds: form.volunteerIds,
      volunteerNames: vols.map((v) => v.name),
      type: form.type,
      status: "scheduled",
      notes: form.notes,
    };
    setList((prev) => [...prev, newSchedule]);
    toast.success("Visit scheduled successfully");
    setDialogOpen(false);
    setForm({ schoolId: "", date: "", time: "", type: "campus-tour", notes: "", volunteerIds: [] });
  };

  const toggleVolunteer = (id: string) => {
    setForm((prev) => ({
      ...prev,
      volunteerIds: prev.volunteerIds.includes(id)
        ? prev.volunteerIds.filter((v) => v !== id)
        : [...prev.volunteerIds, id],
    }));
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Schedules</h1>
          <p className="page-subtitle">Plan and track school visits and tours.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Schedule Visit</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by school..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Volunteers</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground" />{s.date}</TableCell>
                  <TableCell>{s.time}</TableCell>
                  <TableCell>{s.schoolName}</TableCell>
                  <TableCell><Badge variant="secondary">{typeLabel[s.type]}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.volunteerNames.join(", ")}</TableCell>
                  <TableCell><Badge variant={statusVariant[s.status]} className="capitalize">{s.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Schedule a Visit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label>School</Label>
              <Select value={form.schoolId} onValueChange={(v) => setForm({ ...form, schoolId: v })}>
                <SelectTrigger><SelectValue placeholder="Select school" /></SelectTrigger>
                <SelectContent>{schools.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Time</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
            </div>
            <div className="grid gap-2">
              <Label>Visit Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TourSchedule["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="campus-tour">Campus Tour</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="mentoring">Mentoring</SelectItem>
                  <SelectItem value="career-day">Career Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Assign Volunteers</Label>
              <div className="flex flex-wrap gap-2">
                {volunteers.filter(v => v.status === "active").map((v) => (
                  <Badge
                    key={v.id}
                    variant={form.volunteerIds.includes(v.id) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleVolunteer(v.id)}
                  >
                    {v.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button onClick={handleAdd}>Schedule Visit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulesPage;
