'use client'

import { Icon } from "@iconify/react"
import useChatStore from "@/store/chatStore"
import { useState, useEffect } from "react"
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

interface ChangeNameDialogProps {
  changeNamePayload: {
    chatId: number,
    currentName: string,
  }
  setChangeNamePayload: React.Dispatch<React.SetStateAction<{
    chatId: number,
    currentName: string,
  }>>
}


export default function ChangeNameDialog({ changeNamePayload, setChangeNamePayload }: ChangeNameDialogProps) {

  const { updateChatName } = useChatStore()

  async function changeName() {
    await updateChatName(changeNamePayload.chatId, newName)
    setChangeNamePayload({chatId: 0, currentName: ''})
  }

  const [newName, setNewName] = useState(changeNamePayload.currentName)

  useEffect(() => {
    setNewName(changeNamePayload.currentName)
  }, [changeNamePayload.currentName])

  return (
    <Dialog open={!!changeNamePayload.chatId} onOpenChange={() => setChangeNamePayload({chatId: 0, currentName: ''}) }>
      <DialogContent  className="block sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Name</DialogTitle>
          <DialogDescription>
            Enter a new name for the chat: <br />
            {changeNamePayload.currentName}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full my-3">
          <form onSubmit={(e) => { e.preventDefault(); changeName() }}>
            <input value={newName} required onChange={(e) => setNewName(e.target.value)} className="w-full bg-black p-2 rounded-sm" type="text" name="" id="" />
            <Button className="mt-2" type="submit">Save</Button>
          </form>
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
  )
}
