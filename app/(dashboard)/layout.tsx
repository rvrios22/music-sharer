import Link from 'next/link';
import { signOut } from '@/auth';
import { Music, ListMusic, LogOut } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-50">
      <div className="w-full flex-none md:w-64">
        <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white border-r border-gray-200">
          <Link
            className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
            href="/"
          >
            <div className="w-32 text-white md:w-40">
               <span className="text-xl font-bold">Worship Team</span>
            </div>
          </Link>
          <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
            <Link
                href="/"
                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
                <Music className="w-6" />
                <p className="hidden md:block">Songs</p>
            </Link>
             <Link
                href="/setlists"
                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
                <ListMusic className="w-6" />
                <p className="hidden md:block">Setlists</p>
            </Link>
            {/* Admin Only Link Idea: Check role here or in component */}
            <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <LogOut className="w-6" />
                <div className="hidden md:block">Sign Out</div>
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
