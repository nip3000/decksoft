import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

const ModuleCard = ({ icon, title, shortDescription, fullDescription }: ModuleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "relative bg-card border border-border rounded-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden group",
        "hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        isExpanded && "ring-2 ring-primary/20 shadow-lg shadow-primary/10"
      )}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
          "bg-gradient-to-br from-primary/20 to-primary/5 text-primary",
          "group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0",
                isExpanded && "rotate-180"
              )}
            />
          </div>
          <p className="text-muted-foreground mt-1">{shortDescription}</p>
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 grid transition-all duration-300 ease-out",
          isExpanded ? "grid-rows-[1fr] mt-4 opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div 
            className={cn(
              "pt-4 border-t border-border/50 transition-all duration-300 ease-out",
              isExpanded ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            )}
          >
            <p className="text-muted-foreground leading-relaxed">{fullDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
