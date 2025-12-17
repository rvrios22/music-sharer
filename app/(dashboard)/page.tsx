import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const songs = await prisma.song.findMany({
      orderBy: { title: 'asc' }
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Songs</h1>
        {isAdmin && (
            <Link
                href="/songs/upload"
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden md:block">Upload Song</span>
            </Link>
        )}
      </div>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
             {songs.length === 0 ? (
                 <p className="p-4 text-gray-500">No songs found. Upload one to get started.</p>
             ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {songs.map((song) => (
                        <div key={song.id} className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                            <div className="min-w-0 flex-1">
                                <Link href={`/songs/${song.id}`} className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p className="text-sm font-medium text-gray-900">{song.title}</p>
                                    <p className="truncate text-sm text-gray-500">{song.artist || 'Unknown Artist'}</p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
