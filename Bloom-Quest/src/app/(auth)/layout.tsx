export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 md:px-6">
            <div className="w-full max-w-md space-y-8">
                {children}
            </div>
        </div>
    );
}
