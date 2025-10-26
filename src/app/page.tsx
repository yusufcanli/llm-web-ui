'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { use, useEffect, useMemo, useState } from "react";
import useChatStore from "@/store/chatStore";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import PromptDialog from "@/components/PromptDialog";
import ModelDialog from "@/components/ModelDialog";
import { MessageType } from "@/types";
import ErrorDialog from "@/components/ErrorDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Home() {
  const chatStore = useChatStore()

  const [openSidebar, setOpenSidebar] = useState(false)
  const [initialzed, setInitialized] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const messageInputTokens = useMemo(() => tokenCounter(messageInput), [messageInput])
  const chats = useChatStore(state => {
    return state.aiChats.reverse()
  })

  const currentChat = useChatStore(state => state.currentChat)
  const aiResponding = useChatStore(state => state.aiResponding)
  const serverError = useChatStore(state => state.serverError)

  const [resizeEditor, setResizeEditor] = useState(false)
  const [editMessageContent, setEditMessageContent] = useState({
    index: 0,
    content: '',
    date: 0
  })

  const messageClasses = {
    assistant: 'received bg-[#ffffff17] rounded-md',
    user: 'sent'
  }

function downloadChat() {
  const blob = new Blob([JSON.stringify(currentChat)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = currentChat.name + '.json';
  link.click();
  URL.revokeObjectURL(url);
}

function tokenCounter(input: string) {
  return Math.ceil(input.length / 4)
}

async function createChat(message: string) {
  const addNewChat = useChatStore.getState().addNewChat
  await addNewChat(message)
}

async function deleteChat(chatId: number) {
  const removeChat = useChatStore.getState().removeChat
  await removeChat(chatId)
}

async function stopAiResponse() {
  aiResponding.controller?.abort()
}

async function sendMessage() { 
  const addUserMessage = useChatStore.getState().addUserMessage
  if(resizeEditor) {
    setResizeEditor(false)
  }
  const msg = messageInput
  setMessageInput('')
  if(currentChat.id) {
    const newMessage = {role: "user", content: msg, date: Date.now()} as MessageType
    await addUserMessage(newMessage)
  } else {
    createChat(msg)
  }
}

function doEditMessage() {

}

function editMessage(message) {

}

function copyMessage(content: string) {

}

function removeMessage(messageDate: number) {

}

function timeFilter(mDate: number) {
  return new Date(mDate).toLocaleString(navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function stopAiResponse() {

}

  useEffect(() => {
    chatStore.getModels()
      .then(() => setInitialized(true))
  }, [])

  useEffect(() => {
    setOpenSidebar(chats.length > 0)
  }, [chats])

  if(!initialzed) {
    return;
  }

  if(serverError) {
    return <ErrorDialog />
  }

return (
  <SidebarProvider open={openSidebar}>
    <AppSidebar />
    <main className="w-full">

      
      { chats.length > 0 && (<SidebarTrigger />) }
      <div className="container">
        { chats.length < 1 && (<h1 className="mb-5 mt-[10%]">Start A New Conversation</h1>) }
        <div className="text-lg bg-[#111111] py-10 px-5 rounded-lg">
          {
            !!currentChat.id && (
              <div className="w-full flex justify-between items-center mb-5">
                <div>
                  <h1>{ currentChat.name }</h1>
                  <span className="text-sm text-gray-400">{tokenCounter(currentChat.messages!.join(''))} tokens</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Icon icon="iconamoon:menu-kebab-vertical-fill" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={downloadChat}>Download</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteChat(currentChat.id!)}>Remove Chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          }
          <PromptDialog />
        </div>
        <div className="chat w-full my-3 p-3">
          {
            currentChat.messages?.map((message, m_i) => (
              <div
                key={m_i}
                className={`my-3 w-full p-3 ${message.role === 'system' && 'hidden'} ${message.role === 'assistant' ? messageClasses.assistant : messageClasses.user}`}
              >
                <div className="flex flex-col sm:flex-row">
                  {
                    message.role === 'assistant' ? (
                      <div className="min-h-[30px] min-w-[30px] h-[30px] w-[30px] border rounded-full flex items-center justify-center text-[20px]">
                        <Icon icon="hugeicons:ai-network" />
                      </div>
                    ) : (
                      <div className="min-h-[30px] min-w-[30px] h-[30px] w-[30px] border rounded-full flex items-center justify-center text-[20px]">
                        <Icon icon="material-symbols:person" />
                      </div>
                    )
                  }
                  <div className="w-full mt-3 sm:mt-0 sm:ml-3">
                    {
                      editMessageContent.date === message.date && (
                        <div className="contenteditable w-full mb-3">
                          <textarea onChange={(e) => setEditMessageContent(prev => ({...prev, content: e.target.value}))} className="h-[50vh]"></textarea>
                          <div className="w-full flex justify-end gap-2">
                            <button onClick={() => setEditMessageContent(prev => ({...prev, date: 0}))} className="button red">Disgard</button>
                            <button onClick={doEditMessage} className="button green">Save</button>
                          </div>
                        </div>
                      )
                    }
                    <div className="whitespace-break-spaces">{ message.content }</div>
                  </div>
                </div>
                <div className="mt-5 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <button className="focus:text-[--green]" onClick={() => editMessage(message)}>
                      <Icon icon="mage:edit" />
                    </button>
                    <button className="focus:text-[--green]" onClick={() => copyMessage(message.content)}>
                      <Icon icon="mynaui:copy" />
                    </button>
                    <button className="focus:text-red-500" onClick={() => removeMessage(message.date)}>
                      <Icon icon="material-symbols:delete-outline" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">{timeFilter(message.date)}</div>
                </div>
              </div>
            ))
          }
          {
            aiResponding.loading && (
              <div className={`my-3 w-full p-3 ${messageClasses.assistant}`}>
                <div className="flex flex-col sm:flex-row">
                  <div className="min-h-[30px] min-w-[30px] h-[30px] w-[30px] border rounded-full flex items-center justify-center text-[20px]">
                    <Icon icon="hugeicons:ai-network" />
                  </div>
                  <div className="w-full">
                    {
                      aiResponding.response.length > 0 && (
                        <div className="whitespace-break-spaces mt-3 sm:mt-0 sm:ml-3">
                          <span>{ aiResponding.response }<Icon className="inline mb-0.5 ml-[2px] text-[--green]" icon="pepicons-pencil:line-y" /></span>
                        </div>
                      )
                    }
                    <div className="text-[30px] mr-2 w-full flex justify-end">
                      <span className="mr-1">
                        <Icon icon="eos-icons:three-dots-loading" />
                      </span>
                      <button onClick={stopAiResponse}>
                        <Icon icon="mdi:stop-circle-outline" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className="bg-[#111111] mb-5">
          <div className={`editor px-3 rounded-lg flex items-start gap-2 ${resizeEditor && 'resize'}`}>
            <div className="w-full textarea-wrapper">
              <textarea onChange={(e) => setMessageInput(e.target.value)} className="w-full bg-transparent border-0 p-[12px] h-[200px]"></textarea>
            </div>
            <div className="editor-ops flex flex-col gap-1 py-3">
              <Button size="icon-lg" onClick={() => setResizeEditor(prev => (!prev))}><Icon icon="clarity:resize-line" /></Button>
              <Button size="icon-lg" onClick={() => sendMessage()}  className="bg-green-500 hover:bg-green-400 text-white"><Icon icon="material-symbols:send" /></Button>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <ModelDialog />
            <div className="mr-3 text-sm">
              {messageInputTokens} tokens
            </div>
          </div>
        </div>
      </div>
    </main>
  </SidebarProvider>
  );
}
