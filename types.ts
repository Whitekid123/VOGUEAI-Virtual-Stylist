export interface Outfit {
  id: string;
  style: 'Casual' | 'Business' | 'Night Out';
  imageUrl: string;
  description: string;
  timestamp: number;
}

export interface GeneratedImageResponse {
  imageUrl: string;
  description?: string;
}

export type AppState = 'upload' | 'analyzing' | 'results';
