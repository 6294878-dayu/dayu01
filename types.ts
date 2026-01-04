
export type GiftType = 'bouquet' | 'hug_bucket' | 'gift_box';

export type CompositionType = 'single' | 'double_bff' | 'couple' | 'multiple_bff' | 'none';

export type AIModel = 'gemini-2.5-flash-image' | 'gemini-2.5-flash-image-artistic';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface GenerationParams {
  model: AIModel;
  giftType: GiftType;
  size: number; // diameter in cm
  scene: string;
  style: string;
  composition: CompositionType;
}
