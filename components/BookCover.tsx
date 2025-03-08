'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import BookCoverSvg from './BookCoverSvg';
import { IKImage } from 'imagekitio-next';
import config from '@/lib/config';

type BookCoverVriant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles: Record<BookCoverVriant, string> = {
  extraSmall: 'book-cover_extra_small',
  small: 'book-cover_small',
  medium: 'book-cover_medium',
  regular: 'book-cover_regular',
  wide: 'book-cover_wide',
};

interface props {
  className: string;
  variant?: BookCoverVriant;
  coverImage: string;
  coverColor: string;
}

const BookCover = ({ className, variant = 'regular', coverImage = 'https://placehold.co/400x600.png', coverColor = '#012B48' }: props) => {
  return (
    <div>
      <div className={cn('relative transition-all duration-300', variantStyles[variant], className)}>
        <BookCoverSvg coverColor={coverColor}></BookCoverSvg>
        <div
          className="absolute z-10"
          style={{ left: '12%', width: '87.5%', height: '88%' }}
        >
          <IKImage
            path={coverImage}
            urlEndpoint={config.env.imageKit.urlEndpoint}
            alt="Book cover"
            fill
            className="rounded-sm object-fill"
            loading='lazy'
            lqip={{ active: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookCover;
