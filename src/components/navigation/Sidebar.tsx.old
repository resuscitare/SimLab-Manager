"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home,
  FileText,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Package,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    current: false,
  },
  {
    name: "Cenários",
    href: "/cenario",
    icon: FileText,
    current: false,
  },
  {
    name: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
    current: false,
  },
  {
    name: "Gestão",
    href: "/gestao",
    icon: Settings,
    current: false,
    subItems: [
      {
        name: "Visão Geral",
        href: "/gestao",
        icon: BarChart3,
      },
      {
        name: "Cenários",
        href: "/gestao?tab=cenarios",
        icon: FileText,
      },
      {
        name: "Agendamentos",
        href: "/gestao?tab=agendamentos",
        icon: Calendar,
      },
      {
        name: "Centro de Custos",
        href: "/gestao?tab=centro-custos",
        icon: Package,
      },
      {
        name: "Relatórios",
        href: "/gestao?tab=relatorios",
        icon: BarChart3,
      },
      {
        name: "Configurações",
        href: "/gestao?tab=configuracoes",
        icon: Settings,
      },
    ],
  },
  {
    name: "Usuários",
    href: "/usuarios",
    icon: Users,
    current: false,
  },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = useLocation().pathname;
  const [expandedItems, setExpandedItems] = useState<string[]>(["Gestão"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">SimulaMed</h1>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isExpanded = expandedItems.includes(item.name);
                const hasSubItems = item.subItems && item.subItems.length > 0;

                return (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      onClick={(e) => {
                        if (hasSubItems) {
                          e.preventDefault();
                          toggleExpanded(item.name);
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      {hasSubItems && (
                        isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      )}
                    </Link>

                    {/* Sub-items */}
                    {hasSubItems && isExpanded && (
                      <div className="mt-1 ml-6 space-y-1">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                                pathname === subItem.href
                                  ? "bg-blue-100 text-blue-700"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <SubIcon className="mr-3 h-4 w-4" />
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@simulamed.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}