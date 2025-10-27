"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Activity, 
  Calendar, 
  Users, 
  FileText, 
  CheckSquare, 
  Sparkles, 
  Package,
  LogOut,
  User,
  Settings,
  Database,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
    title: "Gestão",
    icon: Briefcase,
    subItems: [
      {
        title: "Status dos Equipamentos",
        href: "/equipamentos",
        icon: Package
      },
      {
        title: "Gestão de Materiais",
        href: "/materiais",
        icon: Database
      },
      {
        title: "Instrutores",
        href: "/instrutores",
        icon: Users
      },
    ]
  },
  {
    title: "Painel Admin",
    href: "/admin",
    icon: Settings
  }
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

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
          <SidebarContent onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-foreground">SimLab Manager</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar ? `/avatars/${user.avatar}.jpg` : undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.nome}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  onClose?: () => void;
}

const SidebarContent = ({ onClose }: SidebarContentProps) => {
  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

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
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => 
            item.subItems ? (
              <CollapsibleItem key={item.title} item={item} onClose={onClose} />
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleNavigation}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  location.pathname === item.href
                    ? "bg-green-600 text-white font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname !== item.href && "hover:translate-x-1",
                  "focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                {location.pathname === item.href && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                )}
              </Link>
            )
          )}
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

const CollapsibleItem = ({ item, onClose }: { item: any, onClose?: () => void }) => {
  const location = useLocation();
  const isGroupActive = item.subItems.some((sub: any) => location.pathname.startsWith(sub.href));
  const [isOpen, setIsOpen] = useState(isGroupActive);

  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className={cn(
        "flex items-center justify-between w-full space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isGroupActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "hover:no-underline"
      )}>
        <div className="flex items-center space-x-3">
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </div>
        <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-7 pt-1 space-y-1">
        {item.subItems.map((subItem: any) => {
          const isSubActive = location.pathname === subItem.href;
          return (
            <Link
              key={subItem.href}
              to={subItem.href}
              onClick={handleNavigation}
              className={cn(
                "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                isSubActive
                  ? "bg-green-600 text-white font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !isSubActive && "hover:translate-x-1"
              )}
            >
              <subItem.icon className="h-4 w-4" />
              <span>{subItem.title}</span>
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Layout;