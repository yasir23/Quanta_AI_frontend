import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8"
};

export function LoadingSpinner({ className, size = "md", text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

export function LoadingCard({ title, description }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <LoadingSpinner size="lg" />
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
    </div>
  );
}

export function LoadingOverlay({ isVisible, text }: { isVisible: boolean; text?: string }) {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
