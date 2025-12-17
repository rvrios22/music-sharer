import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { Plus, Trash2, ArrowUp } from 'lucide-react';
import { addSongToSetlist, removeSongFromSetlist, moveSongOneUp } from '@/app/lib/setlist-actions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const setlist = await prisma.setlist.findUnique({
    where: { id },
    include: {
      songs: {
        orderBy: { order: 'asc' },
        include: {
          song: true,
        },
      },
    },
  });

  if (!setlist) {
    notFound();
  }

  // Fetch all songs for the "Add" dropdown
  const allSongs = await prisma.song.findMany({
    orderBy: { title: 'asc' },
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{setlist.name}</h1>
        <p className="text-gray-500">{setlist.date.toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Songs in Set</h2>
          <span className="text-sm text-gray-500">{setlist.songs.length} songs</span>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {setlist.songs.length === 0 ? (
             <li className="p-8 text-center text-gray-500">
                No songs in this setlist yet.
             </li>
          ) : (
            setlist.songs.map((item, index) => (
                <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                        <span className="text-gray-400 font-mono w-6 text-center">{index + 1}</span>
                         <Link href={`/songs/${item.song.id}`} className="hover:text-blue-600 block">
                             <p className="font-medium text-gray-900">{item.song.title}</p>
                             <p className="text-sm text-gray-500">{item.song.artist}</p>
                         </Link>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <form action={async () => {
                                'use server';
                                await moveSongOneUp(item.id, setlist.id);
                            }}>
                                <button title="Move Up" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full" disabled={index === 0}>
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </form>
                            <form action={async () => {
                                'use server';
                                await removeSongFromSetlist(item.id, setlist.id);
                            }}>
                                <button title="Remove" className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    )}
                </li>
            ))
          )}
        </ul>
      </div>

      {isAdmin && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Song to Setlist</h3>
              <form 
                  action={async (formData) => {
                      'use server';
                      const songId = formData.get('songId') as string;
                      if(songId) await addSongToSetlist(setlist.id, songId);
                  }}
                  className="flex gap-4"
              >
                  <select 
                        name="songId" 
                        required
                        className="block w-full max-w-md rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm border"
                  >
                      <option value="">Select a song...</option>
                      {allSongs.map(s => (
                          <option key={s.id} value={s.id}>{s.title} - {s.artist}</option>
                      ))}
                  </select>
                  <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                  </button>
              </form>
          </div>
      )}
    </div>
  );
}
