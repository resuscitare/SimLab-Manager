"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Activity, Calendar, Users, FileText, CheckSquare, Sparkles, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Activity
  },
  {
    title: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar
  },
  {
    title: "Cenários",
    href: "/cenarios",
    icon: FileText
  },
  {
    title: "Checklists",
    href: "/checklists",
    icon: CheckSquare
  },
  {
    title: "Assistente IA",
    href: "/ia",
    icon: Sparkles
  },
  {
    title: "Equipamentos",
    href: "/equipamentos",
    icon: Package
  },
  {
    title: "Instrutores",
    href: "/instrutores",
    icon: Users
  }
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarContent = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Resuscitare</h1>
            <p className="text-xs text-muted-foreground">SimLab Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          <div>Resuscitare Serviços Médicos</div>
          <div>v1.0.0</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;