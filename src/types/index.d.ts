export type Role = "user" | "assistant" | "system";

export type ModelType = {
  id: string;
  object: string;
  owned_by: string;
}

export type MessageType = {
  role: Role
  content: string;
  date: number;
}

export type ChatType = {
  name: string;
  id: number;
  model: string | null;
  messages?: MessageType[] | undefined;
  story?: string | undefined;
}