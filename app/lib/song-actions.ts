'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadSong(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const artist = formData.get('artist') as string;

  if (!file || !title) {
    throw new Error('Missing required fields');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure uploads directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  // Create unique filename to prevent overwrite or use title
  // For simplicity, using timestamp-filename.pdf
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, buffer);

  // Save partial path for public access
  const publicPath = `/uploads/${filename}`;

  await prisma.song.create({
    data: {
      title,
      artist,
      filePath: publicPath,
    },
  });

  revalidatePath('/');
  redirect('/');
}
