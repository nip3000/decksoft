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
        "bg-card border border-border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50",
        isExpanded && "ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
          "grid transition-all duration-300",
          isExpanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-4 border-t border-border">
            <p className="text-muted-foreground leading-relaxed">{fullDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
