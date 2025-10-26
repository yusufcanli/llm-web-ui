'use client'

import { Icon } from "@iconify/react"
import useChatStore from "@/store/chatStore"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import PromptDialog from "./PromptDialog"
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

  const { currentModel, models, setModel } = useChatStore()

  const [systemDialogOpen, setSystemDialogOpen] = useState(false)


  return (
    <>
    <Dialog open={systemDialogOpen} onOpenChange={setSystemDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span>{ currentModel }</span>
          <Icon icon="iconamoon:settings-thin" />
        </Button>
      </DialogTrigger>
      <DialogContent  className="block sm:max-w-md">
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
                { models.map((model, m_i) => (
                  <SelectItem  key={m_i} value={model.id}>{ model.id }</SelectItem>
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
