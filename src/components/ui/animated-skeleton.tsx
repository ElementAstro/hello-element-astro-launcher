import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { HTMLMotionProps } from "framer-motion";

export const animationVariants = {
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  },
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
      },
    },
  },
  shimmer: {
    initial: {
      x: "-100%",
      opacity: 0.5,
    },
    animate: {
      x: "100%",
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

interface AnimatedSkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  shimmer?: boolean;
}

export const AnimatedSkeleton = ({ 
  className, 
  height = "100%", 
  width = "100%",
  shimmer = false 
}: AnimatedSkeletonProps) => {
  return (
    <motion.div className={cn(className)} initial="initial" animate="animate">
      <Skeleton className="relative overflow-hidden" style={{ height, width }}>
        {shimmer && (
          <motion.div
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            variants={animationVariants.shimmer}
            initial="initial"
            animate="animate"
          />
        )}
      </Skeleton>
    </motion.div>
  );
};

interface ContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export const SkeletonContainer = ({ children, ...props }: ContainerProps) => (
  <motion.div
    variants={animationVariants.staggerContainer}
    initial="hidden"
    animate="show"
    {...props}
  >
    {children}
  </motion.div>
);

export const SkeletonItem = ({ children, ...props }: ContainerProps) => (
  <motion.div
    variants={animationVariants.fadeIn}
    {...props}
  >
    {children}
  </motion.div>
);