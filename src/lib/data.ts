export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  studentCount: number;
  status: "active" | "pending" | "inactive";
  lastVisit: string;
  notes: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  hoursLogged: number;
  status: "active" | "inactive";
  joinDate: string;
}

export interface TourSchedule {
  id: string;
  schoolId: string;
  schoolName: string;
  date: string;
  time: string;
  volunteerIds: string[];
  volunteerNames: string[];
  type: "campus-tour" | "workshop" | "mentoring" | "career-day";
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

export interface Partner {
  id: string;
  name: string;
  type: "corporate" | "nonprofit" | "government" | "educational";
  contactName: string;
  contactEmail: string;
  phone: string;
  contribution: string;
  status: "active" | "prospective" | "inactive";
  since: string;
}

export const schools: School[] = [
  { id: "s1", name: "Lincoln Elementary", address: "123 Main St", city: "Springfield", state: "IL", contactName: "Jane Doe", contactEmail: "jane@lincoln.edu", contactPhone: "(555) 123-4567", studentCount: 450, status: "active", lastVisit: "2026-02-15", notes: "Strong STEM program" },
  { id: "s2", name: "Washington Middle School", address: "456 Oak Ave", city: "Springfield", state: "IL", contactName: "John Smith", contactEmail: "john@washington.edu", contactPhone: "(555) 234-5678", studentCount: 620, status: "active", lastVisit: "2026-01-20", notes: "After-school program partner" },
  { id: "s3", name: "Roosevelt High", address: "789 Elm Blvd", city: "Decatur", state: "IL", contactName: "Maria Garcia", contactEmail: "maria@roosevelt.edu", contactPhone: "(555) 345-6789", studentCount: 890, status: "active", lastVisit: "2026-03-01", notes: "Career day planned" },
  { id: "s4", name: "Jefferson Academy", address: "321 Pine Rd", city: "Champaign", state: "IL", contactName: "Robert Lee", contactEmail: "robert@jefferson.edu", contactPhone: "(555) 456-7890", studentCount: 340, status: "pending", lastVisit: "2025-12-10", notes: "New partnership pending" },
  { id: "s5", name: "Franklin STEM School", address: "654 Cedar Ln", city: "Peoria", state: "IL", contactName: "Sarah Chen", contactEmail: "sarah@franklin.edu", contactPhone: "(555) 567-8901", studentCount: 280, status: "active", lastVisit: "2026-02-28", notes: "Robotics focus" },
];

export const volunteers: Volunteer[] = [
  { id: "v1", name: "Alex Johnson", email: "alex@email.com", phone: "(555) 111-2222", skills: ["Teaching", "Mentoring"], availability: "Weekends", hoursLogged: 120, status: "active", joinDate: "2024-06-15" },
  { id: "v2", name: "Priya Patel", email: "priya@email.com", phone: "(555) 222-3333", skills: ["STEM", "Workshop Facilitation"], availability: "Weekdays", hoursLogged: 85, status: "active", joinDate: "2024-09-01" },
  { id: "v3", name: "Marcus Williams", email: "marcus@email.com", phone: "(555) 333-4444", skills: ["Career Counseling", "Public Speaking"], availability: "Flexible", hoursLogged: 200, status: "active", joinDate: "2023-03-10" },
  { id: "v4", name: "Emily Rodriguez", email: "emily@email.com", phone: "(555) 444-5555", skills: ["Art", "Music"], availability: "Weekends", hoursLogged: 45, status: "active", joinDate: "2025-01-20" },
  { id: "v5", name: "David Kim", email: "david@email.com", phone: "(555) 555-6666", skills: ["Technology", "Coding"], availability: "Evenings", hoursLogged: 160, status: "inactive", joinDate: "2023-11-05" },
];

export const schedules: TourSchedule[] = [
  { id: "t1", schoolId: "s1", schoolName: "Lincoln Elementary", date: "2026-03-15", time: "09:00", volunteerIds: ["v1", "v2"], volunteerNames: ["Alex Johnson", "Priya Patel"], type: "campus-tour", status: "scheduled", notes: "Morning tour for 5th graders" },
  { id: "t2", schoolId: "s3", schoolName: "Roosevelt High", date: "2026-03-20", time: "13:00", volunteerIds: ["v3"], volunteerNames: ["Marcus Williams"], type: "career-day", status: "scheduled", notes: "Career exploration workshop" },
  { id: "t3", schoolId: "s2", schoolName: "Washington Middle School", date: "2026-03-10", time: "10:00", volunteerIds: ["v1", "v4"], volunteerNames: ["Alex Johnson", "Emily Rodriguez"], type: "workshop", status: "completed", notes: "Arts integration workshop" },
  { id: "t4", schoolId: "s5", schoolName: "Franklin STEM School", date: "2026-03-25", time: "14:00", volunteerIds: ["v2", "v5"], volunteerNames: ["Priya Patel", "David Kim"], type: "mentoring", status: "scheduled", notes: "Robotics mentoring session" },
  { id: "t5", schoolId: "s1", schoolName: "Lincoln Elementary", date: "2026-02-15", time: "09:30", volunteerIds: ["v3", "v4"], volunteerNames: ["Marcus Williams", "Emily Rodriguez"], type: "workshop", status: "completed", notes: "Science fair prep" },
];

export const partners: Partner[] = [
  { id: "p1", name: "TechCorp Industries", type: "corporate", contactName: "Lisa Wang", contactEmail: "lisa@techcorp.com", phone: "(555) 700-1000", contribution: "STEM equipment & funding", status: "active", since: "2022-01-15" },
  { id: "p2", name: "Community Foundation", type: "nonprofit", contactName: "James Brown", contactEmail: "james@commfound.org", phone: "(555) 700-2000", contribution: "Grant funding", status: "active", since: "2021-06-01" },
  { id: "p3", name: "State Education Dept.", type: "government", contactName: "Karen White", contactEmail: "karen@stateed.gov", phone: "(555) 700-3000", contribution: "Policy support & certification", status: "active", since: "2020-09-15" },
  { id: "p4", name: "University of Illinois", type: "educational", contactName: "Prof. Alan Green", contactEmail: "alan@uiuc.edu", phone: "(555) 700-4000", contribution: "Research & student volunteers", status: "active", since: "2023-02-01" },
  { id: "p5", name: "MegaBank Corp", type: "corporate", contactName: "Tom Harris", contactEmail: "tom@megabank.com", phone: "(555) 700-5000", contribution: "Financial literacy programs", status: "prospective", since: "2025-11-01" },
];
