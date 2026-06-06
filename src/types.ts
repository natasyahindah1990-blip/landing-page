/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Story {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  content: string[]; // split by paragraphs
  duration: string;
  likes: number;
  tags: string[];
  isHot?: boolean;
}

export type SoundType = 'rain' | 'heartbeat' | 'whisper' | 'crackle' | 'breeze' | 'breathing';

export interface AsmrTrack {
  id: string;
  name: string;
  description: string;
  iconName: string; // lucide icon identifier
  defaultVolume: number; // 0-100
  soundType: SoundType;
}

export interface PromptInput {
  vibe: string;
  character: string;
  location: string;
}
