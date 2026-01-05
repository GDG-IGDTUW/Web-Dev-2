import Navbar from '@/components/layout/Navbar'; // Reuse or create DashboardNavbar
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

// We could create a specific DashboardNavbar if needed, but reusing public one is okay for MVP if it adapts.
// But usually Dashboard has different links.
// Let's create a minimal layout that just checks auth implicitly via middleware/session and wraps content.

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    return (
        <section className="min-h-screen bg-transparent flex flex-col pt-24">
            <Navbar />
            <main className="flex-1 container py-8 px-4 md:px-6 mx-auto">
                {children}
            </main>
        </section>
    );
}
