export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0, padding: 0 }}>
        <header style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <strong style={{ fontSize: '18px' }}>🧠 WhatsApp Butler</strong>
          
          <nav style={{ display: 'flex', gap: '16px' }}>
            <a 
              href="/" 
              style={{ 
                textDecoration: 'none', 
                color: '#000',
                padding: '8px 16px',
                borderRadius: '4px',
              }}
            >
              Home
            </a>
            <a 
              href="https://docs.example.com" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                textDecoration: 'none', 
                color: '#000',
                padding: '8px 16px',
                borderRadius: '4px',
              }}
            >
              Docs ↗
            </a>
          </nav>
        </header>
        <main style={{ padding: '24px' }}>{children}</main>
      </body>
    </html>
  )
}
