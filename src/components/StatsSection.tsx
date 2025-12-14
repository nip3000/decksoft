import { useRef, useState, useEffect } from "react";
import { Building2, MapPin, Calendar, ThumbsUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsInView(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold text-primary">
      {count}{suffix}
    </span>
  );
};

const stats = [
  {
    icon: Building2,
    value: 500,
    suffix: "+",
    label: "Empresas ativas",
  },
  {
    icon: MapPin,
    value: 27,
    suffix: "",
    label: "Estados atendidos",
  },
  {
    icon: Calendar,
    value: 15,
    suffix: "+",
    label: "Anos no mercado",
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: "%",
    label: "Satisfação",
  },
];

const StatsSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <AnimatedSection className="px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:shadow-primary/10 hover:from-card hover:via-primary/5 hover:to-primary/10"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default StatsSection;
