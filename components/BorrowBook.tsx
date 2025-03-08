'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { borrowBook } from '@/lib/action/book';

interface Props {
  userId: string;
  bookId: string;
  borrowingEligiblity: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({ userId, bookId, borrowingEligiblity: { isEligible, message } }: Props) => {
  const router = useRouter();
  const [isBorrowing, setIsBorrowing] = useState(false);

  const handleBorrow = async () => {
    if (!isEligible) {
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
    setIsBorrowing(true);
    try {
      const result = await borrowBook({ userId, bookId });
      if (result.success) {
        toast({ title: 'Book Borrowed', description: 'Book has been successfully borrowed' });
        router.push('/my-profile');
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to borrow book', variant: 'destructive' });
    } finally {
      setIsBorrowing(false);
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrow}
      disabled={!isEligible || isBorrowing}
    >
      <Image
        src="/icons/book.svg"
        alt="book"
        width={20}
        height={20}
      />
      <p className="font-bebas-neue text-xl text-dark-100 ">{isBorrowing ? 'Borrowing...' : 'Borrow Book'} </p>
    </Button>
  );
};

export default BorrowBook;
