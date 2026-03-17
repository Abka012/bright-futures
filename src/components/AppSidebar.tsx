import { useState } from "react";
import {
  LayoutDashboard,
  School,
  Users,
  Calendar,
  Handshake,
  BarChart3,
  Sun,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const items = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Schools", url: "/app/schools", icon: School },
  { title: "Volunteers", url: "/app/volunteers", icon: Users },
  { title: "Schedules", url: "/app/schedules", icon: Calendar },
  { title: "Partners", url: "/app/partners", icon: Handshake },
  { title: "Reports", url: "/app/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const handleSignOutClick = () => {
    setSignOutDialogOpen(true);
  };

  const handleSignOutConfirm = async () => {
    await signOut();
    setSignOutDialogOpen(false);
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <Sun className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold font-display text-sidebar-foreground tracking-tight">
              Bright Futures
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/app"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOutClick}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {!collapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            {isDemoMode 
              ? "Are you sure you want to exit demo mode?" 
              : "Are you sure you want to sign out?"}
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOutConfirm}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
