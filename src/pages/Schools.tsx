import { useState } from "react";
import { schools as initialSchools, School } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const emptySchool: Omit<School, "id"> = {
  name: "", address: "", city: "", state: "", contactName: "", contactEmail: "", contactPhone: "", studentCount: 0, status: "pending", lastVisit: "", notes: "",
};

const SchoolsPage = () => {
  const [schoolList, setSchoolList] = useState<School[]>(initialSchools);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<School | null>(null);
  const [form, setForm] = useState<Omit<School, "id">>(emptySchool);

  const filtered = schoolList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptySchool); setDialogOpen(true); };
  const openEdit = (school: School) => { setEditing(school); setForm({ ...school }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("School name is required"); return; }
    if (editing) {
      setSchoolList((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)));
      toast.success("School updated successfully");
    } else {
      const newSchool: School = { ...form, id: `s${Date.now()}` };
      setSchoolList((prev) => [...prev, newSchool]);
      toast.success("School added successfully");
    }
    setDialogOpen(false);
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
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add School</Button>
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
                <TableHead>Last Visit</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{school.city}, {school.state}</TableCell>
                  <TableCell className="text-sm">{school.contactName}</TableCell>
                  <TableCell>{school.studentCount}</TableCell>
                  <TableCell><Badge variant={statusColor[school.status]} className="capitalize">{school.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{school.lastVisit}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(school)}>
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
            <DialogTitle className="font-display">{editing ? "Edit School" : "Add New School"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label>School Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Contact Name</Label>
                <Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Contact Email</Label>
                <Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Student Count</Label>
                <Input type="number" value={form.studentCount} onChange={(e) => setForm({ ...form, studentCount: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as School["status"] })}>
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
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add School"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolsPage;
