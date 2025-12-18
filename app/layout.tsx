export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0, padding: 0 }}>
        <header style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
          <strong>🧠 WhatsApp Butler</strong>
        </header>
        <main style={{ padding: '24px' }}>{children}</main>
      </body>
    </html>
  )
}
