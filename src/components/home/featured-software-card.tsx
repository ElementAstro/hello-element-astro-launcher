import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Info, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cardVariants, DURATION, EASE } from "./animation-constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FeaturedSoftwareCardProps {
  title: string;
  description: string;
  icon: string;
  downloads: string;
  category: string;
  isLoading?: boolean;
}

export function FeaturedSoftwareCard({
  title,
  description,
  icon,
  downloads,
  category,
  isLoading = false,
}: FeaturedSoftwareCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    // 模拟启动操作的延迟
    setTimeout(() => {
      setIsLaunching(false);
    }, 2000);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // 加载状态骨架屏
  if (isLoading) {
    return (
      <Card className="overflow-hidden h-full">
        <CardHeader className="p-4 flex flex-row items-center gap-4">
          <Skeleton className="w-[60px] h-[60px] rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%] mt-2" />
        </CardContent>
        <CardFooter className="p-4 border-t flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-20 rounded-md" />
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
    >
      <Card
        className={cn(
          "overflow-hidden h-full flex flex-col",
          hovered && "shadow-lg"
        )}
      >
        <CardHeader className="p-4 flex flex-row items-center gap-4">
          <div className="relative">
            <Image
              src={imageError ? "/placeholder.svg" : icon || "/placeholder.svg"}
              alt={title}
              width={60}
              height={60}
              className="rounded-md"
              onError={handleImageError}
            />
            <motion.div
              className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 0.5,
                ease: EASE.bounce,
                delay: 0.2,
              }}
            >
              <Star className="h-3 w-3" />
            </motion.div>
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, x: -10 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Badge variant="secondary" className="mt-1">
                {category}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>

          <motion.div
            className="flex items-center justify-between mt-3 text-xs text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.normal, delay: 0.2 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center cursor-help">
                  <Info className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>Release: 2024.2</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>最近版本发布日期</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
              <span>4.8/5</span>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center border-t">
          <motion.div
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {downloads} downloads
          </motion.div>
          <AnimatePresence mode="wait">
            {isLaunching ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="relative overflow-hidden"
                >
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-primary/20"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "linear" }}
                  />
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  启动中
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Link
                  href={`/launcher?software=${encodeURIComponent(
                    title.toLowerCase()
                  )}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all group-hover:bg-primary group-hover:text-primary-foreground"
                    aria-label={`Launch ${title}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLaunch();
                    }}
                  >
                    Launch
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
