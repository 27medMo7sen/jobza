export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className=" bg-red-300">{children}</body>
    </html>
  );
}
