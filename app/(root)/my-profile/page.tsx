import { sampleBooks } from '@/app/constants';
import { signOut } from '@/auth';
import BookList from '@/components/BookList';
import { Button } from '@/components/ui/button';
import React from 'react';

const page = () => {
  return (
    <>
      <BookList title='Borrowed Books'
      books={sampleBooks}
      >

      </BookList>
    </>
  );
};

export default page;
