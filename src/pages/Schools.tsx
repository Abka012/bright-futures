import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { demoSchools } from "@/lib/demoData";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface School {
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
  notes: string;
}

const emptySchool = {
  name: "", address: "", city: "", state: "", contact_name: "", contact_email: "", contact_phone: "", student_count: 0, status: "pending" as "active" | "pending" | "inactive", notes: "",
};

const SchoolsPage = () => {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<School | null>(null);
  const [form, setForm] = useState<typeof emptySchool>(emptySchool);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  const { data: supabaseSchools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("schools").select("*").order("name");
        return (data || []) as School[];
      } catch { return [] as School[]; }
    },
    enabled: !isDemoMode,
  });

  const schools = isDemoMode ? demoSchools : supabaseSchools;

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptySchool) => {
      const { error } = await supabase.from("schools").insert(data);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School added successfully");
      setDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<School> }) => {
      const { error } = await supabase.from("schools").update(data).eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School updated successfully");
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schools").delete().eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School deleted successfully");
      setDeleteDialogOpen(false);
      setSchoolToDelete(null);
    },
  });

  const handleDeleteClick = (school: School) => {
    setSchoolToDelete(school);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (schoolToDelete && !isDemoMode) {
      deleteMutation.mutate(schoolToDelete.id);
    } else if (isDemoMode) {
      toast.info("Delete not available in demo mode");
      setDeleteDialogOpen(false);
      setSchoolToDelete(null);
    }
  };

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptySchool); setDialogOpen(true); };
  const openEdit = (school: School) => { setEditing(school); setForm({ ...school }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("School name is required"); return; }
    if (editing) {
      if (!isDemoMode) updateMutation.mutate({ id: editing.id, data: form });
      else toast.info("Edit not available in demo mode");
    } else {
      if (!isDemoMode) createMutation.mutate(form);
      else toast.info("Add not available in demo mode");
    }
  };

  const statusColor: Record<string, "default" | "secondary" | "destructive"> = {
    active: "default", pending: "secondary", inactive: "destructive",
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Schools</h1>
          <p className="page-subtitle">Manage partner schools and their information.</p>
        </div>
        <Button onClick={openAdd} disabled={isDemoMode}><Plus className="w-4 h-4 mr-2" />Add School</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search schools..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No schools found</TableCell></TableRow>
              ) : (
                filtered.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{school.city}, {school.state}</TableCell>
                    <TableCell className="text-sm">{school.contact_name}</TableCell>
                    <TableCell>{school.student_count}</TableCell>
                    <TableCell><Badge variant={statusColor[school.status]} className="capitalize">{school.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(school)} disabled={isDemoMode}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(school)} disabled={isDemoMode}>
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
            <DialogTitle className="font-display">{editing ? "Edit School" : "Add New School"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label>School Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={isDemoMode} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} disabled={isDemoMode} />
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} disabled={isDemoMode} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} disabled={isDemoMode} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Contact Name</Label>
                <Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} disabled={isDemoMode} />
              </div>
              <div className="grid gap-2">
                <Label>Contact Email</Label>
                <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} disabled={isDemoMode} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} disabled={isDemoMode} />
              </div>
              <div className="grid gap-2">
                <Label>Student Count</Label>
                <Input type="number" value={form.student_count} onChange={(e) => setForm({ ...form, student_count: parseInt(e.target.value) || 0 })} disabled={isDemoMode} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "pending" | "inactive" })} disabled={isDemoMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} disabled={isDemoMode} />
            </div>
            <Button onClick={handleSave} disabled={isDemoMode || createMutation.isPending || updateMutation.isPending}>
              {editing ? "Save Changes" : "Add School"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete School</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{schoolToDelete?.name}"? This action cannot be undone.
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

export default SchoolsPage;