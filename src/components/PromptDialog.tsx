'use client'

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
import { Icon } from "@iconify/react"
import useChatStore from "@/store/chatStore"
import { useState } from "react"

export default function PromptDialog() {

  const { systemPrompt, quickPrompts, removePrompt, addNewPrompt, setSystemPrompt } = useChatStore()

  const [ systemPromptInput, setSystemPromptInput ] = useState(systemPrompt)
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
    setSystemDialogOpen(false)
  }

  return (
    <>
    
    <Dialog open={systemDialogOpen} onOpenChange={setSystemDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start" variant="outline">
          <Icon className={`${systemPrompt.length && 'text-green-400'}`} icon="iconamoon:settings-thin" />
          System Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>System Prompt:</DialogTitle>
          <DialogDescription>
            Set the system prompt to guide the AI&apos;s behavior.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <form className="text-right" onSubmit={(e) =>  doSetSystemPrompt(e) }>
            <textarea value={systemPromptInput} onChange={(e) => setSystemPromptInput(e.target.value)} className="w-full min-h-[100px] bg-black px-2 py-1" name=""  placeholder="You're a helpful assistant."></textarea>
            <Button className="mt-1" type="submit">Save</Button>
          </form>
          <DialogHeader>
            <DialogTitle>Quick Prompts:</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 flex-wrap mt-3">
            {
              quickPrompts.map((prompt, p_i) => (
                <div key={`p_i${p_i}`} className="w-full bg-[#111111] p-3 text-sm">
                  <div className="w-full flex justify-end">
                    <span onClick={() => removePrompt(p_i)}><Icon icon="material-symbols:close" /></span>
                  </div>
                  <div className="cursor-pointer" onClick={() => setSystemPromptInput(prompt)}>{ prompt }</div>
                </div>
              ))
            }
            <div onClick={() => setQuickPromptDialogOpen(true)} className="w-full h-[58px] flex items-center justify-center bg-[#111111]">
              <span className="text-2xl"><Icon icon="material-symbols:add" /></span>
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
    <Dialog open={quickPromptDialogOpen} onOpenChange={setQuickPromptDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add A Quick Prompt:</DialogTitle>
          <DialogDescription>
            Add a new quick prompt for easy access. It will be saved for future use.
          </DialogDescription>
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
