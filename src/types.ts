export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  description: string;
  genres: string[];
  tags?: any[];
  posterGradient?: any;
  posterEmoji?: any;
  posterUrl?: any;
}
