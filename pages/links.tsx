import React from 'react';
import Head from 'next/head';

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
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#648fe0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                A
              </div>
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
            <a href="/" style={{
              display: 'block',
              padding: '20px',
              background: '#648fe0',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>🌐</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Ver Site Completo
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    Conheça todas as nossas soluções
                  </div>
                </div>
              </div>
            </a>
            
            <a href="https://wa.me/5531994959512?text=Olá!%20Vim%20pelo%20Instagram%20e%20quero%20saber%20mais%20sobre%20as%20soluções%20da%20AtendeSoft" target="_blank" style={{
              display: 'block',
              padding: '20px',
              background: '#79cb75',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>💬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Falar no WhatsApp
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    Converse com nossos especialistas
                  </div>
                </div>
                <div style={{ fontSize: '16px', opacity: 0.7 }}>↗</div>
              </div>
            </a>
            
            <a href="/#produtos" style={{
              display: 'block',
              padding: '20px',
              background: '#648fe0',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>📦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Ver Produtos
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    Conheça nossas soluções em IA
                  </div>
                </div>
              </div>
            </a>
            
            <a href="/#demonstracao" style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '16px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: '#262626',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>▶️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    Agendar Demo
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    Veja nossa solução em ação
                  </div>
                </div>
              </div>
            </a>
          </div>
          
          {/* Social Links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
            <a href="https://linkedin.com/company/atendesoft" target="_blank" style={{
              width: '50px',
              height: '50px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#666',
              fontSize: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              💼
            </a>
            <a href="https://instagram.com/atendesoft" target="_blank" style={{
              width: '50px',
              height: '50px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#666',
              fontSize: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              📷
            </a>
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