'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(88, 101, 242, 0.15) 0%, transparent 50%)`,
        pointerEvents: 'none',
        transition: 'background 0.3s ease',
      }} />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 24px',
        textAlign: 'center',
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(88, 101, 242, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          top: '10%',
          right: '10%',
          animation: 'float 20s infinite ease-in-out',
        }} />
        
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          bottom: '20%',
          left: '10%',
          animation: 'float 15s infinite ease-in-out',
          animationDelay: '-5s',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            marginBottom: '24px',
            background: 'rgba(88, 101, 242, 0.1)',
            border: '1px solid rgba(88, 101, 242, 0.3)',
            borderRadius: '100px',
            fontSize: '14px',
            color: '#8B92F6',
            fontWeight: '600',
          }}>
            ✨ AI-Powered Task Management
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: '700',
            margin: '0 0 24px 0',
            background: 'linear-gradient(135deg, #fff 0%, #8B92F6 50%, #9333EA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
          }}>
            Never Miss<br />A Task Again
          </h1>
          
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#999',
            maxWidth: '700px',
            marginBottom: '48px',
            lineHeight: '1.6',
          }}>
            Transform casual WhatsApp messages into perfectly organized calendar events. 
            Your personal AI assistant that understands natural language.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.4)'
              }}
              >
                Get Started Free →
              </button>
            </a>
            
            <a href="https://www.notion.so/WhatsApp-Butler-2d5ef8799fc880df9a6af06a757c3745" target="_blank" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.background = 'transparent'
              }}
              >
                View Demo
              </button>
            </a>
          </div>

          <div style={{ 
            marginTop: '64px', 
            display: 'flex', 
            gap: '48px', 
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'Active Users', value: '500+' },
              { label: 'Tasks Created', value: '10K+' },
              { label: 'Success Rate', value: '99.9%' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #fff 0%, #8B92F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '40px',
          opacity: scrollY > 100 ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}>
          <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Scroll to explore</p>
          <div style={{
            width: '2px',
            height: '40px',
            background: 'linear-gradient(180deg, #8B92F6 0%, transparent 100%)',
            margin: '0 auto',
            animation: 'bounce 2s infinite',
          }} />
        </div>
      </section>

      {/* Social Proof Section */}
      <section style={{
        padding: '80px 24px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Trusted by productivity enthusiasts
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '48px', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexWrap: 'wrap',
            opacity: 0.5,
          }}>
            {['Google Calendar', 'WhatsApp', 'Vercel', 'Supabase'].map((brand, i) => (
              <div key={i} style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#fff',
              }}>
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        minHeight: '100vh',
        padding: '120px 24px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 0%, #8B92F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Powerful Features
            </h2>
            <p style={{ fontSize: '18px', color: '#999', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to stay organized, automated, and in control
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                icon: '💬',
                title: 'Natural Language',
                desc: 'Just chat naturally. "Meeting with Sarah tomorrow at 3pm" - done.',
                gradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%)',
              },
              {
                icon: '🗓️',
                title: 'Instant Sync',
                desc: 'Tasks appear in Google Calendar immediately, perfectly formatted.',
                gradient: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, transparent 100%)',
              },
              {
                icon: '⏰',
                title: 'Smart Reminders',
                desc: '1-hour alerts plus daily summaries at 6am, 12pm, and 8pm.',
                gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, transparent 100%)',
              },
              {
                icon: '🌍',
                title: 'Global Timezones',
                desc: 'Automatically adapts to your timezone. Works anywhere.',
                gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
              },
              {
                icon: '🔄',
                title: 'Recurring Events',
                desc: '"Gym every Monday and Friday" - set it once, forget it.',
                gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
              },
              {
                icon: '🔒',
                title: 'Bank-Level Security',
                desc: 'End-to-end encryption. Your data stays private.',
                gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)',
              },
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '40px',
                background: feature.gradient,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.borderColor = 'rgba(139, 146, 246, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
              >
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>{feature.icon}</div>
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
        padding: '120px 24px',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '80px',
          }}>
            Getting started is easy
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              {
                step: '01',
                title: 'Connect Your Calendar',
                desc: 'One-click Google Calendar integration. Takes 30 seconds.',
                color: '#667eea',
              },
              {
                step: '02',
                title: 'Start Messaging',
                desc: 'Send us tasks via WhatsApp. No app download needed.',
                color: '#764ba2',
              },
              {
                step: '03',
                title: 'Stay Organized',
                desc: 'Get smart reminders and never miss what matters.',
                color: '#f093fb',
              },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '32px',
                alignItems: 'center',
                padding: '48px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: `linear-gradient(180deg, ${item.color} 0%, transparent 100%)`,
                }} />
                
                <div style={{
                  fontSize: '72px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${item.color} 0%, transparent 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  minWidth: '120px',
                  textAlign: 'center',
                }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
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

      {/* Testimonial Section */}
      <section style={{
        padding: '120px 24px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '60px 40px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(139, 146, 246, 0.2)',
            borderRadius: '32px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '24px' }}>⭐⭐⭐⭐⭐</div>
            <p style={{ 
              fontSize: 'clamp(20px, 3vw, 28px)', 
              lineHeight: '1.6', 
              marginBottom: '32px',
              color: '#fff',
            }}>
              "WhatsApp Butler transformed how I manage my day. I just message my tasks and everything is organized automatically. It's like having a personal assistant!"
            </p>
            <div>
              <div style={{ fontWeight: '600', fontSize: '18px' }}>Sarah Chen</div>
              <div style={{ color: '#999', fontSize: '14px', marginTop: '4px' }}>Product Manager</div>
            </div>
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
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '700',
            marginBottom: '24px',
            maxWidth: '900px',
          }}>
            Start automating your tasks today
          </h2>
          
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#999',
            maxWidth: '700px',
            marginBottom: '48px',
            margin: '0 auto 48px',
          }}>
            Join hundreds of users who never miss an important task
          </p>

          <a href="/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '22px 64px',
              fontSize: '20px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 16px 50px rgba(102, 126, 234, 0.5)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)'
            }}
            >
              Start for Free →
            </button>
          </a>

          <p style={{ marginTop: '24px', color: '#666', fontSize: '14px' }}>
            ✓ No credit card required  •  ✓ 2 minute setup  •  ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 24px 40px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '40px',
            marginBottom: '60px',
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '20px', marginBottom: '16px' }}>
                🧠 WhatsApp Butler
              </div>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                Your AI-powered personal assistant for WhatsApp and Google Calendar.
              </p>
            </div>
            
            <div>
              <div style={{ fontWeight: '600', marginBottom: '16px', color: '#999' }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#features" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Features</a>
                <a href="#how-it-works" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>How it Works</a>
                <a href="/signup" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Pricing</a>
              </div>
            </div>
            
            <div>
              <div style={{ fontWeight: '600', marginBottom: '16px', color: '#999' }}>Company</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="https://www.notion.so/WhatsApp-Butler-2d5ef8799fc880df9a6af06a757c3745" target="_blank" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Documentation</a>
                <a href="#" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Privacy</a>
                <a href="#" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Terms</a>
              </div>
            </div>
          </div>
          
          <div style={{ 
            paddingTop: '40px', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
          }}>
            <p>© 2025 WhatsApp Butler. Made with ❤️ for productivity enthusiasts.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
      `}</style>
    </div>
  )
}
