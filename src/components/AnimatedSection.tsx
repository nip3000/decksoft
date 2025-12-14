import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale";
  delay?: number;
}

const AnimatedSection = ({
  children,
  className,
  animation = "fade-up",
  delay = 0,
}: AnimatedSectionProps) => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const animationClass = {
    "fade-up": "animate-on-scroll",
    "fade-left": "animate-on-scroll-left",
    "fade-right": "animate-on-scroll-right",
    scale: "animate-on-scroll-scale",
  }[animation];

  return (
    <div
      ref={ref}
      className={cn(animationClass, isInView && "in-view", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
