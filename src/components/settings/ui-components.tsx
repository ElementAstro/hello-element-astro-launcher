// Common UI components for settings sections
import { motion } from "framer-motion";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { useTranslations } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { fadeIn, slideUp, spinAnimation } from "./animation-constants";

// Loading indicator component
export function LoadingIndicator({ message }: { message?: string }) {
  const { t } = useTranslations();
  message = message || t("common.loading");
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-8 space-y-4 text-muted-foreground"
    >
      <motion.div variants={spinAnimation} animate="animate">
        <Loader2 className="w-8 h-8" />
      </motion.div>
      <p>{message}</p>
    </motion.div>
  );
}

// Error state component
export function ErrorState({
  title,
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  const { t } = useTranslations();
  title = title || t("common.error.title");
  message = message || t("common.error.loadingSettings");
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-8 space-y-4 text-center"
    >
      <div className="rounded-full bg-destructive/20 p-3">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCcw className="w-4 h-4 mr-2" />
          {t("common.retry")}
        </Button>
      )}
    </motion.div>
  );
}

// Empty state component
export function EmptyState({
  title,
  message,
  icon: Icon,
}: {
  title?: string;
  message?: string;
  icon?: React.FC<{ className?: string }>;
}) {
  const { t } = useTranslations();
  title = title || t("common.emptyState.title");
  message = message || t("common.emptyState.message");
  const IconComponent = Icon || AlertCircle;

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-8 space-y-4 text-center text-muted-foreground"
    >
      <div className="rounded-full bg-muted p-3">
        <IconComponent className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </motion.div>
  );
}

// AnimatedCard wrapper component
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  ...props
}: AnimatedCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Status badge component
export function StatusBadge({
  status,
  message,
}: {
  status: "success" | "warning" | "error" | "info";
  message: string;
}) {
  const statusClasses = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}
    >
      {message}
    </motion.span>
  );
}

// Form field wrapper with animation and accessibility features
export function FormField({
  label,
  description,
  error,
  children,
  required = false,
  id,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  id: string;
}) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

// Progress indicator
export function ProgressIndicator({
  value,
  label,
  showPercentage = true,
}: {
  value: number;
  label?: string;
  showPercentage?: boolean;
}) {
  const clampedValue = Math.min(Math.max(0, value), 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
