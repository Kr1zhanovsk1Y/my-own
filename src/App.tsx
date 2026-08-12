import { useState, useEffect, useCallback } from 'react';
import { ChipInput } from './components/ChipInput';
import { MovieSearch } from './components/MovieSearch';
import { MovieGrid } from './components/MovieCard';
import { LuckyPick } from './components/LuckyPick';
import { IconSparkles, IconTarget, IconFilm } from './components/Icons';
import {
  getGenres,
  discoverByKeywordsAndGenres,
  searchKeywords,
  getSimilarMovies,
  getRecommendations,
  getPopular,
  discoverLucky,
  posterUrl,
  type TmdbGenre,
  type SortOption,
} from './api/tmdb';
import type { Movie } from './types';
import './App.css';

type SearchMode = 'mood' | 'similar' | 'lucky';

interface SelectedMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterPath: string | null;
  genres: string[];
}

function mapToMovie(
  m: { id: number; title: string; overview: string; release_date: string; vote_average: number; poster_path: string | null; genre_ids: number[] },
  genres: TmdbGenre[],
): Movie {
  const genreMap = new Map(genres.map((g) => [g.id, g.name]));
  return {
    id: m.id,
    title: m.title,
    year: m.release_date ? parseInt(m.release_date) : 0,
    rating: m.vote_average,
    description: m.overview || 'Описание отсутствует',
    genres: m.genre_ids.map((id) => genreMap.get(id) ?? '').filter(Boolean),
    posterUrl: posterUrl(m.poster_path),
  };
}

const GENRE_KEYWORDS: Record<string, string[]> = {
  'комедия': ['комедия', 'смешной', 'весёлый', 'юмор'],
  'ужасы': ['ужасы', 'страшный', 'жуткий', 'хоррор'],
  'драма': ['драма', 'грустный', 'трогательный', 'серьёзный'],
  'фантастика': ['фантастика', 'космос', 'будущее', 'научная'],
  'боевик': ['боевик', 'экшен', 'экшн', 'action', 'драки'],
  'приключения': ['приключения', 'приключение', 'путешествие'],
  'мелодрама': ['романтика', 'романтический', 'любовь', 'мелодрама'],
  'триллер': ['триллер', 'напряжённый', 'саспенс'],
  'детектив': ['детектив', 'загадка', 'расследование', 'mystery'],
  'мультфильм': ['мультфильм', 'мультик', 'анимация', 'pixar', 'disney'],
  'фэнтези': ['фэнтези', 'магия', 'фентези', 'fantasy'],
  'криминал': ['криминал', 'мафия', 'бандиты', 'гангстеры'],
  'документальный': ['документальный', 'документалка', 'доки'],
  'семейный': ['семейный', 'детский', 'для детей', 'для всей семьи'],
  'история': ['исторический', 'история', 'война', 'военный', 'старый'],
  'музыка': ['мюзикл', 'музыка', 'музыкальный'],
};

function matchGenreIds(chips: string[], genres: TmdbGenre[]): number[] {
  const matched: number[] = [];
  for (const genre of genres) {
    const genreName = genre.name.toLowerCase();
    const keywords = GENRE_KEYWORDS[genreName] ?? [genreName];
    if (chips.some((chip) => keywords.some((kw) => kw.includes(chip) || chip.includes(kw)))) {
      matched.push(genre.id);
    }
  }
  return matched;
}

function App() {
  const [mode, setMode] = useState<SearchMode>('mood');
  const [chips, setChips] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<SelectedMovie | null>(null);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<TmdbGenre[]>([]);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [luckySearched, setLuckySearched] = useState(false);

  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  useEffect(() => {
    if (genres.length === 0 || initialLoaded) return;
    setLoading(true);
    getPopular()
      .then((data) => setResults(data.map((m) => mapToMovie(m, genres))))
      .finally(() => {
        setLoading(false);
        setInitialLoaded(true);
      });
  }, [genres, initialLoaded]);

  const searchByChips = useCallback(
    async (currentChips: string[]) => {
      if (currentChips.length === 0 || genres.length === 0) {
        setLoading(true);
        try {
          const data = await getPopular();
          setResults(data.map((m) => mapToMovie(m, genres)));
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const genreIds = matchGenreIds(currentChips, genres);

        const nonGenreChips = currentChips.filter((chip) => {
          return !genres.some((g) => {
            const keywords = GENRE_KEYWORDS[g.name.toLowerCase()] ?? [g.name.toLowerCase()];
            return keywords.some((kw) => kw.includes(chip) || chip.includes(kw));
          });
        });

        let keywordIds: number[] = [];
        if (nonGenreChips.length > 0) {
          const allKeywords = await Promise.all(
            nonGenreChips.map((c) => searchKeywords(c)),
          );
          keywordIds = allKeywords.flatMap((kws) => kws.map((kw) => kw.id));
        }

        if (genreIds.length === 0 && keywordIds.length === 0) {
          const data = await getPopular();
          setResults(data.map((m) => mapToMovie(m, genres)));
          return;
        }

        const data = await discoverByKeywordsAndGenres(keywordIds, genreIds);
        setResults(data.map((m) => mapToMovie(m, genres)));
      } finally {
        setLoading(false);
      }
    },
    [genres],
  );

  useEffect(() => {
    if (mode !== 'mood') return;
    const timer = setTimeout(() => searchByChips(chips), 300);
    return () => clearTimeout(timer);
  }, [chips, mode, searchByChips]);

  const handleSelectMovie = useCallback(
    async (movie: SelectedMovie | null) => {
      setSelectedMovie(movie);
      if (!movie) {
        setLoading(true);
        try {
          const data = await getPopular();
          setResults(data.map((m) => mapToMovie(m, genres)));
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const [similar, recommended] = await Promise.all([
          getSimilarMovies(movie.id),
          getRecommendations(movie.id),
        ]);

        const seen = new Set<number>();
        const merged = [...recommended, ...similar].filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });

        setResults(merged.map((m) => mapToMovie(m, genres)));
      } finally {
        setLoading(false);
      }
    },
    [genres],
  );

  const handleLuckySearch = useCallback(
    async (sortBy: SortOption, genreIds: number[]) => {
      setLuckySearched(true);
      setLoading(true);
      try {
        const data = await discoverLucky(sortBy, genreIds);
        setResults(data.map((m) => mapToMovie(m, genres)));
      } finally {
        setLoading(false);
      }
    },
    [genres],
  );

  const hasSearch =
    (mode === 'mood' && chips.length > 0) ||
    (mode === 'similar' && selectedMovie !== null) ||
    (mode === 'lucky' && luckySearched);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <IconFilm size={40} />
        </div>
        <h1 className="app-title">
          Наш <span className="app-title-accent">Вечер</span>
        </h1>
        <p className="app-subtitle">Найди идеальный фильм для сегодня</p>
      </header>

      <section className="app-search">
        <div className="mode-switcher">
          <button
            className={`mode-tab ${mode === 'mood' ? 'active' : ''}`}
            onClick={() => { setMode('mood'); setLuckySearched(false); }}
          >
            <span className="mode-tab-icon"><IconSparkles size={16} /></span>
            По настроению
          </button>
          <button
            className={`mode-tab ${mode === 'similar' ? 'active' : ''}`}
            onClick={() => { setMode('similar'); setLuckySearched(false); }}
          >
            <span className="mode-tab-icon"><IconTarget size={16} /></span>
            Найти похожий
          </button>
        </div>

        {mode === 'mood' ? (
          <ChipInput chips={chips} onChipsChange={setChips} />
        ) : mode === 'similar' ? (
          <MovieSearch
            selectedMovie={selectedMovie}
            onSelect={handleSelectMovie}
          />
        ) : (
          <LuckyPick
            genres={genres}
            onSearch={handleLuckySearch}
            loading={loading}
          />
        )}
      </section>

      <section className="app-results">
        <div className="results-header">
          {hasSearch ? (
            <>
              <span className="results-count">
                {results.length}{' '}
                {results.length === 1
                  ? 'фильм'
                  : results.length < 5
                    ? 'фильма'
                    : 'фильмов'}
              </span>
              {mode === 'similar' && selectedMovie && (
                <span className="results-hint">
                  похожих на «{selectedMovie.title}»
                </span>
              )}
            </>
          ) : (
            <span className="results-count">Популярное сейчас</span>
          )}
        </div>
        <MovieGrid movies={results.map((m) => ({ ...m, matchPercent: 0 }))} loading={loading} />
      </section>
    </div>
  );
}

export default App;
