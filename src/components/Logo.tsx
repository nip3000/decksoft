import logoIcon from "@/assets/logo-d-bold.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ className, size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-10",
    md: "h-12",
    lg: "h-14",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <img
        src={logoIcon}
        alt="DeckSoft"
        className={`${sizeClasses[size]} w-auto`}
      />
      {showText && (
        <span className={`font-bold text-foreground ${textSizeClasses[size]}`}>
          DeckSoft
        </span>
      )}
    </div>
  );
};

export default Logo;
