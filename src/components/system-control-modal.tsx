"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Power, Moon, RefreshCw, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/store/store";
import type { SystemAction } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export function SystemControlModal() {
  const {
    isSystemModalOpen,
    setSystemModalOpen,
    reloadApplication,
    shutdownApplication,
  } = useAppStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<SystemAction | null>(
    null
  );

  const handleAction = async (action: SystemAction) => {
    setSelectedAction(action);
    setIsProcessing(true);

    try {
      switch (action) {
        case "reload":
          await reloadApplication();
          break;
        case "shutdown":
          await shutdownApplication();
          break;
        case "sleep":
          // Implement sleep functionality
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setSystemModalOpen(false);
          break;
        case "restart":
          // Implement restart functionality
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setSystemModalOpen(false);
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    } finally {
      setIsProcessing(false);
      setSelectedAction(null);
    }
  };

  // 按钮动画配置
  const buttonVariants = {
    idle: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, opacity: 1 },
    tap: { scale: 0.95, opacity: 0.9 },
    disabled: { opacity: 0.6 },
  };

  // 处理中状态动画配置
  const processingVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <Dialog open={isSystemModalOpen} onOpenChange={setSystemModalOpen}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>System Control</DialogTitle>
          <DialogDescription>
            Select an action to perform on the application.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <motion.div
            initial="idle"
            whileHover={isProcessing ? "disabled" : "hover"}
            whileTap={isProcessing ? "disabled" : "tap"}
            animate={
              isProcessing
                ? selectedAction === "reload"
                  ? "selected"
                  : "disabled"
                : "idle"
            }
            variants={buttonVariants}
          >
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-4 w-full"
              onClick={() => handleAction("reload")}
              disabled={isProcessing}
            >
              <motion.div
                animate={{
                  rotate: selectedAction === "reload" && isProcessing ? 360 : 0,
                }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RotateCcw className="h-8 w-8 mb-2" />
              </motion.div>
              <span>Reload</span>
            </Button>
          </motion.div>

          <motion.div
            initial="idle"
            whileHover={isProcessing ? "disabled" : "hover"}
            whileTap={isProcessing ? "disabled" : "tap"}
            animate={
              isProcessing
                ? selectedAction === "restart"
                  ? "selected"
                  : "disabled"
                : "idle"
            }
            variants={buttonVariants}
          >
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-4 w-full"
              onClick={() => handleAction("restart")}
              disabled={isProcessing}
            >
              <motion.div
                animate={{
                  rotate:
                    selectedAction === "restart" && isProcessing ? 360 : 0,
                }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RefreshCw className="h-8 w-8 mb-2" />
              </motion.div>
              <span>Restart</span>
            </Button>
          </motion.div>

          <motion.div
            initial="idle"
            whileHover={isProcessing ? "disabled" : "hover"}
            whileTap={isProcessing ? "disabled" : "tap"}
            animate={
              isProcessing
                ? selectedAction === "sleep"
                  ? "selected"
                  : "disabled"
                : "idle"
            }
            variants={buttonVariants}
          >
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-4 w-full"
              onClick={() => handleAction("sleep")}
              disabled={isProcessing}
            >
              <motion.div
                animate={
                  selectedAction === "sleep" && isProcessing
                    ? { opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Moon className="h-8 w-8 mb-2" />
              </motion.div>
              <span>Sleep</span>
            </Button>
          </motion.div>

          <motion.div
            initial="idle"
            whileHover={isProcessing ? "disabled" : "hover"}
            whileTap={isProcessing ? "disabled" : "tap"}
            animate={
              isProcessing
                ? selectedAction === "shutdown"
                  ? "selected"
                  : "disabled"
                : "idle"
            }
            variants={buttonVariants}
          >
            <Button
              variant="destructive"
              className="flex flex-col items-center justify-center h-24 p-4 w-full"
              onClick={() => handleAction("shutdown")}
              disabled={isProcessing}
            >
              <motion.div
                animate={
                  selectedAction === "shutdown" && isProcessing
                    ? { opacity: [1, 0.5, 1] }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Power className="h-8 w-8 mb-2" />
              </motion.div>
              <span>Shutdown</span>
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isProcessing && (
            <motion.div
              className="flex items-center justify-center p-2 bg-muted rounded-md"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={processingVariants}
              layout
            >
              <motion.span
                className="flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {selectedAction === "shutdown" && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                  </motion.div>
                )}
                {selectedAction === "reload" && (
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                )}
                {selectedAction === "restart" && (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                )}
                {selectedAction === "sleep" && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                  </motion.div>
                )}
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Processing {selectedAction} action...
                </motion.div>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter>
          <motion.div
            initial="idle"
            whileHover={isProcessing ? "disabled" : "hover"}
            whileTap={isProcessing ? "disabled" : "tap"}
            variants={buttonVariants}
          >
            <Button
              variant="secondary"
              onClick={() => setSystemModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
