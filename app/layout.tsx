export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          a {
            color: inherit;
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <header style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px 40px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <strong style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.01em',
            }}>
              🧠 WhatsApp Butler
            </strong>
          </a>
          
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a 
              href="/" 
              style={{ 
                textDecoration: 'none', 
                color: '#fff',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'opacity 0.2s',
                opacity: 0.8,
              }}
            >
              Home
            </a>
            <a 
              href="https://www.notion.so/WhatsApp-Butler-2d5ef8799fc880df9a6af06a757c3745?source=copy_link" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                textDecoration: 'none', 
                color: '#fff',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'opacity 0.2s',
                opacity: 0.8,
              }}
            >
              Docs ↗
            </a>
            <a 
              href="/reconnect"
              style={{ 
                textDecoration: 'none', 
                color: '#fff',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'opacity 0.2s',
                opacity: 0.8,
              }}
            >
              Reconnect Google Calendar
            </a>
            <a 
              href="/signup"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}>
                Sign Up
              </button>
            </a>
          </nav>
        </header>
        
        <main style={{ paddingTop: '80px' }}>{children}</main>
      </body>
    </html>
  )
}
