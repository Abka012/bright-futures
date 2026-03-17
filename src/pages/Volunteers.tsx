import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { demoVolunteers } from "@/lib/demoData";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  hours_logged: number;
  status: "active" | "inactive";
  join_date: string;
}

const emptyVolunteer = {
  name: "", email: "", phone: "", skills: [] as string[], availability: "", hours_logged: 0, status: "active" as "active" | "inactive", join_date: new Date().toISOString().split("T")[0],
};

const VolunteersPage = () => {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState<typeof emptyVolunteer>(emptyVolunteer);
  const [skillInput, setSkillInput] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState<Volunteer | null>(null);

  const { data: supabaseVolunteers = [] } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("volunteers").select("*").order("name");
        return (data || []) as Volunteer[];
      } catch { return [] as Volunteer[]; }
    },
    enabled: !isDemoMode,
  });

  const volunteers = isDemoMode ? demoVolunteers : supabaseVolunteers;

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyVolunteer) => {
      const { error } = await supabase.from("volunteers").insert(data);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      toast.success("Volunteer added");
      setDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Volunteer> }) => {
      const { error } = await supabase.from("volunteers").update(data).eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      toast.success("Volunteer updated");
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("volunteers").delete().eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      toast.success("Volunteer deleted");
      setDeleteDialogOpen(false);
      setVolunteerToDelete(null);
    },
  });

  const handleDeleteClick = (vol: Volunteer) => {
    setVolunteerToDelete(vol);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (volunteerToDelete && !isDemoMode) {
      deleteMutation.mutate(volunteerToDelete.id);
    } else if (isDemoMode) {
      toast.info("Delete not available in demo mode");
      setDeleteDialogOpen(false);
      setVolunteerToDelete(null);
    }
  };

  const filtered = volunteers.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyVolunteer); setSkillInput(""); setDialogOpen(true); };
  const openEdit = (vol: Volunteer) => { setEditing(vol); setForm({ ...vol }); setSkillInput(vol.skills?.join(", ") || ""); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const skills = skillInput.split(",").map(s => s.trim()).filter(Boolean);
    const data = { ...form, skills };
    if (editing) {
      if (!isDemoMode) {
        updateMutation.mutate({ id: editing.id, data });
      } else {
        toast.info("Edit not available in demo mode");
      }
    } else {
      if (!isDemoMode) {
        createMutation.mutate(data);
      } else {
        toast.info("Add not available in demo mode");
      }
    }
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Volunteers</h1>
          <p className="page-subtitle">Track and manage your volunteer network.</p>
        </div>
        <Button onClick={openAdd} disabled={isDemoMode}><Plus className="w-4 h-4 mr-2" />Add Volunteer</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search volunteers..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No volunteers found</TableCell></TableRow>
              ) : (
                filtered.map((vol) => (
                  <TableRow key={vol.id}>
                    <TableCell className="font-medium">{vol.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{vol.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {vol.skills?.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{vol.availability}</TableCell>
                    <TableCell>{vol.hours_logged}</TableCell>
                    <TableCell><Badge variant={vol.status === "active" ? "default" : "destructive"} className="capitalize">{vol.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(vol)} disabled={isDemoMode}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(vol)} disabled={isDemoMode}>
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
            <DialogTitle className="font-display">{editing ? "Edit Volunteer" : "Add Volunteer"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={isDemoMode} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={isDemoMode} /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={isDemoMode} /></div>
            </div>
            <div className="grid gap-2"><Label>Skills (comma-separated)</Label><Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} disabled={isDemoMode} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Availability</Label><Input value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} disabled={isDemoMode} /></div>
              <div className="grid gap-2"><Label>Hours Logged</Label><Input type="number" value={form.hours_logged} onChange={(e) => setForm({ ...form, hours_logged: parseInt(e.target.value) || 0 })} disabled={isDemoMode} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })} disabled={isDemoMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isDemoMode || createMutation.isPending || updateMutation.isPending}>
              {editing ? "Save Changes" : "Add Volunteer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Volunteer</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{volunteerToDelete?.name}"? This action cannot be undone.
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

export default VolunteersPage;