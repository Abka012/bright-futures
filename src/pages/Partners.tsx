import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { demoPartners } from "@/lib/demoData";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2, Pencil, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Partner {
  id: string;
  name: string;
  type: "corporate" | "nonprofit" | "government" | "educational";
  contact_name: string;
  contact_email: string;
  phone: string;
  contribution: string;
  status: "active" | "prospective" | "inactive";
  since: string;
}

type PartnerFormData = Omit<Partner, "id">;

const emptyPartner: PartnerFormData = {
  name: "", type: "corporate", contact_name: "", contact_email: "", phone: "", contribution: "", status: "prospective", since: "",
};

const typeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  corporate: "default", nonprofit: "secondary", government: "outline", educational: "secondary",
};
const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default", prospective: "secondary", inactive: "destructive",
};

const PartnersPage = () => {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState<PartnerFormData>(emptyPartner);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  const { data: supabasePartners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("partners").select("*").order("name");
        return (data || []) as Partner[];
      } catch { return [] as Partner[]; }
    },
    enabled: !isDemoMode,
  });

  const partners = isDemoMode ? demoPartners : supabasePartners;

  const createMutation = useMutation({
    mutationFn: async (data: PartnerFormData) => {
      const { error } = await supabase.from("partners").insert(data);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner added successfully");
      setDialogOpen(false);
      setForm(emptyPartner);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Partner> }) => {
      const { error } = await supabase.from("partners").update(data).eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner updated successfully");
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyPartner);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error && error.code !== "PGRST116") throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner deleted");
      setDeleteDialogOpen(false);
      setPartnerToDelete(null);
    },
  });

  const openAdd = () => { setEditing(null); setForm(emptyPartner); setDialogOpen(true); };
  const openEdit = (partner: Partner) => {
    setEditing(partner);
    setForm({ name: partner.name, type: partner.type, contact_name: partner.contact_name, contact_email: partner.contact_email, phone: partner.phone, contribution: partner.contribution, status: partner.status, since: partner.since });
    setDialogOpen(true);
  };

  const handleDeleteClick = (partner: Partner) => {
    setPartnerToDelete(partner);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (partnerToDelete && !isDemoMode) {
      deleteMutation.mutate(partnerToDelete.id);
    } else if (isDemoMode) {
      toast.info("Delete not available in demo mode");
      setDeleteDialogOpen(false);
      setPartnerToDelete(null);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Partner name is required"); return; }
    if (editing) {
      if (!isDemoMode) updateMutation.mutate({ id: editing.id, data: form });
      else toast.info("Edit not available in demo mode");
    } else {
      if (!isDemoMode) createMutation.mutate(form);
      else toast.info("Add not available in demo mode");
    }
  };

  const filtered = partners.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Partners</h1>
          <p className="page-subtitle">Organizations supporting Bright Futures initiatives.</p>
        </div>
        <Button onClick={openAdd} disabled={isDemoMode}><Plus className="w-4 h-4 mr-2" />Add Partner</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Since</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No partners found</TableCell></TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><Badge variant={typeColors[p.type]} className="capitalize">{p.type}</Badge></TableCell>
                    <TableCell>
                      <div className="text-sm">{p.contact_name}</div>
                      <div className="text-xs text-muted-foreground">{p.contact_email}</div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px]">{p.contribution}</TableCell>
                    <TableCell><Badge variant={statusColors[p.status]} className="capitalize">{p.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.since}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} disabled={isDemoMode}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(p)} disabled={isDemoMode}>
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
            <DialogTitle className="font-display">{editing ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label>Organization Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={isDemoMode} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Partner["type"] })} disabled={isDemoMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Partner["status"] })} disabled={isDemoMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="prospective">Prospective</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={isDemoMode} />
              </div>
              <div className="grid gap-2">
                <Label>Since</Label>
                <Input type="date" value={form.since} onChange={(e) => setForm({ ...form, since: e.target.value })} disabled={isDemoMode} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Contribution</Label>
              <Input value={form.contribution} onChange={(e) => setForm({ ...form, contribution: e.target.value })} disabled={isDemoMode} />
            </div>
            <Button onClick={handleSave} disabled={isDemoMode || createMutation.isPending || updateMutation.isPending}>
              {editing ? "Save Changes" : "Add Partner"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{partnerToDelete?.name}"? This action cannot be undone.
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

export default PartnersPage;