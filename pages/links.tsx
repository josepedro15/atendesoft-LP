import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CurvedLoop from '../src/components/CurvedLoop';

export default function LinksPage() {
  return (
    <>
      <Head>
        <title>AtendeSoft - Links</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f9f9f9',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <img
                src="/LOGO HOME.svg"
                alt="AtendeSoft"
                style={{
                  width: '100%',da 
                  height: '100%',
                  objectFit: 'contain',
                  padding: '8px'
                }}
              />
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#262626',
              marginBottom: '8px'
            }}>
              AtendeSoft
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Automação Comercial, Apps e Dashboards com IA
            </p>
          </div>
          
          {/* Links */}
          <div style={{ marginBottom: '40px' }}>
            <Link href="/" style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: '#262626',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '2px solid #648fe0',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>🌐</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Ver Site Completo
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Conheça todas as nossas soluções
                  </div>
                </div>
              </div>
            </Link>
            
            <a href="https://wa.me/5531994959512?text=Olá!%20Vim%20pelo%20Instagram%20e%20quero%20saber%20mais%20sobre%20as%20soluções%20da%20AtendeSoft" target="_blank" style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: '#262626',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '2px solid #79cb75',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>💬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Falar no WhatsApp
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Converse com nossos especialistas
                  </div>
                </div>
                <div style={{ fontSize: '16px', opacity: 0.7 }}>↗</div>
              </div>
            </a>
            
            <Link href="/#produtos" style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: '#262626',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '2px solid #648fe0',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Ver Produtos
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Conheça nossas soluções em IA
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/#demonstracao" style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: '#262626',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '2px solid #f59e0b',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>▶️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Agendar Demo
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Veja nossa solução em ação
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Social Links */}
          <div style={{ marginBottom: '40px' }}>
            <a href="https://linkedin.com/company/atendesoft" target="_blank" style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: '#262626',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '2px solid #0077b5',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>💼</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    LinkedIn
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Conecte-se conosco profissionalmente
                  </div>
                </div>
                <div style={{ fontSize: '16px', opacity: 0.7 }}>↗</div>
              </div>
            </a>
            
            <a href="https://instagram.com/atendesoft" target="_blank" style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: '#262626',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              border: '2px solid #e4405f',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>📷</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Instagram
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Siga-nos para novidades e dicas
                  </div>
                </div>
                <div style={{ fontSize: '16px', opacity: 0.7 }}>↗</div>
              </div>
            </a>
          </div>
          
          {/* Curved Loop Animation Card */}
          <div style={{
            display: 'block',
            padding: '20px',
            background: 'white',
            borderRadius: '16px',
            marginBottom: '16px',
            textDecoration: 'none',
            color: '#262626',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            border: '2px solid #000000',
            transform: 'translateY(0)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
          }}>
            <div style={{ 
              backgroundColor: '#000000',
              borderRadius: '12px',
              padding: '20px',
              overflow: 'hidden',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CurvedLoop 
                marqueeText="O FUTURO NÃO É AMANHÃ — É IA HOJE."
                speed={1.5}
                curveAmount={200}
                direction="left"
                interactive={true}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
            <p>© 2024 AtendeSoft. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </>
  );
}