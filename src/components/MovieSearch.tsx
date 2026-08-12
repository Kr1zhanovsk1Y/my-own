import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { searchMovies as tmdbSearch, posterUrl, type TmdbMovie } from '../api/tmdb';
import { IconSearch, IconFilm } from './Icons';
import './MovieSearch.css';

interface DropdownMovie {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterPath: string | null;
  genres: string[];
}

interface MovieSearchProps {
  selectedMovie: DropdownMovie | null;
  onSelect: (movie: DropdownMovie | null) => void;
}

export function MovieSearch({ selectedMovie, onSelect }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<DropdownMovie[]>([]);
  const [searching, setSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await tmdbSearch(query.trim());
        setResults(
          data.slice(0, 8).map(mapTmdbMovie),
        );
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectMovie = (movie: DropdownMovie) => {
    onSelect(movie);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectMovie(results[activeIndex]);
    }
  };

  if (selectedMovie) {
    const thumb = selectedMovie.posterPath
      ? posterUrl(selectedMovie.posterPath, 'w92')
      : '';

    return (
      <div className="movie-search-wrapper">
        <div className="selected-movie">
          {thumb ? (
            <img className="selected-movie-thumb" src={thumb} alt="" />
          ) : (
            <span className="selected-movie-emoji"><IconFilm size={32} /></span>
          )}
          <div className="selected-movie-info">
            <div className="selected-movie-label">Ищем похожие на</div>
            <div className="selected-movie-title">{selectedMovie.title}</div>
            <div className="selected-movie-meta">
              {selectedMovie.year} · ★ {selectedMovie.rating.toFixed(1)}
            </div>
          </div>
          <button
            className="selected-movie-clear"
            onClick={() => onSelect(null)}
            aria-label="Сбросить выбор"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-search-wrapper" ref={wrapperRef}>
      <div className="movie-search-input-wrap">
        <span className="movie-search-icon"><IconSearch size={18} /></span>
        <input
          className="movie-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Введи название фильма, который понравился..."
        />
      </div>

      {isOpen && query.trim() && (
        <div className="search-dropdown">
          {searching ? (
            <div className="search-dropdown-empty">Ищем...</div>
          ) : results.length > 0 ? (
            results.map((movie, index) => {
              const thumb = movie.posterPath
                ? posterUrl(movie.posterPath, 'w92')
                : '';
              return (
                <button
                  key={movie.id}
                  className={`search-dropdown-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => selectMovie(movie)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {thumb ? (
                    <img className="search-dropdown-thumb" src={thumb} alt="" />
                  ) : (
                    <span className="search-dropdown-emoji"><IconFilm size={24} /></span>
                  )}
                  <div className="search-dropdown-info">
                    <div className="search-dropdown-title">{movie.title}</div>
                    <div className="search-dropdown-meta">
                      {movie.year} · ★ {movie.rating.toFixed(1)}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="search-dropdown-empty">Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  );
}

function mapTmdbMovie(m: TmdbMovie): DropdownMovie {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date ? parseInt(m.release_date) : 0,
    rating: m.vote_average,
    posterPath: m.poster_path,
    genres: [],
  };
}
