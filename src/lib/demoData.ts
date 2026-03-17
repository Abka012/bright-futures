export const demoSchools = [
  { id: "1", name: "Lincoln High School", address: "123 Education Ave", city: "Springfield", state: "IL", contact_name: "Sarah Johnson", contact_email: "sjohnson@lincoln.edu", contact_phone: "555-0101", student_count: 1250, status: "active" as const, notes: "Strong STEM program" },
  { id: "2", name: "Washington Elementary", address: "456 Freedom Blvd", city: "Liberty", state: "TX", contact_name: "Michael Brown", contact_email: "mbrown@washington.edu", contact_phone: "555-0102", student_count: 850, status: "active" as const, notes: "Title I school" },
  { id: "3", name: "Jefferson Middle School", address: "789 Democracy Lane", city: "Franklin", state: "OH", contact_name: "Emily Davis", contact_email: "edavis@jefferson.edu", contact_phone: "555-0103", student_count: 620, status: "active" as const, notes: "Focus on arts" },
  { id: "4", name: "Roosevelt Academy", address: "321 New Deal Rd", city: "Truman", state: "MO", contact_name: "James Wilson", contact_email: "jwilson@roosevelt.edu", contact_phone: "555-0104", student_count: 980, status: "active" as const, notes: "Vocational programs" },
  { id: "5", name: "Kennedy High", address: "654 Camelot Way", city: "Eisenhower", state: "CA", contact_name: "Lisa Martinez", contact_email: "lmartinez@kennedy.edu", contact_phone: "555-0105", student_count: 1450, status: "active" as const, notes: "International Baccalaureate" },
  { id: "6", name: "Madison Elementary", address: "987 Constitution St", city: "Washington", state: "DC", contact_name: "David Lee", contact_email: "dlee@madison.edu", contact_phone: "555-0106", student_count: 420, status: "pending" as const, notes: "New partnership inquiry" },
  { id: "7", name: "Monroe High School", address: "147 Doctrine Ave", city: "Monroe", state: "LA", contact_name: "Jennifer Taylor", contact_email: "jtaylor@monroe.edu", contact_phone: "555-0107", student_count: 780, status: "active" as const, notes: "Rural school district" },
  { id: "8", name: "Jackson Middle School", address: "258 Jacksons Way", city: "Jackson", state: "MS", contact_name: "Robert Anderson", contact_email: "randerson@jackson.edu", contact_phone: "555-0108", student_count: 540, status: "inactive" as const, notes: "Budget cuts" },
  { id: "9", name: "Adams High School", address: "369 Unity Blvd", city: "Adams", state: "NY", contact_name: "Michelle Thomas", contact_email: "mthomas@adams.edu", contact_phone: "555-0109", student_count: 1100, status: "active" as const, notes: "Career technical ed" },
  { id: "10", name: "Harrison Elementary", address: "741 Progress Dr", city: "Harrison", state: "NJ", contact_name: "Christopher White", contact_email: "cwhite@harrison.edu", contact_phone: "555-0110", student_count: 380, status: "pending" as const, notes: "Expanding facilities" },
  { id: "11", name: "Tyler Academy", address: "852 Legacy Lane", city: "Tyler", state: "TX", contact_name: "Amanda Garcia", contact_email: "agarcia@tyler.edu", contact_phone: "555-0111", student_count: 920, status: "active" as const, notes: "High college acceptance" },
  { id: "12", name: "Pierce High School", address: "963 Integrity Ave", city: "Pierce", state: "WA", contact_name: "Daniel Rodriguez", contact_email: "drodriguez@pierce.edu", contact_phone: "555-0112", student_count: 680, status: "active" as const, notes: "Marine Science program" },
];

export const demoVolunteers = [
  { id: "1", name: "Alex Thompson", email: "alex.t@email.com", phone: "555-1001", skills: ["Mentoring", "Career Guidance"], availability: "Weekends", hours_logged: 85, status: "active" as const, join_date: "2024-01-15" },
  { id: "2", name: "Jordan Williams", email: "jordan.w@email.com", phone: "555-1002", skills: ["Workshop Facilitation", "Public Speaking"], availability: "Weekdays", hours_logged: 62, status: "active" as const, join_date: "2024-02-20" },
  { id: "3", name: "Casey Rodriguez", email: "casey.r@email.com", phone: "555-1003", skills: ["IT", "Technical Training"], availability: "Evenings", hours_logged: 45, status: "active" as const, join_date: "2024-03-10" },
  { id: "4", name: "Morgan Lee", email: "morgan.l@email.com", phone: "555-1004", skills: ["Art", "Creative Writing"], availability: "Weekends", hours_logged: 38, status: "active" as const, join_date: "2024-03-25" },
  { id: "5", name: "Taylor Kim", email: "taylor.k@email.com", phone: "555-1005", skills: ["Science", "Math Tutoring"], availability: "Weekdays", hours_logged: 72, status: "active" as const, join_date: "2024-04-05" },
  { id: "6", name: "Riley Chen", email: "riley.c@email.com", phone: "555-1006", skills: ["Business", "Finance"], availability: "Evenings", hours_logged: 55, status: "active" as const, join_date: "2024-04-18" },
  { id: "7", name: "Jamie Patel", email: "jamie.p@email.com", phone: "555-1007", skills: ["Healthcare", "First Aid"], availability: "Weekends", hours_logged: 28, status: "active" as const, join_date: "2024-05-02" },
  { id: "8", name: "Quinn Johnson", email: "quinn.j@email.com", phone: "555-1008", skills: ["Sports", "Physical Education"], availability: "Afternoons", hours_logged: 41, status: "active" as const, join_date: "2024-05-15" },
  { id: "9", name: "Avery Smith", email: "avery.s@email.com", phone: "555-1009", skills: ["Music", "Performing Arts"], availability: "Weekends", hours_logged: 33, status: "active" as const, join_date: "2024-06-01" },
  { id: "10", name: "Drew Martinez", email: "drew.m@email.com", phone: "555-1010", skills: ["Engineering", "Robotics"], availability: "Evenings", hours_logged: 67, status: "active" as const, join_date: "2024-06-20" },
  { id: "11", name: "Skyler Brown", email: "skyler.b@email.com", phone: "555-1011", skills: ["Photography", "Media"], availability: "Weekends", hours_logged: 15, status: "inactive" as const, join_date: "2024-07-10" },
  { id: "12", name: "Reese Wilson", email: "reese.w@email.com", phone: "555-1012", skills: ["Law", "Debate"], availability: "Weekdays", hours_logged: 22, status: "active" as const, join_date: "2024-08-05" },
  { id: "13", name: "Parker Davis", email: "parker.d@email.com", phone: "555-1013", skills: ["Cooking", "Nutrition"], availability: "Weekends", hours_logged: 18, status: "active" as const, join_date: "2024-08-22" },
  { id: "14", name: "Finley Taylor", email: "finley.t@email.com", phone: "555-1014", skills: ["Foreign Languages"], availability: "Afternoons", hours_logged: 12, status: "inactive" as const, join_date: "2024-09-01" },
  { id: "15", name: "Sage Anderson", email: "sage.a@email.com", phone: "555-1015", skills: ["Environmental Science"], availability: "Weekends", hours_logged: 8, status: "active" as const, join_date: "2024-09-15" },
];

const today = new Date();
const formatDate = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};
const formatFutureDate = (daysAhead: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
};

// Last 7 days - these will show in "Last 7 days" filter
export const demoSchedules = [
  // Completed in last 7 days (days 1-6)
  { id: "1", school_id: "1", school_name: "Lincoln High School", date: formatDate(2), time: "09:00", volunteer_ids: ["1", "2"], volunteer_names: ["Alex Thompson", "Jordan Williams"], type: "campus-tour" as const, status: "completed" as const, notes: "Great turnout" },
  { id: "2", school_id: "2", school_name: "Washington Elementary", date: formatDate(4), time: "10:30", volunteer_ids: ["3"], volunteer_names: ["Casey Rodriguez"], type: "workshop" as const, status: "completed" as const, notes: "IT basics workshop" },
  { id: "3", school_id: "3", school_name: "Jefferson Middle School", date: formatDate(5), time: "13:00", volunteer_ids: ["4"], volunteer_names: ["Morgan Lee"], type: "mentoring" as const, status: "completed" as const, notes: "Art mentoring session" },
  { id: "4", school_id: "4", school_name: "Roosevelt Academy", date: formatDate(1), time: "11:00", volunteer_ids: ["5", "6"], volunteer_names: ["Taylor Kim", "Riley Chen"], type: "career-day" as const, status: "completed" as const, notes: "Career day event" },
  { id: "5", school_id: "5", school_name: "Kennedy High", date: formatDate(3), time: "09:30", volunteer_ids: ["7"], volunteer_names: ["Jamie Patel"], type: "workshop" as const, status: "completed" as const, notes: "Health careers workshop" },
  { id: "6", school_id: "7", school_name: "Monroe High School", date: formatDate(6), time: "14:00", volunteer_ids: ["8"], volunteer_names: ["Quinn Johnson"], type: "campus-tour" as const, status: "completed" as const, notes: "Sports program tour" },
  
  // Scheduled (future) - these will show in all filters
  { id: "7", school_id: "1", school_name: "Lincoln High School", date: formatFutureDate(3), time: "09:00", volunteer_ids: ["1", "5"], volunteer_names: ["Alex Thompson", "Taylor Kim"], type: "career-day" as const, status: "scheduled" as const, notes: "Upcoming career fair" },
  { id: "8", school_id: "2", school_name: "Washington Elementary", date: formatFutureDate(5), time: "10:30", volunteer_ids: ["4"], volunteer_names: ["Morgan Lee"], type: "workshop" as const, status: "scheduled" as const, notes: "Art workshop" },
  { id: "9", school_id: "3", school_name: "Jefferson Middle School", date: formatFutureDate(7), time: "13:00", volunteer_ids: ["3"], volunteer_names: ["Casey Rodriguez"], type: "mentoring" as const, status: "scheduled" as const, notes: "Tech mentoring" },
  { id: "10", school_id: "4", school_name: "Roosevelt Academy", date: formatFutureDate(10), time: "11:00", volunteer_ids: ["6", "7"], volunteer_names: ["Riley Chen", "Jamie Patel"], type: "campus-tour" as const, status: "scheduled" as const, notes: "Health careers tour" },
  { id: "11", school_id: "5", school_name: "Kennedy High", date: formatFutureDate(14), time: "09:30", volunteer_ids: ["10"], volunteer_names: ["Drew Martinez"], type: "workshop" as const, status: "scheduled" as const, notes: "Robotics competition" },
  
  // Completed 8-30 days ago (won't show in 7 day but will show in 30 day)
  { id: "12", school_id: "9", school_name: "Adams High School", date: formatDate(10), time: "10:00", volunteer_ids: ["9"], volunteer_names: ["Avery Smith"], type: "mentoring" as const, status: "completed" as const, notes: "Music program visit" },
  { id: "13", school_id: "11", school_name: "Tyler Academy", date: formatDate(12), time: "11:30", volunteer_ids: ["10"], volunteer_names: ["Drew Martinez"], type: "workshop" as const, status: "completed" as const, notes: "Robotics workshop" },
  { id: "14", school_id: "12", school_name: "Pierce High School", date: formatDate(15), time: "13:30", volunteer_ids: ["12"], volunteer_names: ["Reese Wilson"], type: "career-day" as const, status: "completed" as const, notes: "Law career day" },
  { id: "15", school_id: "6", school_name: "Madison Elementary", date: formatDate(18), time: "09:00", volunteer_ids: ["13"], volunteer_names: ["Parker Davis"], type: "workshop" as const, status: "completed" as const, notes: "Healthy cooking class" },
  { id: "16", school_id: "1", school_name: "Lincoln High School", date: formatDate(22), time: "10:00", volunteer_ids: ["1"], volunteer_names: ["Alex Thompson"], type: "mentoring" as const, status: "completed" as const, notes: "College prep" },
  { id: "17", school_id: "2", school_name: "Washington Elementary", date: formatDate(25), time: "14:00", volunteer_ids: ["5"], volunteer_names: ["Taylor Kim"], type: "workshop" as const, status: "completed" as const, notes: "Math tutoring" },
  { id: "18", school_id: "3", school_name: "Jefferson Middle School", date: formatDate(28), time: "11:00", volunteer_ids: ["6"], volunteer_names: ["Riley Chen"], type: "career-day" as const, status: "completed" as const, notes: "Business careers" },
  
  // Completed 31-90 days ago (won't show in 7 or 30 day but will show in 90 day)
  { id: "19", school_id: "4", school_name: "Roosevelt Academy", date: formatDate(40), time: "09:30", volunteer_ids: ["4"], volunteer_names: ["Morgan Lee"], type: "campus-tour" as const, status: "completed" as const, notes: "Art program tour" },
  { id: "20", school_id: "5", school_name: "Kennedy High", date: formatDate(50), time: "13:00", volunteer_ids: ["7"], volunteer_names: ["Jamie Patel"], type: "workshop" as const, status: "completed" as const, notes: "Healthcare intro" },
  { id: "21", school_id: "7", school_name: "Monroe High School", date: formatDate(60), time: "10:30", volunteer_ids: ["3"], volunteer_names: ["Casey Rodriguez"], type: "mentoring" as const, status: "completed" as const, notes: "Tech mentoring" },
  { id: "22", school_id: "9", school_name: "Adams High School", date: formatDate(70), time: "14:30", volunteer_ids: ["14"], volunteer_names: ["Finley Taylor"], type: "campus-tour" as const, status: "completed" as const, notes: "Language program" },
  { id: "23", school_id: "11", school_name: "Tyler Academy", date: formatDate(80), time: "11:00", volunteer_ids: ["10"], volunteer_names: ["Drew Martinez"], type: "workshop" as const, status: "completed" as const, notes: "Engineering expo" },
  { id: "24", school_id: "1", school_name: "Lincoln High School", date: formatDate(85), time: "10:00", volunteer_ids: ["8"], volunteer_names: ["Quinn Johnson"], type: "career-day" as const, status: "completed" as const, notes: "Sports careers" },
  
  // Cancelled (won't affect completion rate much)
  { id: "25", school_id: "8", school_name: "Jackson Middle School", date: formatDate(20), time: "10:00", volunteer_ids: ["8"], volunteer_names: ["Quinn Johnson"], type: "campus-tour" as const, status: "cancelled" as const, notes: "School closed" },
  { id: "26", school_id: "6", school_name: "Madison Elementary", date: formatDate(35), time: "13:00", volunteer_ids: ["9"], volunteer_names: ["Avery Smith"], type: "workshop" as const, status: "cancelled" as const, notes: "Low enrollment" },
];

export const demoPartners = [
  { id: "1", name: "TechCorp Industries", type: "corporate" as const, contact_name: "John Smith", contact_email: "jsmith@techcorp.com", phone: "555-2001", contribution: "Annual sponsorship $50000", status: "active" as const, since: "2023-01-15" },
  { id: "2", name: "Community Health Foundation", type: "nonprofit" as const, contact_name: "Sarah Wilson", contact_email: "swilson@chf.org", phone: "555-2002", contribution: "Healthcare volunteers", status: "active" as const, since: "2023-03-20" },
  { id: "3", name: "State Department of Education", type: "government" as const, contact_name: "Robert Brown", contact_email: "rbrown@state.edu", phone: "555-2003", contribution: "Grant funding $25000", status: "active" as const, since: "2023-05-10" },
  { id: "4", name: "Metro Community College", type: "educational" as const, contact_name: "Lisa Davis", contact_email: "ldavis@metrocollege.edu", phone: "555-2004", contribution: "Dual enrollment programs", status: "active" as const, since: "2023-07-01" },
  { id: "5", name: "Business Network Inc", type: "corporate" as const, contact_name: "Michael Johnson", contact_email: "mjohnson@biznet.com", phone: "555-2005", contribution: "Mentorship program", status: "active" as const, since: "2023-09-15" },
  { id: "6", name: "Green Earth Initiative", type: "nonprofit" as const, contact_name: "Emily Chen", contact_email: "echen@greenearth.org", phone: "555-2006", contribution: "Environmental education", status: "prospective" as const, since: "2024-01-01" },
  { id: "7", name: "Regional Healthcare System", type: "corporate" as const, contact_name: "David Lee", contact_email: "dlee@regionalhealth.com", phone: "555-2007", contribution: "Health career pathway", status: "active" as const, since: "2024-02-10" },
  { id: "8", name: "Youth Empowerment Coalition", type: "nonprofit" as const, contact_name: "Amanda Taylor", contact_email: "ataylor@yecoalition.org", phone: "555-2008", contribution: "After-school programs", status: "prospective" as const, since: "2024-04-01" },
  { id: "9", name: "Federal Workforce Agency", type: "government" as const, contact_name: "James Wilson", contact_email: "jwilson@fwa.gov", phone: "555-2009", contribution: "Internship placements", status: "active" as const, since: "2024-05-15" },
  { id: "10", name: "Innovation Labs", type: "corporate" as const, contact_name: "Jennifer Martinez", contact_email: "jmartinez@innolabs.io", phone: "555-2010", contribution: "STEM workshop materials", status: "inactive" as const, since: "2023-08-01" },
];