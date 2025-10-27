"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Eye } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  tabs: Array<{
    value: string;
    label: string;
    status: "completo" | "ativo" | "incompleto";
  }>;
  onTabChange: (tab: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const TabNavigation = ({
  activeTab,
  tabs,
  onTabChange,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: TabNavigationProps) => {
  const getTabIcon = (status: string) => {
    switch (status) {
      case "completo":
        return <CheckCircle className="h-3 w-3" />;
      case "incompleto":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTabLabel = (tab: typeof tabs[0]) => {
    if (tab.value === "revisao") {
      return (
        <div className="flex items-center gap-2">
          <Eye className="h-3 w-3" />
          {tab.label}
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        {getTabIcon(tab.status)}
        {tab.label}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div 
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            } first:rounded-l-md last:rounded-r-md`}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          Anterior
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!canGoNext}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default TabNavigation;