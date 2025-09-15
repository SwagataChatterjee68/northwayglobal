export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children} {/* No sidebar, no topbar */}
      </body>
    </html>
  );
}
