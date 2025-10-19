'use client'

import { Icon } from "@iconify/react"
import useChatStore from "@/store/chatStore"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import * as React from "react"

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





  const { quickPrompts, removePrompt, addNewPrompt, setSystemPrompt } = useChatStore()

  const [ systemPromptInput, setSystemPromptInput ] = useState('')
  const [systemDialogOpen, setSystemDialogOpen] = useState(false)
  const [ quickPromptDialogOpen, setQuickPromptDialogOpen ] = useState(false)
  const [ newQuickPrompt, setNewQuickPrompt ] = useState('')

  async function createNewPrompt(e: React.FormEvent) {
    e.preventDefault()
    await addNewPrompt(newQuickPrompt)
    setNewQuickPrompt('')
    setQuickPromptDialogOpen(false)
  }

  async function doSetSystemPrompt(e: React.FormEvent) {
    e.preventDefault()
    setSystemPrompt(systemPromptInput)
    setSystemPromptInput('')
    setSystemDialogOpen(false)
  }

  return (
    <>
    
    <Dialog open={systemDialogOpen} onOpenChange={setSystemDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span>{ currentModel }</span>
          <Icon icon="iconamoon:settings-thin" />
        </Button>
      </DialogTrigger>
      <DialogContent className="block sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Model Settings</DialogTitle>
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
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog open={quickPromptDialogOpen} onOpenChange={setQuickPromptDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add A Quick Prompt:</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <form className="text-right" onSubmit={(e) => createNewPrompt(e)}>
            <textarea onChange={(e) => setNewQuickPrompt(e.target.value)} required className="w-full min-h-[100px] bg-black px-2 py-1" name="" id="" placeholder="You are a helpful assistant."></textarea>
            <Button className="mt-1" type="submit">Add</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
