'use client'

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { Icon } from "@iconify/react"
import useChatStore from "@/store/chatStore"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ChangeNameDialog from "./ChangeNameDialog"
import { useState } from "react"
 
export function AppSidebar() {
  const { setCurrentChat, clearCurrentChat, uploadChat, removeChat, currentChat } = useChatStore()

  const [changeNamePayload, setChangeNamePayload] = useState({
    chatId: 0,
    currentName: ''
  })

  const chats = useChatStore(state => {
    return state.aiChats.reverse()
  })

  async function selectChat(chatId: number) {
    await setCurrentChat(chatId)
  }

  async function deleteChat(chatId: number) {
    await removeChat(chatId)
  }

  async function changeChatName(chatId: number, currentName: string) {
    setChangeNamePayload({ chatId, currentName})
  }

  async function addNewChat() {
    clearCurrentChat()
  }

  function openUploadInput() {
    const uploadInput = document.querySelector('#chat_upload') as HTMLInputElement
    if(uploadInput) {
      uploadInput.click()
    }
  }

  function doUploadChat({ target }: React.ChangeEvent<HTMLInputElement>) {
    const files = target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if(typeof reader.result !== 'string') {
        //setNotification.error('Invalid file content');
        return;
      }
      uploadChat(reader.result)
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      //setNotification.error(error.message);
    };
  }


  return (
    <Sidebar>
      <ChangeNameDialog changeNamePayload={changeNamePayload} setChangeNamePayload={setChangeNamePayload} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
        <div className=" flex w-full justify-between items-center mb-3">
          <span>Chats</span>
          <DropdownMenu>
            <DropdownMenuTrigger><span className="text-lg"><Icon icon="material-symbols:add" /></span></DropdownMenuTrigger>
            <DropdownMenuContent>
              <input id="chat_upload" type="file" className="mt-1 hidden" onChange={doUploadChat} accept="application/json" />
              <DropdownMenuItem onClick={addNewChat}>New Chat</DropdownMenuItem>
              <DropdownMenuItem onClick={openUploadInput}>Upload Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <div className={`flex items-center justify-between w-full hover:bg-[#ffffff21] py-3 px-2 rounded-md ${currentChat.id === chat.id ? 'bg-[#ffffff21]' : ''}`}>
                      <span onClick={() => selectChat(chat.id!)} className="cursor-pointer w-[90%] text-left max-w-[90%] text-ellipsis overflow-hidden whitespace-nowrap">{ chat.name }</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <span className="text-lg">
                            <Icon icon="iconamoon:menu-kebab-vertical-fill" />
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <input id="chat_upload" type="file" className="mt-1 hidden" onChange={doUploadChat} accept="application/json" />
                          <DropdownMenuItem onClick={() => deleteChat(chat.id!)}>Delete</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeChatName(chat.id!, chat.name)}>Change Name</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}