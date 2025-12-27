'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)',
      }}>
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: '700',
          margin: '0 0 24px 0',
          background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
        }}>
          WhatsApp Butler
        </h1>
        
        <p style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          color: '#999',
          maxWidth: '600px',
          marginBottom: '48px',
          lineHeight: '1.5',
        }}>
          Your AI-powered personal assistant that turns WhatsApp messages into organized calendar events
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: '600',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get Started Free
            </button>
          </a>
        </div>

        <div style={{
          marginTop: '80px',
          opacity: scrollY > 100 ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Scroll to explore</p>
          <div style={{
            width: '2px',
            height: '40px',
            background: 'linear-gradient(180deg, #666 0%, transparent 100%)',
            margin: '0 auto',
            animation: 'bounce 2s infinite',
          }} />
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        minHeight: '100vh',
        padding: '120px 24px',
        background: '#0a0a0a',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '80px',
            background: 'linear-gradient(135deg, #fff 0%, #666 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Simply message. We handle the rest.
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {[
              {
                icon: '💬',
                title: 'Natural Conversation',
                desc: 'Just chat like you normally would. No commands, no complex syntax.',
              },
              {
                icon: '🗓️',
                title: 'Auto Calendar Sync',
                desc: 'Tasks instantly appear in your Google Calendar, perfectly organized.',
              },
              {
                icon: '⏰',
                title: 'Smart Reminders',
                desc: 'Get reminded 1 hour before, plus daily summaries at 6am, 12pm, and 8pm.',
              },
              {
                icon: '🌍',
                title: 'Timezone Aware',
                desc: 'Automatically detects and respects your local timezone.',
              },
              {
                icon: '🔄',
                title: 'Recurring Tasks',
                desc: 'Set weekly tasks effortlessly. "Gym every Monday and Friday at 7am"',
              },
              {
                icon: '🔒',
                title: 'Private & Secure',
                desc: 'Your data is encrypted and only accessible by you.',
              },
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '40px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(-8px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: '600' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#999', lineHeight: '1.6', fontSize: '16px' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        minHeight: '100vh',
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '80px',
          }}>
            How it works
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {[
              {
                step: '01',
                title: 'Connect Google Calendar',
                desc: 'Sign up and link your Google Calendar in seconds. One-time setup.',
              },
              {
                step: '02',
                title: 'Message Your Tasks',
                desc: 'Send us a WhatsApp message like "Meeting with Sarah tomorrow at 3pm at Starbucks"',
              },
              {
                step: '03',
                title: 'Get Reminded',
                desc: 'Receive timely reminders via WhatsApp. Never miss an important task again.',
              },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '32px',
                alignItems: 'flex-start',
                padding: '32px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.2)',
                  minWidth: '80px',
                }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: '600' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#999', lineHeight: '1.6', fontSize: '18px' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 24px',
        textAlign: 'center',
        background: '#000',
      }}>
        <h2 style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: '700',
          marginBottom: '24px',
          maxWidth: '800px',
        }}>
          Ready to automate your life?
        </h2>
        
        <p style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          color: '#999',
          maxWidth: '600px',
          marginBottom: '48px',
        }}>
          Join hundreds of users who never miss a task
        </p>

        <a href="/signup" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '20px 60px',
            fontSize: '20px',
            fontWeight: '600',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '100px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 30px rgba(255,255,255,0.2)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,255,255,0.3)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,255,255,0.2)'
          }}
          >
            Start for Free
          </button>
        </a>

        <p style={{ marginTop: '24px', color: '#666', fontSize: '14px' }}>
          No credit card required • 2 minute setup
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        color: '#666',
      }}>
        <p>© 2025 WhatsApp Butler. Made with ❤️</p>
      </footer>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
