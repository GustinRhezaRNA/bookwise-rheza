'use server';

import { db } from '@/database/drizzle';
import { books, borrowRecords } from '@/database/schema';
import { eq } from 'drizzle-orm';
import dayjs from 'dayjs';

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    console.log("Borrowing book:", { userId, bookId });
  
    const book = await db.select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);
  
    console.log("Book found:", book);
  
    if (!book.length || book[0].availableCopies <= 0) {
      return { success: false, error: "Book not available to borrow" };
    }
  
    const dueDate = dayjs().add(7, "days").toDate().toDateString();
    
    console.log("Inserting borrow record...");
    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    }).returning();
    console.log("Record inserted:", record);
  
    console.log("Updating available copies...");
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));
    console.log("Book updated successfully");
  
    return { success: true, data: JSON.parse(JSON.stringify(record)) };
  } catch (error) {
    console.error("BorrowBook Error:", error);
    return { success: false, error: "Failed to borrow book" };
  }
  
};
