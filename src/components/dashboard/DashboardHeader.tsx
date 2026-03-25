import { Bell, Menu, LogOut, User, Settings, MapPin, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import type { Alert } from "@/pages/Dashboard";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  alerts: Alert[];
}

export default function DashboardHeader({ sidebarOpen, onToggleSidebar, alerts }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadAlerts = alerts.filter(a => !a.is_read);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-secondary"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg hidden sm:block text-gradient-primary">MineWatch</span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-2 ml-8">
          <Button
            variant={location.pathname === "/dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <MapPin className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant={location.pathname === "/analytics" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/analytics")}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
              <Bell className="w-5 h-5" />
              {unreadAlerts.length > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs"
                >
                  {unreadAlerts.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadAlerts.length > 0 && (
                <Badge variant="secondary">{unreadAlerts.length} new</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No notifications yet
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    {!alert.is_read && <span className="status-indicator status-danger" />}
                    <span className="font-medium text-sm">{alert.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {alert.message}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-secondary">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.user_metadata?.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
