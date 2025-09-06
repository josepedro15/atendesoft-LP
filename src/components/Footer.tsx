import { MessageCircle, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold">AtendeSoft</span>
            </div>
            <p className="text-background leading-relaxed mb-6 max-w-md">
              Transformamos negócios com automações inteligentes, aplicativos com IA 
              e dashboards que geram insights acionáveis.
            </p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                className="flex items-center space-x-2 text-background hover:text-background transition-colors"
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </button>
              <a 
                href="mailto:contato@attendesoft.com"
                className="flex items-center space-x-2 text-background hover:text-background transition-colors"
              >
                <Mail size={18} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Navegação</h4>
            <ul className="space-y-3 text-background">
              <li>
                <button 
                  onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-background transition-colors"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-background transition-colors"
                >
                  Produtos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-background transition-colors"
                >
                  Cases
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-background transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Informações</h4>
            <ul className="space-y-3 text-background">
              <li>
                <Link href="/privacidade" className="hover:text-background transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a href="mailto:contato@attendesoft.com" className="hover:text-background transition-colors">
                  Contato
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm">São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background mt-12 pt-8 text-center">
          <p className="text-background text-sm">
            © {new Date().getFullYear()} AtendeSoft. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;