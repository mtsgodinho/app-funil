
export enum MessageType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string; // Text content or URL
  caption?: string; // For images/videos
  isFavorite?: boolean;
  order: number;
}

export interface FunnelStage {
  id: string;
  name: string;
  order: number;
  messages: Message[];
}

export interface Funnel {
  id: string;
  name: string;
  description: string;
  stages: FunnelStage[];
  createdAt: number;
}

export interface LeadContext {
  name: string;
  product: string;
  value: string;
  agent: string;
}
