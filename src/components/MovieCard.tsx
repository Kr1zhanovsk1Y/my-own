import { useState } from 'react';
import type { Movie } from '../types';
import { IconFilmFilled, IconEmptyState } from './Icons';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  matchPercent?: number;
  index: number;
}

function ratingClass(rating: number): string {
  if (rating >= 7) return 'good';
  if (rating >= 5) return 'mid';
  return 'low';
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article
      className="movie-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="movie-poster-wrap">
        {movie.posterUrl ? (
          <>
            {!imgLoaded && <div className="movie-poster-skeleton skeleton-shimmer" />}
            <img
              className={`movie-poster-img ${imgLoaded ? 'loaded' : ''}`}
              src={movie.posterUrl}
              alt={movie.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="movie-poster movie-poster-empty">
            <IconFilmFilled size={64} />
          </div>
        )}
        <div className="movie-poster-overlay" />
        <div className={`movie-rating-badge rating-${ratingClass(movie.rating)}`}>
          <span className="badge-star">★</span>
          {movie.rating.toFixed(1)}
        </div>
      </div>
      <div className="movie-info">
        <div className="movie-header">
          <h3 className="movie-title">{movie.title}</h3>
          <span className="movie-year">{movie.year || '—'}</span>
        </div>

        <p className="movie-description">{movie.description}</p>

        <div className="movie-genres">
          {movie.genres.map((genre) => (
            <span key={genre} className="movie-genre">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <article
      className="movie-card skeleton-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="movie-poster-wrap">
        <div className="movie-poster-skeleton skeleton-shimmer" />
      </div>
      <div className="movie-info">
        <div className="skeleton-line skeleton-line-title skeleton-shimmer" />
        <div className="skeleton-line skeleton-line-rating skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-line-short skeleton-shimmer" />
        <div className="skeleton-genres">
          <div className="skeleton-genre skeleton-shimmer" />
          <div className="skeleton-genre skeleton-shimmer" />
          <div className="skeleton-genre skeleton-genre-sm skeleton-shimmer" />
        </div>
      </div>
    </article>
  );
}

interface MovieGridProps {
  movies: Array<Movie & { matchPercent?: number }>;
  loading?: boolean;
}

export function MovieGrid({ movies, loading }: MovieGridProps) {
  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">
          <IconEmptyState size={72} />
        </div>
        <p className="no-results-text">Ничего не нашлось</p>
        <p className="no-results-hint">
          Попробуй другие слова или убери лишние чипы
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          matchPercent={movie.matchPercent}
          index={index}
        />
      ))}
    </div>
  );
}
