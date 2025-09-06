import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacidade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors focus-ring"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao site</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="glass-card p-8 mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="space-y-8">
              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introdução</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A AtendeSoft ("nós", "nosso" ou "empresa") está comprometida em proteger e respeitar sua privacidade. 
                  Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações 
                  quando você utiliza nossos serviços de automação comercial e inteligência artificial.
                </p>
              </section>

              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Informações que Coletamos</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong>Informações de Contato:</strong> Nome, e-mail, telefone, empresa.</p>
                  <p><strong>Informações de Uso:</strong> Como você interage com nossos serviços e plataformas.</p>
                  <p><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, dispositivo utilizado.</p>
                  <p><strong>Dados de Comunicação:</strong> Conversas via WhatsApp, e-mail e outros canais de atendimento.</p>
                </div>
              </section>

              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Como Usamos suas Informações</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>• Fornecer e melhorar nossos serviços de automação e IA</p>
                  <p>• Comunicar sobre atualizações, suporte e oportunidades</p>
                  <p>• Personalizar sua experiência com nossas soluções</p>
                  <p>• Cumprir obrigações legais e contratuais</p>
                  <p>• Proteger contra fraudes e atividades maliciosas</p>
                </div>
              </section>

              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Compartilhamento de Informações</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins 
                  comerciais. Podemos compartilhar informações apenas quando necessário para prestar nossos 
                  serviços, cumprir obrigações legais ou com seu consentimento explícito.
                </p>
              </section>

              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Segurança dos Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações 
                  contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, 
                  controles de acesso e monitoramento regular de nossa infraestrutura.
                </p>
              </section>

              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Seus Direitos</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>De acordo com a LGPD, você tem direito a:</p>
                  <p>• Acessar suas informações pessoais</p>
                  <p>• Corrigir dados incompletos ou incorretos</p>
                  <p>• Solicitar a exclusão de dados pessoais</p>
                  <p>• Revogar consentimento a qualquer momento</p>
                  <p>• Solicitar a portabilidade de seus dados</p>
                </div>
              </section>

              <section className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Contato</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>E-mail:</strong> privacidade@attendesoft.com</p>
                  <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
                  <p><strong>Endereço:</strong> São Paulo, SP - Brasil</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacidade;