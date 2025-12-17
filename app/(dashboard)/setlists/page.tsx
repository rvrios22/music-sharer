import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Calendar } from 'lucide-react';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const setlists = await prisma.setlist.findMany({
    orderBy: { date: 'desc' },
    include: {
        _count: {
            select: { songs: true }
        }
    }
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Setlists</h1>
        {isAdmin && (
            <Link
                href="/setlists/create"
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden md:block">Create Setlist</span>
            </Link>
        )}
      </div>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-white p-2 md:pt-0 shadow-sm">
             {setlists.length === 0 ? (
                 <p className="p-4 text-gray-500">No setlists found.</p>
             ) : (
                <div className="divide-y divide-gray-200">
                    {setlists.map((setlist) => (
                        <div key={setlist.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <Link href={`/setlists/${setlist.id}`} className="flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{setlist.name}</h3>
                                        <p className="text-sm text-gray-500">{setlist.date.toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Link>
                            <div className="text-sm text-gray-500">
                                {setlist._count.songs} songs
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
