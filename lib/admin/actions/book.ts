'use server';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
      message: 'Create book successful',
    };
  } catch (error: any) {
    console.error('Create book failed:', error); // Cetak error lebih jelas
    return {
      success: false,
      message: error.message || 'Create book failed',
    };
  }
};
