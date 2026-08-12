import { useState } from 'react';
import type { TmdbGenre } from '../api/tmdb';
import type { SortOption } from '../api/tmdb';
import { IconDice } from './Icons';
import './LuckyPick.css';

interface LuckyPickProps {
  genres: TmdbGenre[];
  onSearch: (sortBy: SortOption, genreIds: number[]) => void;
  loading: boolean;
}

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'popularity', label: 'Популярные' },
  { key: 'rating', label: 'По рейтингу' },
  { key: 'year', label: 'Новинки' },
];

export function LuckyPick({ genres, onSearch, loading }: LuckyPickProps) {
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  return (
    <div className="lucky-pick-wrapper">
      <div className="lucky-section">
        <div className="lucky-section-label">Сортировка</div>
        <div className="lucky-sort-options">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`lucky-sort-option ${sortBy === opt.key ? 'active' : ''}`}
              onClick={() => setSortBy(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lucky-section">
        <div className="lucky-section-label">
          Жанр <span className="lucky-section-hint">(до 2)</span>
        </div>
        <div className="lucky-genres">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`lucky-genre ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
              onClick={() => toggleGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <button
        className="lucky-button"
        onClick={() => onSearch(sortBy, selectedGenres)}
        disabled={loading}
      >
        <IconDice size={22} />
        {loading ? 'Ищем...' : 'На удачу!'}
      </button>
    </div>
  );
}
