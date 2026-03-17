import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { demoSchedules, demoSchools, demoVolunteers } from "@/lib/demoData";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, CalendarDays, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Schedule {
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
}

interface School {
  id: string;
  name: string;
}

interface Volunteer {
  id: string;
  name: string;
}

type FormData = {
  school_id: string;
  date: string;
  time: string;
  type: "campus-tour" | "workshop" | "mentoring" | "career-day";
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
  volunteer_ids: string[];
};

const emptyForm: FormData = {
  school_id: "", date: "", time: "", type: "campus-tour", status: "scheduled", notes: "", volunteer_ids: [],
};

const typeLabel: Record<string, string> = {
  "campus-tour": "Campus Tour", workshop: "Workshop", mentoring: "Mentoring", "career-day": "Career Day",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  scheduled: "default", completed: "secondary", cancelled: "destructive",
};

const SchedulesPage = () => {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  const { data: supabaseSchedules = [] } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("schedules").select("*").order("date");
        return (data || []) as Schedule[];
      } catch { return [] as Schedule[]; }
    },
    enabled: !isDemoMode,
  });

  const { data: supabaseSchools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("schools").select("id, name").order("name");
        return (data || []) as School[];
      } catch { return [] as School[]; }
    },
    enabled: !isDemoMode,
  });

  const { data: supabaseVolunteers = [] } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("volunteers").select("id, name").eq("status", "active").order("name");
        return (data || []) as Volunteer[];
      } catch { return [] as Volunteer[]; }
    },
    enabled: !isDemoMode,
  });

  const schedules = isDemoMode ? demoSchedules : supabaseSchedules;
  const schools = isDemoMode ? demoSchools : supabaseSchools;
  const volunteers = isDemoMode ? demoVolunteers : supabaseVolunteers;

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      const school = schools.find(s => s.id === data.school_id);
      const vols = volunteers.filter(v => data.volunteer_ids.includes(v.id));
      const insertData = { ...data, school_name: school?.name || "", volunteer_names: vols.map(v => v.name), status: "scheduled" as const };
      const { error } = await supabase.from("schedules").insert(insertData);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Visit scheduled successfully");
      setDialogOpen(false);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof emptyForm }) => {
      const school = schools.find(s => s.id === data.school_id);
      const vols = volunteers.filter(v => data.volunteer_ids.includes(v.id));
      const updateData = { ...data, school_name: school?.name || "", volunteer_names: vols.map(v => v.name) };
      const { error } = await supabase.from("schedules").update(updateData).eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule updated successfully");
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schedules").delete().eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule deleted");
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    },
  });

  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (scheduleToDelete && !isDemoMode) {
      deleteMutation.mutate(scheduleToDelete.id);
    } else if (isDemoMode) {
      toast.info("Delete not available in demo mode");
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const filtered = schedules.filter((s) => s.school_name?.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (schedule: Schedule) => {
    setEditing(schedule);
    setForm({ school_id: schedule.school_id, date: schedule.date, time: schedule.time, type: schedule.type, status: schedule.status, notes: schedule.notes || "", volunteer_ids: schedule.volunteer_ids || [] });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.school_id || !form.date) { toast.error("School and date are required"); return; }
    if (editing) {
      if (!isDemoMode) updateMutation.mutate({ id: editing.id, data: form });
      else toast.info("Edit not available in demo mode");
    } else {
      if (!isDemoMode) createMutation.mutate(form);
      else toast.info("Add not available in demo mode");
    }
  };

  const toggleVolunteer = (id: string) => {
    setForm((prev) => ({ ...prev, volunteer_ids: prev.volunteer_ids.includes(id) ? prev.volunteer_ids.filter((v) => v !== id) : [...prev.volunteer_ids, id] }));
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Schedules</h1>
          <p className="page-subtitle">Plan and track school visits and tours.</p>
        </div>
        <Button onClick={openAdd} disabled={isDemoMode}><Plus className="w-4 h-4 mr-2" />Schedule Visit</Button>
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No schedules found</TableCell></TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4 text-muted-foreground" />{s.date}</TableCell>
                    <TableCell>{s.time}</TableCell>
                    <TableCell>{s.school_name}</TableCell>
                    <TableCell><Badge variant="secondary">{typeLabel[s.type]}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.volunteer_names?.join(", ")}</TableCell>
                    <TableCell><Badge variant={statusVariant[s.status]} className="capitalize">{s.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)} disabled={isDemoMode}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(s)} disabled={isDemoMode}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? "Edit Schedule" : "Schedule a Visit"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label>School</Label>
              <Select value={form.school_id} onValueChange={(v) => setForm({ ...form, school_id: v })} disabled={isDemoMode}>
                <SelectTrigger><SelectValue placeholder="Select school" /></SelectTrigger>
                <SelectContent>{schools.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} disabled={isDemoMode} /></div>
              <div className="grid gap-2"><Label>Time</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} disabled={isDemoMode} /></div>
            </div>
            <div className="grid gap-2">
              <Label>Visit Type</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })} disabled={isDemoMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="campus-tour">Campus Tour</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="mentoring">Mentoring</SelectItem>
                  <SelectItem value="career-day">Career Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editing && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })} disabled={isDemoMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label>Assign Volunteers</Label>
              <div className="flex flex-wrap gap-2">
                {volunteers.map((v) => (
                  <Badge key={v.id} variant={form.volunteer_ids.includes(v.id) ? "default" : "secondary"} className="cursor-pointer" onClick={() => !isDemoMode && toggleVolunteer(v.id)}>
                    {v.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} disabled={isDemoMode} /></div>
            <Button onClick={handleSave} disabled={isDemoMode || createMutation.isPending || updateMutation.isPending}>
              {editing ? "Save Changes" : "Schedule Visit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this scheduled visit for "{scheduleToDelete?.school_name}"? This action cannot be undone.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SchedulesPage;