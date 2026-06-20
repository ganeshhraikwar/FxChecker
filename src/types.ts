export interface ConversionHistoryItem {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export interface FavoritePair {
  id: string;
  from: string;
  to: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ApiResponseData {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: Record<string, number>;
}
