export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
    <div className="h-screen flex flex-col">
        {/*<div>auth</div>*/}
        <div>{children}</div>
    </div>
    );
}
