'use client'

import { Icon } from "@iconify/react"
import useChatStore from "@/store/chatStore"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import PromptDialog from "./PromptDialog"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function ModelDialog() {

  const { currentModel, models, setModel, llmConfig, updateLlmConfig } = useChatStore()

  const [systemDialogOpen, setSystemDialogOpen] = useState(false)


  return (
    <>
      <Dialog open={systemDialogOpen} onOpenChange={setSystemDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <span>{currentModel}</span>
            <Icon icon="iconamoon:settings-thin" />
          </Button>
        </DialogTrigger>
        <DialogContent className="block sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Model Settings</DialogTitle>
            <DialogDescription>
              You can select the model you want to use for the current chat and the next chats.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full my-3">
            <Select onValueChange={(value) => setModel(value)} defaultValue={currentModel as string}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>LLM Models</SelectLabel>
                  {models.map((model, m_i) => (
                    <SelectItem key={m_i} value={model.id}>{model.id}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full my-5 flex flex-col gap-2">
            <DialogHeader>
              <DialogTitle>System Prompt Settings</DialogTitle>
              <DialogDescription>
                Set the system prompt to guide the AI&apos;s behavior.
              </DialogDescription>
            </DialogHeader>
            <PromptDialog />
          </div>

          <div className="w-full my-5 flex flex-col gap-2">
            <DialogHeader>
              <DialogTitle>LLM Parameters</DialogTitle>
              <DialogDescription>
                Configure advanced parameters for the model. Leave blank for default values.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Temperature</label>
                <Input
                  type="number"
                  step="0.1"
                  value={llmConfig.temperature}
                  onChange={(e) => updateLlmConfig({ temperature: e.target.value })}
                  placeholder="0.7"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Top P</label>
                <Input
                  type="number"
                  step="0.1"
                  value={llmConfig.top_p}
                  onChange={(e) => updateLlmConfig({ top_p: e.target.value })}
                  placeholder="1.0"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium">Max Tokens</label>
                <Input
                  type="number"
                  step="1"
                  value={llmConfig.max_tokens}
                  onChange={(e) => updateLlmConfig({ max_tokens: e.target.value })}
                  placeholder="2048"
                />
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  checked={llmConfig.stream}
                  onChange={(e) => updateLlmConfig({ stream: e.target.checked })}
                  className="h-4 w-4"
                  id="stream-check"
                />
                <label htmlFor="stream-check" className="text-sm font-medium">Stream Response</label>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
