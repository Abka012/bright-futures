import { useState } from "react";
import { volunteers as initialVolunteers, Volunteer } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const emptyVolunteer: Omit<Volunteer, "id"> = {
  name: "", email: "", phone: "", skills: [], availability: "", hoursLogged: 0, status: "active", joinDate: new Date().toISOString().split("T")[0],
};

const VolunteersPage = () => {
  const [list, setList] = useState<Volunteer[]>(initialVolunteers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState<Omit<Volunteer, "id">>(emptyVolunteer);
  const [skillInput, setSkillInput] = useState("");

  const filtered = list.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyVolunteer); setSkillInput(""); setDialogOpen(true); };
  const openEdit = (vol: Volunteer) => { setEditing(vol); setForm({ ...vol }); setSkillInput(vol.skills.join(", ")); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const skills = skillInput.split(",").map(s => s.trim()).filter(Boolean);
    if (editing) {
      setList((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...form, skills } : v)));
      toast.success("Volunteer updated");
    } else {
      setList((prev) => [...prev, { ...form, skills, id: `v${Date.now()}` }]);
      toast.success("Volunteer added");
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Volunteers</h1>
          <p className="page-subtitle">Track and manage your volunteer network.</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Volunteer</Button>
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
              {filtered.map((vol) => (
                <TableRow key={vol.id}>
                  <TableCell className="font-medium">{vol.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vol.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {vol.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{vol.availability}</TableCell>
                  <TableCell>{vol.hoursLogged}</TableCell>
                  <TableCell><Badge variant={vol.status === "active" ? "default" : "destructive"} className="capitalize">{vol.status}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(vol)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
            <div className="grid gap-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="grid gap-2"><Label>Skills (comma-separated)</Label><Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Availability</Label><Input value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} /></div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Volunteer["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Volunteer"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VolunteersPage;
