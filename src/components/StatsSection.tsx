import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
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
    <p ref={ref} className="text-3xl md:text-4xl font-bold text-primary">
      {count}{suffix}
    </p>
  );
};

const StatsSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <AnimatedSection className="px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <AnimatedCounter end={500} suffix="+" />
            <p className="text-sm text-muted-foreground">Empresas ativas</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={27} />
            <p className="text-sm text-muted-foreground">Estados atendidos</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={15} suffix="+" />
            <p className="text-sm text-muted-foreground">Anos no mercado</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={98} suffix="%" />
            <p className="text-sm text-muted-foreground">Satisfação</p>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default StatsSection;
