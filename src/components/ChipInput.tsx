import { useState, useRef, type KeyboardEvent } from 'react';
import './ChipInput.css';

const suggestedTags = [
  'комедия', 'ужасы', 'драма', 'фантастика', 'романтика',
  'триллер', 'приключения', 'боевик', 'мультфильм', 'детектив',
  'фэнтези', 'криминал', 'семейный', 'мюзикл',
];

interface ChipInputProps {
  chips: string[];
  onChipsChange: (chips: string[]) => void;
}

export function ChipInput({ chips, onChipsChange }: ChipInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addChip = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !chips.includes(trimmed)) {
      onChipsChange([...chips, trimmed]);
    }
    setInputValue('');
  };

  const removeChip = (index: number) => {
    onChipsChange(chips.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
      removeChip(chips.length - 1);
    }
  };

  const toggleSuggested = (tag: string) => {
    if (chips.includes(tag)) {
      onChipsChange(chips.filter((c) => c !== tag));
    } else {
      onChipsChange([...chips, tag]);
    }
  };

  return (
    <div className="chip-input-wrapper">
      <div
        className="chip-input-container"
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((chip, index) => (
          <span key={chip} className="chip">
            {chip}
            <button
              className="chip-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeChip(index);
              }}
              aria-label={`Удалить ${chip}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="chip-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            chips.length === 0 ? 'Какой фильм ищем? Напиши и нажми Enter...' : 'Ещё...'
          }
        />
      </div>
      <div className="suggested-tags">
        {suggestedTags.map((tag) => (
          <button
            key={tag}
            className={`suggested-tag ${chips.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleSuggested(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
