'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSetlist(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const dateStr = formData.get('date') as string;

  if (!dateStr) {
    throw new Error('Date is required');
  }

  const date = new Date(dateStr);

  const setlist = await prisma.setlist.create({
    data: {
      name: name || 'Sunday Service',
      date,
    },
  });

  revalidatePath('/setlists');
  redirect(`/setlists/${setlist.id}`);
}

export async function addSongToSetlist(setlistId: string, songId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

    // Get current max order
    const maxOrder = await prisma.setlistSong.aggregate({
        where: { setlistId },
        _max: { order: true }
    });

    const newOrder = (maxOrder._max.order ?? 0) + 1;

    await prisma.setlistSong.create({
        data: {
            setlistId,
            songId,
            order: newOrder
        }
    });

    revalidatePath(`/setlists/${setlistId}`);
}

export async function removeSongFromSetlist(setlistSongId: string, setlistId: string) {
     const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

    await prisma.setlistSong.delete({
        where: { id: setlistSongId }
    });

    revalidatePath(`/setlists/${setlistId}`);
}

// Simple swap for now, or full reorder
export async function moveSongOneUp(setlistSongId: string, setlistId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

    const current = await prisma.setlistSong.findUnique({ where: { id: setlistSongId } });
    if (!current) return;

    const previous = await prisma.setlistSong.findFirst({
        where: {
            setlistId,
            order: { lt: current.order }
        },
        orderBy: { order: 'desc' }
    });

    if (previous) {
        // Swap orders
        const prevOrder = previous.order;
        const currentOrder = current.order;

        await prisma.$transaction([
            prisma.setlistSong.update({
                where: { id: previous.id },
                data: { order: currentOrder }
            }),
             prisma.setlistSong.update({
                where: { id: current.id },
                data: { order: prevOrder }
            })
        ]);
        revalidatePath(`/setlists/${setlistId}`);
    }
}

