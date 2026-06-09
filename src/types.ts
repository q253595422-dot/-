/**
 * TuanAgent Types Definition File
 */

export interface UserProfile {
  nickname: string;
  birthday: string;
  favoriteFood: string;
  hobby: string;
  anniversary: string;
  metDays: number;
}

export interface IntimacyState {
  level: number;
  points: number;
  maxPoints: number;
  title: string;
}

export interface CompanionStatus {
  energy: number; // 0 - 100
  mood: string;   // 开心, 撒娇中, 专心, 害羞, 稍微有些困
  outfit: string; // 经典日常, 温柔学伴
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface Letter {
  id: string;
  title: string;
  date: string;
  content: string;
  isUnlocked: boolean;
  topicKey: string;
}

export interface Moment {
  id: string;
  date: string;
  time: string;
  content: string;
  imageType: "park" | "cook" | "read" | "cafe";
  likes: number;
  hasLiked: boolean;
  comments: Array<{
    id: string;
    author: string;
    content: string;
  }>;
}

export interface VoicePack {
  id: string;
  title: string;
  caption: string;
  lyrics: string;
  audioDuration: string;
}
