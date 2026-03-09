import { partners } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const typeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  corporate: "default", nonprofit: "secondary", government: "outline", educational: "secondary",
};
const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default", prospective: "secondary", inactive: "destructive",
};

const PartnersPage = () => {
  const [search, setSearch] = useState("");
  const filtered = partners.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Partners</h1>
        <p className="page-subtitle">Organizations supporting Bright Futures initiatives.</p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant={typeColors[p.type]} className="capitalize">{p.type}</Badge></TableCell>
                  <TableCell>
                    <div className="text-sm">{p.contactName}</div>
                    <div className="text-xs text-muted-foreground">{p.contactEmail}</div>
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px]">{p.contribution}</TableCell>
                  <TableCell><Badge variant={statusColors[p.status]} className="capitalize">{p.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.since}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
};

export default PartnersPage;
