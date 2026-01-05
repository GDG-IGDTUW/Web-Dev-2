'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sprout } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

import { useRouter, usePathname } from 'next/navigation';

const NAV_LINKS = [
    { href: '/dashboard', label: 'Garden', color: 'emerald' },
    { href: '/stats', label: 'Stats', color: 'purple' },
    { href: '/focus', label: 'Focus', color: 'amber' },
    { href: '/shop', label: 'Shop', color: 'pink' },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (e) {
            console.error('Logout failed', e);
        }
    }

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed top-6 left-0 right-0 flex justify-center z-[100] px-4 pointer-events-none">
            <nav className="pointer-events-auto flex items-center justify-between gap-4 pl-4 pr-2 py-2 rounded-full border border-white/20 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl hover:bg-white/80 dark:hover:bg-zinc-900/80 max-w-2xl w-full">
                <div className="flex items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2 pl-2">
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                            <Sprout className="h-5 w-5 text-primary" />
                        </div>
                        <span className="hidden font-bold sm:inline-block font-heading tracking-tight text-emerald-950 dark:text-emerald-50">
                            BloomQuest
                        </span>
                    </Link>
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.href)
                                        ? `bg-white dark:bg-zinc-800 text-${link.color}-600 shadow-sm`
                                        : `hover:text-${link.color}-600/70 text-muted-foreground`
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full h-9 w-9 p-0 hover:bg-red-50 hover:text-red-500">
                        <span className="sr-only">Log out</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                    </Button>
                </div>
            </nav>
        </div>
    );
}
