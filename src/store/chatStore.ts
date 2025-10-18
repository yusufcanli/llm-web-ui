import { create } from "zustand";
import { ChatType, MessageType, ModelType } from "@/types";
import DB from "@/lib/db";

export type Role = "user" | "assistant" | "system";

const currentChatInstance: ChatType = {
  name: '',
  id: 0,
  model: '',
  messages: [],
  story: ''
}

interface ChatState {
  apiRoute: string | null;
  models: ModelType[];
  quickPrompts: string[];
  currentModel: string | null;
  aiChats: ChatType[];
  currentChat: ChatType
  aiResponding: {
    response: string;
    loading: boolean;
    controller: AbortController | null;
  }

  setApiRoute: (route: string) => void;
  getModels: () => Promise<void>;
  setModel: (modelId: string) => Promise<void>;
  getChats: () => Promise<void>;
  addNewChat: (userPrompt: string, systemPrompt: string) => Promise<void>;
  setCurrentChat: (chatId: number) => Promise<void>;
  getAChat: (chatId: number) => Promise<MessageType[]>;
  getAChatStory: (chatId: number) => Promise<string>;
  setAChatStory: (chatId: number, story: string) => Promise<void>;
  removeChat: (chatId: number) => Promise<void>;
  updateChatName: (id: number, name: string) => Promise<void>;
  uploadChat: (chat: string) => Promise<void>;
  addUserMessage: (message: MessageType) => Promise<void>;
  addAiMessage: (message: MessageType) => Promise<void>;
  editMessage: (edited: MessageType) => Promise<void>;
  removeMessage: (messageDate: number) => Promise<void>;
  setSystemPrompt: (systemPrompt: string) => Promise<void>;
  addNewPrompt: (prompt: string) => Promise<void>;
  removePrompt: (index: number) => Promise<void>;
  sendMessage: (messages: MessageType[]) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  apiRoute: localStorage.getItem('apiRoute'),
  models: [],
  quickPrompts: [],
  currentModel: '',
  aiChats: [],
  currentChat: {...currentChatInstance},
  aiResponding: {
    response: '',
    loading: false,
    controller: null
  },

  setApiRoute(route: string) {
    set(({ apiRoute: route }))
    localStorage.setItem('apiRoute', route)
  },
  async getModels() {
    set(({apiRoute: 'http://192.168.1.5:1234'}))
    const prompts = (await DB.getItem('aiPrompts') || []) as string[]
    set(({ quickPrompts: prompts }))
    const response = await fetch(`${get().apiRoute}/v1/models?cache=${Date.now()}`)
    const allModels = await response.json()
    set(({ models: allModels.data }))
    const savedModel = localStorage.getItem('currentModel')
    const findModel = get().models.find(m => m.id === savedModel)
    const model = findModel ? savedModel : get().models[0].id
    set(({ currentModel: model }))
  },
  async setModel(modelId: string) {
    const store = useChatStore.getState()
    if(!store.currentChat.model) {
      set(({ currentModel: modelId }))
    } else {
      const findChat = store.aiChats.find(c => c.id === store.currentChat.id)
      if(!findChat) return
      const updatedCurrentChat = { ...findChat, model: modelId }
      set(({ currentChat: updatedCurrentChat }))
      await DB.setItem('aiChats', store.aiChats)
    }
    localStorage.setItem('currentModel', modelId)
  },
  async getChats() {
    const aiChats = (await DB.getItem('aiChats') || []) as ChatType[]
    set({ aiChats })
  },
  async addNewChat(userPrompt: string, systemPrompt: string) {
    const state = useChatStore.getState()
    const newChat: ChatType = { name: userPrompt.slice(0, 50), id: Date.now(), model: state.currentModel, story: '' }
    const systemMessage: MessageType = { role: "system", content: systemPrompt, date: (Date.now() - 10) }
    const userMessage: MessageType = { role: "user", content: userPrompt, date: Date.now() }
    const messages = [systemMessage, userMessage]
    set((s) => ({ aiChats: [ ...s.aiChats, newChat ] }))
    await DB.setItem((newChat.id + '_chats'), messages)
    await DB.setItem('aiChats', this.aiChats)
    set({currentChat: {...newChat, messages}})
    await this.sendMessage(messages)
  },
  async setCurrentChat(chatId: number) {
    const chat = this.aiChats.find(c => c.id === chatId) as ChatType
    if(!chat) return;
    const messages = await this.getAChat(chatId)
    const story = await this.getAChatStory(chatId)
    set({ currentChat: {...chat, messages, story}})
  },
  async getAChat(chatId: number) {
    return await DB.getItem((chatId + '_chats')) || []
  },
  async getAChatStory(chatId: number) {
    return await DB.getItem((chatId + '_story')) || ''
  },
  async setAChatStory(chatId: number, story: string) {
    await DB.setItem((chatId + '_story'), story)
  },
  async removeChat(chatId: number) {
    const { currentChat, aiChats } = get()
    if(currentChat.id === chatId) {
      set({ currentChat: {...currentChatInstance} })
    }
    const filteredChats = aiChats.filter(c => c.id !== chatId)
    set({ aiChats: filteredChats })
    await DB.removeItem((chatId + '_chats'))
    if(!filteredChats.length) {
      await DB.removeItem('aiChats')
    } else {
      await DB.setItem('aiChats', filteredChats)
    }
  },
  async updateChatName(id: number, name: string) {
    const { currentChat, aiChats } = get()
    const chats = [...aiChats]
    const chat = chats.find(c => c.id === id)
    if(!chat) return
    chat.name = name
    set({ aiChats: chats })
    await DB.setItem('aiChats', [...chats])
    if(currentChat.id === id) {
      set(({ currentChat: { ...currentChat, name } }))
    }
  },
  async uploadChat(chat: string) {
    const parsedChat: ChatType = JSON.parse(chat)
    const newChat = { name: parsedChat.name, id: parsedChat.id, model: parsedChat.model }
    set((s) => ({ aiChats: [ ...s.aiChats, newChat ] }))
    await DB.setItem((newChat.id + '_chats'), parsedChat.messages)
    await DB.setItem('aiChats', this.aiChats)
    if(parsedChat.story) {
      await get().setAChatStory(parsedChat.id, parsedChat.story)
    }
    set({ currentChat: { ...parsedChat }})
  },

  async addUserMessage(message: MessageType) {
    const state = useChatStore.getState()
    const messages = await get().getAChat(state.currentChat.id)
    messages.push(message)
    set((s) => {
      const currentMessages = s.currentChat.messages || []
      return {
        currentChat: {...s.currentChat,  messages: [...currentMessages, message]}
      }
    })
    await DB.setItem((state.currentChat.id + '_chats'), messages)
    await get().sendMessage(messages)
  },
  async addAiMessage(message: MessageType) {
    set((s) => {
      const currentMessages = s.currentChat.messages || []
      return {
        currentChat: {...s.currentChat,  messages: [...currentMessages, message]}
      }
    })
    const state = useChatStore.getState()
    await DB.setItem((state.currentChat.id + '_chats'), state.currentChat.messages)
  },
  async editMessage(edited: MessageType) {
    const state = useChatStore.getState()
    if(!state.currentChat.messages) return;
    const messages = [...state.currentChat.messages]
    const message = messages.find(m => m.date === edited.date)
    if(!message) return;
    message.content = edited.content
    set((s) => ({ currentChat: { ...s.currentChat, messages } }))
    await DB.setItem((this.currentChat.id + '_chats'), messages)
  },
  async removeMessage(messageDate: number) {
    const state = useChatStore.getState()
    if(!state.currentChat.messages) return;
    const messages = state.currentChat.messages.filter(m => m.date !== messageDate)
    set((s) => ({ currentChat: { ...s.currentChat, messages } }))
    await DB.setItem((this.currentChat.id + '_chats'), messages)
  },

  async setSystemPrompt(systemPrompt: string) {
    const state = useChatStore.getState()
    if(!state.currentChat.id || !state.currentChat.messages) return;
    const messages = [...state.currentChat.messages]
    const sys = messages.find(m => m.role === "system")
    if(!sys) return;
    sys.content = systemPrompt
    await DB.setItem((this.currentChat.id + '_chats'), messages)
    set((s) => ({ currentChat: { ...s.currentChat, messages } }))
  },
  async addNewPrompt(prompt: string) {
    set((s) => ({ quickPrompts: [...s.quickPrompts, prompt] }))
    await DB.setItem('aiPrompts', [...get().quickPrompts])
  },
  async removePrompt(index: number) {
    const state = useChatStore.getState()
    const prompts = state.quickPrompts.filter((p,i) => i !== index)
    set(({ quickPrompts: prompts }))
    await DB.setItem('aiPrompts', [...prompts])
  },

  async sendMessage(messages: MessageType[]) {
    const state = useChatStore.getState()
    const filteredMessages = messages.map(m => ({role: m.role, content: m.content}))
    const aiResponding = {
      response: '',
      loading: true,
      controller: new AbortController()
    }
    set({ aiResponding })
    const res = await fetch(`${this.apiRoute}/v1/chat/completions?cache=${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.currentModel,
        messages: filteredMessages,
        stream: true,
      }),
      signal: (state.aiResponding.controller as AbortController).signal
    })

    if(!res?.body) {
      aiResponding.loading = false
      set({ aiResponding })
      return
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      let result
      try {
        result = await reader.read()
      } catch (err) {
        const error = err as Error
        if (error.name === "AbortError") {
          if (state.aiResponding.response.trim()) {
            await get().addAiMessage({ role: "assistant", content: aiResponding.response, date: Date.now() })
          }
          set({ aiResponding: {...aiResponding, loading: false} })
          break
        }
        throw error // some other error
      }
      const { done, value } = result
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n").filter(l => l.trim().startsWith("data: "))
      
      for (const line of lines) {
        const jsonStr = line.replace(/^data:\s*/, "")
        if (jsonStr === "[DONE]") continue
      
        try {
          const json = JSON.parse(jsonStr)
      
          // partial content
          if (json.choices?.[0]?.delta?.content) {
            this.aiResponding.response += json.choices?.[0]?.delta?.content
          }
      
          // end of stream
          if (json.choices?.[0]?.finish_reason === "stop") {
            await get().addAiMessage({ role: "assistant", content: this.aiResponding.response, date: Date.now() })
            set({ aiResponding: {...aiResponding, loading: false} })
          }
        } catch (err) {
          console.error("Parse error:", err)
        }
      }        
    }
  },

})
);

export default useChatStore;