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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("home.categoryCard");
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
        <CardHeader className="p-2 flex flex-row items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-[90%] mt-1" />
        </CardContent>
        <CardFooter className="p-2 border-t flex justify-end items-center">
          <Skeleton className="h-6 w-24 rounded-md" />
        </CardFooter>
      </Card>
    );
  }

  // 错误状态处理
  if (error) {
    return (
      <Card className="overflow-hidden h-full border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30">
        <CardHeader className="p-2.5">
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-1.5" />
            <CardTitle className="text-sm">{t("loadError")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <Alert
            variant="destructive"
            className="bg-transparent border-red-300 dark:border-red-800 p-2"
          >
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="p-2.5 border-t border-red-200 dark:border-red-900/30 flex justify-end items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-red-600 border-red-300 hover:bg-red-100 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 h-7 text-xs"
          >
            <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
            {t("retryButton")}
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
        {" "}
        <CardHeader className="p-1 flex flex-row items-center gap-1.5">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: DURATION.fast }}
            className="p-0.5 rounded-md bg-primary/10 text-primary"
          >
            {icon}
          </motion.div>{" "}
          <div>
            <CardTitle className="text-xs">{title}</CardTitle>
            <motion.div
              className="text-[9px] text-muted-foreground mt-0.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {" "}
                <motion.span
                  key={count}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: DURATION.fast }}
                >
                  {count} {t("applications")}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
        </CardHeader>{" "}
        <CardContent className="p-1 pt-0 flex-1">
          <CardDescription className="text-[9px] line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-1 flex justify-end items-center border-t">
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
                  "transition-all group-hover:bg-primary group-hover:text-primary-foreground relative overflow-hidden h-7 text-xs",
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
                    />{" "}
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                    {t("launchSoftware")}
                  </>
                ) : (
                  <>
                    {t("explore")}
                    <ArrowRight className="ml-1.5 h-3 w-3" />
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
