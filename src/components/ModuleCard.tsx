import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  shortDescription: string;
  fullDescription: string;
  onLearnMore?: (message: string) => void;
  onHover?: (isHovering: boolean) => void;
}

const ModuleCard = ({ icon, title, shortDescription, fullDescription, onLearnMore, onHover }: ModuleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onHover?.(false);
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLearnMore) {
      onLearnMore(`Olá! Gostaria de saber mais sobre o módulo ${title}. Pode me explicar os recursos e benefícios?`);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative bg-card border border-border rounded-xl p-6 cursor-pointer transition-all duration-300 overflow-hidden group",
        "hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/40 hover:-translate-y-2",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        isExpanded && "ring-2 ring-primary/20 shadow-xl shadow-primary/10 -translate-y-2"
      )}
    >
      <div className="relative z-10 flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 ease-out",
          "bg-gradient-to-br from-primary/20 to-primary/5 text-primary",
          "group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-105"
        )}>
          <div className="transition-transform duration-500 ease-out group-hover:scale-110">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-card-foreground line-clamp-1">{title}</h3>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0",
                isExpanded && "rotate-180"
              )}
            />
          </div>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 min-h-[2.5rem]">{shortDescription}</p>
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
            <p className="text-muted-foreground leading-relaxed text-sm mb-4">{fullDescription}</p>
            <Button 
              size="sm" 
              onClick={handleLearnMore}
              className="w-full"
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
