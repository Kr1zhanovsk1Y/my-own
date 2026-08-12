const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const allParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'ru-RU',
    ...params,
  });
  const res = await fetch(`${BASE}${path}?${allParams}`);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
}

interface TmdbMovieList {
  results: TmdbMovie[];
  total_results: number;
  total_pages: number;
}

interface TmdbGenreList {
  genres: TmdbGenre[];
}

interface TmdbKeyword {
  id: number;
  name: string;
}

interface TmdbKeywordList {
  results: TmdbKeyword[];
}

let genreCache: TmdbGenre[] | null = null;

export async function getGenres(): Promise<TmdbGenre[]> {
  if (genreCache) return genreCache;
  const data = await tmdbFetch<TmdbGenreList>('/genre/movie/list');
  genreCache = data.genres;
  return data.genres;
}

export function posterUrl(path: string | null, size = 'w500'): string {
  if (!path) return '';
  return `${IMAGE_BASE}/${size}${path}`;
}

export async function searchKeywords(query: string): Promise<TmdbKeyword[]> {
  const data = await tmdbFetch<TmdbKeywordList>('/search/keyword', { query });
  return data.results.slice(0, 10);
}

export async function discoverByKeywordsAndGenres(
  keywordIds: number[],
  genreIds: number[],
): Promise<TmdbMovie[]> {
  const params: Record<string, string> = {
    sort_by: 'vote_average.desc',
    'vote_count.gte': '50',
  };
  if (keywordIds.length > 0) {
    params.with_keywords = keywordIds.join(',');
  }
  if (genreIds.length > 0) {
    params.with_genres = genreIds.join(',');
  }
  const data = await tmdbFetch<TmdbMovieList>('/discover/movie', params);
  return data.results;
}

export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  const data = await tmdbFetch<TmdbMovieList>('/search/movie', { query });
  return data.results;
}

export async function getSimilarMovies(movieId: number): Promise<TmdbMovie[]> {
  const data = await tmdbFetch<TmdbMovieList>(`/movie/${movieId}/similar`);
  return data.results;
}

export async function getRecommendations(movieId: number): Promise<TmdbMovie[]> {
  const data = await tmdbFetch<TmdbMovieList>(`/movie/${movieId}/recommendations`);
  return data.results;
}

export async function getPopular(): Promise<TmdbMovie[]> {
  const data = await tmdbFetch<TmdbMovieList>('/movie/popular');
  return data.results;
}

export type SortOption = 'popularity' | 'rating' | 'year';

export async function discoverLucky(
  sortBy: SortOption,
  genreIds: number[],
): Promise<TmdbMovie[]> {
  const sortMap: Record<SortOption, string> = {
    popularity: 'popularity.desc',
    rating: 'vote_average.desc',
    year: 'primary_release_date.desc',
  };

  const randomPage = Math.floor(Math.random() * 5) + 1;

  const params: Record<string, string> = {
    sort_by: sortMap[sortBy],
    page: String(randomPage),
  };

  if (sortBy === 'rating') {
    params['vote_count.gte'] = '200';
  }

  if (genreIds.length > 0) {
    params.with_genres = genreIds.join(',');
  }

  const data = await tmdbFetch<TmdbMovieList>('/discover/movie', params);
  return data.results;
}
