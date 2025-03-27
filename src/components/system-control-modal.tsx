"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RotateCcw, Power, Moon, RefreshCw, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { SystemAction } from "@/types"

export function SystemControlModal() {
  const { isSystemModalOpen, setSystemModalOpen, reloadApplication, shutdownApplication } = useAppStore()

  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAction, setSelectedAction] = useState<SystemAction | null>(null)

  const handleAction = async (action: SystemAction) => {
    setSelectedAction(action)
    setIsProcessing(true)

    try {
      switch (action) {
        case "reload":
          await reloadApplication()
          break
        case "shutdown":
          await shutdownApplication()
          break
        case "sleep":
          // Implement sleep functionality
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setSystemModalOpen(false)
          break
        case "restart":
          // Implement restart functionality
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setSystemModalOpen(false)
          break
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error)
    } finally {
      setIsProcessing(false)
      setSelectedAction(null)
    }
  }

  return (
    <Dialog open={isSystemModalOpen} onOpenChange={setSystemModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>System Control</DialogTitle>
          <DialogDescription>Select an action to perform on the application.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 p-4"
            onClick={() => handleAction("reload")}
            disabled={isProcessing}
          >
            <RotateCcw className="h-8 w-8 mb-2" />
            <span>Reload</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 p-4"
            onClick={() => handleAction("restart")}
            disabled={isProcessing}
          >
            <RefreshCw className="h-8 w-8 mb-2" />
            <span>Restart</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 p-4"
            onClick={() => handleAction("sleep")}
            disabled={isProcessing}
          >
            <Moon className="h-8 w-8 mb-2" />
            <span>Sleep</span>
          </Button>

          <Button
            variant="destructive"
            className="flex flex-col items-center justify-center h-24 p-4"
            onClick={() => handleAction("shutdown")}
            disabled={isProcessing}
          >
            <Power className="h-8 w-8 mb-2" />
            <span>Shutdown</span>
          </Button>
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center p-2 bg-muted rounded-md">
            <span className="animate-pulse flex items-center">
              {selectedAction === "shutdown" && <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />}
              {selectedAction === "reload" && <RotateCcw className="h-4 w-4 mr-2 animate-spin" />}
              {selectedAction === "restart" && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              {selectedAction === "sleep" && <Moon className="h-4 w-4 mr-2" />}
              Processing {selectedAction} action...
            </span>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={() => setSystemModalOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

