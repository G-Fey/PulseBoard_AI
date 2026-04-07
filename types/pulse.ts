export interface Pulse {
  id: string;
  title: string;
  category: string;
  sourceName?: string;
  source?: string;
  date: string;
  isFavorite: boolean;
  summary: string[];
}
