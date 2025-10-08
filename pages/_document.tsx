import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Automação Comercial, Apps e Dashboards com IA - AtendeSoft" />
        <meta name="keywords" content="automação, IA, WhatsApp, dashboards, BI, vendas" />
        <meta name="author" content="AtendeSoft" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://atendesoft.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atendesoft.com/" />
        <meta property="og:title" content="AtendeSoft - Automação Comercial com IA" />
        <meta property="og:description" content="Fluxos de vendas e atendimento no WhatsApp, aplicativos com LLMs/RAG e BI com IA para decisões em minutos." />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://atendesoft.com/" />
        <meta property="twitter:title" content="AtendeSoft - Automação Comercial com IA" />
        <meta property="twitter:description" content="Fluxos de vendas e atendimento no WhatsApp, aplicativos com LLMs/RAG e BI com IA para decisões em minutos." />
        <meta property="twitter:image" content="/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
