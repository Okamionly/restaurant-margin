import { useState } from 'react';
import { getIngredientDisplay } from '../utils/ingredientImages';

interface IngredientAvatarProps {
  name: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg'; // 24px, 36px, 48px
  className?: string;
}

export default function IngredientAvatar({ name, category, size = 'md', className = '' }: IngredientAvatarProps) {
  const { imageUrl, emoji } = getIngredientDisplay(name, category);
  const [imgError, setImgError] = useState(false);

  const sizes = { sm: 'w-6 h-6', md: 'w-9 h-9', lg: 'w-12 h-12' };
  const textSizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };

  if (imageUrl && !imgError) {
    return (
      <div className={`${sizes[size]} relative flex-shrink-0 ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover bg-mono-975 dark:bg-mono-300`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-mono-975 dark:bg-mono-300 flex items-center justify-center flex-shrink-0 ${className}`}>
      <span className={textSizes[size]}>{emoji}</span>
    </div>
  );
}
