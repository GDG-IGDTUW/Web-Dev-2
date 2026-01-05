'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to register');
            }

            // Redirect to onboarding to select a plant
            router.push('/onboarding');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="border-none shadow-xl bg-background/80 backdrop-blur">
            <CardHeader className="space-y-1 text-center items-center">
                <div className="rounded-full bg-primary/10 p-3 mb-2">
                    <Sprout className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>
                    Start your journey to better habits today
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                        <Input id="name" name="name" type="text" placeholder="Your Name" required disabled={loading} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                        <Input id="password" name="password" type="password" required disabled={loading} />
                    </div>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                <div>
                    Already have an account?{' '}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                        Sign in
                    </Link>
                </div>
                <Link href="/" className="underline underline-offset-4 hover:text-primary">
                    Back to Home
                </Link>
            </CardFooter>
        </Card>
    );
}
