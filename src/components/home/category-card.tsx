import { useState } from "react";
import Link from "next/link";
import type React from "react";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cardVariants, buttonVariants, DURATION } from "./animation-constants";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  isLoading?: boolean;
  error?: string;
}

export function CategoryCard({
  title,
  description,
  icon,
  count,
  isLoading = false,
  error,
}: CategoryCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    // 模拟导航延迟
    setTimeout(() => {
      setIsNavigating(false);
      window.location.href = `/launcher?category=${encodeURIComponent(
        title.toLowerCase()
      )}`;
    }, 1000);
  };

  // 加载状态骨架屏
  if (isLoading) {
    return (
      <Card className="overflow-hidden h-full">
        <CardHeader className="p-4 flex flex-row items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%] mt-1" />
        </CardContent>
        <CardFooter className="p-4 border-t flex justify-end items-center">
          <Skeleton className="h-9 w-36 rounded-md" />
        </CardFooter>
      </Card>
    );
  }

  // 错误状态处理
  if (error) {
    return (
      <Card className="overflow-hidden h-full border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30">
        <CardHeader className="p-4">
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <CardTitle>加载错误</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Alert
            variant="destructive"
            className="bg-transparent border-red-300 dark:border-red-800"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="p-4 border-t border-red-200 dark:border-red-900/30 flex justify-end items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-red-600 border-red-300 hover:bg-red-100 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            重试加载
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="h-full"
      layout
    >
      <Card
        className={cn(
          "overflow-hidden h-full flex flex-col",
          hovered && "shadow-lg"
        )}
      >
        <CardHeader className="p-4 flex flex-row items-center gap-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: DURATION.fast }}
            className="p-2 rounded-md bg-primary/10 text-primary"
          >
            {icon}
          </motion.div>
          <div>
            <CardTitle>{title}</CardTitle>
            <motion.div
              className="text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={count}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: DURATION.fast }}
                >
                  {count} software items
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="p-4 flex justify-end items-center border-t">
          <Link
            href={`/launcher?category=${encodeURIComponent(
              title.toLowerCase()
            )}`}
            onClick={handleNavigate}
          >
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "transition-all group-hover:bg-primary group-hover:text-primary-foreground relative overflow-hidden",
                  isNavigating && "pointer-events-none"
                )}
                aria-label={`Browse ${title.toLowerCase()} category`}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <>
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-primary/20"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    浏览中...
                  </>
                ) : (
                  <>
                    Browse Category
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
