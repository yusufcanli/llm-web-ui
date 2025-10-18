'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { use, useEffect, useMemo, useState } from "react";
import useChatStore from "@/store/chatStore";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import PromptDialog from "@/components/PromptDialog";


export default function Home() {
  const chatStore = useChatStore()

  const [messageInput, setMessageInput] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const chats = useChatStore(state => {
    return state.aiChats.reverse()
  })

  const currentChat = useChatStore(state => state.currentChat)
  const quickPrompts = useChatStore(state => state.quickPrompts)
  const aiResponding = useChatStore(state => state.aiResponding)
  const models = useChatStore(state => state.models)

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

function setApiRoute(e) {
  const apiRoute = e.target.children.apiRoute.value
  const setApiRoute = useChatStore.getState().setApiRoute
  setApiRoute(apiRoute)
  location.reload()
}

function downloadChat() {
  const chat = currentChat
  //download
}

async function addNewChat() {
  currentChat.id = 0
}

async function selectChat(chatId: number) {
  const setCurrentChat = useChatStore.getState().setCurrentChat
  await setCurrentChat(chatId)
}

async function createChat(message: string) {
  const addNewChat = useChatStore.getState().addNewChat
  await addNewChat(message, systemPrompt)
}

async function deleteChat(chatId: number) {
  const deleteChat = useChatStore.getState().deleteChat
  await deleteChat(chatId)
}

async function stopAiResponse() {
  aiResponding.controller?.abort()
}

async function sendMessage() {
  const addUserMessage = useChatStore.getState().addUserMessage
  if(resizeEditor) {
    setResizeEditor(false)
  }
  const  msg = messageInput
  setMessageInput('')
  if(currentChat.id) {
    const newMessage = {role: "user", content: msg, date: Date.now()}
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
  }, [])
return (
  <SidebarProvider>
    <AppSidebar />
    <main className="w-full">
      <SidebarTrigger />
      <div className="container">
        { !chats.length && (<h1 v-if="!chats.length" className="my-5">Start A New Conversation</h1>) }
        <div className="text-lg bg-[#111111] py-10 px-5 rounded-lg">
          {
            !!currentChat.id && (
              <div>
                <span className="text-xxl">currentChat.name</span>
                <div className="ops flex gap-2 mb-3">
                  <button onClick={downloadChat} className="button text-sm py-1">Download</button>
                  <button onClick={() => deleteChat(currentChat.id)} className="button red text-sm py-1">Remove</button>
                </div>
              </div>
            )
          }
          <PromptDialog />
        </div>
        <div className="chat w-full my-3 p-3">
          {
            currentChat.messages.map((message, m_i) => (
              <div
                key={m_i}
                className={`my-3 w-full p-3 ${message.role === 'assistant' ? messageClasses.assistant : messageClasses.user}`}
              >
                <div className="flex flex-col sm:flex-row">
                  {
                    message.role === 'assistant' ? (
                      <div v-if="" className="min-h-[30px] min-w-[30px] h-[30px] w-[30px] border rounded-full flex items-center justify-center text-[20px]">
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
                          <textarea v-model="editMessageContent.content" className="h-[50vh]"></textarea>
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
                  <div className="flex items-center gap-2">
                    <button className="focus:text-[--green]" onClick={() => editMessage(message)}><Icon icon="mage:edit" /></button>
                    <button className="focus:text-[--green]" onClick={() => copyMessage(message.content)}><Icon icon="mynaui:copy" /></button>
                    <button v-if="m_i > 1" className="focus:text-[--red]" onClick={() => removeMessage(message.date)}><Icon icon="material-symbols:delete-outline" /></button>
                  </div>
                  <div className="text-xs">{timeFilter(message.date)}</div>
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
                      aiResponding.response && (
                        <div v-if="aiResponding.response" className="whitespace-break-spaces mt-3 sm:mt-0 sm:ml-3">
                          <span>aiResponding.response<Icon className="inline mb-0.5 ml-[2px] text-[--green]" icon="pepicons-pencil:line-y" /></span>
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
        <div className="bg-[#111111]">
          <div className={`editor px-3 rounded-lg flex items-start gap-2 ${resizeEditor && 'resize'}`}>
            <div className="w-full textarea-wrapper">
              <textarea v-model="messageInput" className="bg-transparent border-0 p-[12px] h-[200px]"></textarea>
            </div>
            <div className="editor-ops flex flex-col gap-1 py-3">
              <button onClick={() => setResizeEditor(prev => (!prev))} className="button !bg-white rounded-sm !text-black !p-3"><Icon icon="clarity:resize-line" /></button>
              <button onClick={() => sendMessage()} className="button green rounded-sm !p-3"><Icon icon="material-symbols:send" /></button>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="mr-3">
              messageInputTokens Ts
            </div>
          </div>
        </div>
      </div>
    </main>
  </SidebarProvider>
  );
}
