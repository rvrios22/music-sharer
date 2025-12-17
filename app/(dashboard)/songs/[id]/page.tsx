import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const song = await prisma.song.findUnique({
    where: { id },
  });

  if (!song) {
    notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
            <h1 className="text-2xl font-bold">{song.title}</h1>
            <p className="text-gray-500">{song.artist}</p>
        </div>
      </div>
      
      <div className="flex-grow bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
        <iframe
            src={`${song.filePath}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            title={song.title}
        />
      </div>
    </div>
  );
}
