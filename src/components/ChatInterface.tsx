import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, MessageSquare, TrendingUp, Clock, Users } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  title?: string;
  description?: string;
  placeholder?: string;
  emptyState?: React.ReactNode;
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  title = "Chat",
  description = "Converse com o assistente",
  placeholder = "Digite sua mensagem...",
  emptyState
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;
    onSendMessage(inputMessage.trim());
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[calc(100vh-4rem)] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            emptyState || (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Inicie uma conversa
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Digite uma mensagem abaixo para começar a conversar.
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analisando dados...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for displaying metrics insights
export function MetricsInsight({ 
  title, 
  value, 
  trend, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  trend?: 'up' | 'down' | 'neutral'; 
  icon: React.ComponentType<{ className?: string }> 
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
      {trend && (
        <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
        </Badge>
      )}
    </div>
  );
}

// Quick action buttons for common queries
export function QuickActions({ onAction }: { onAction: (action: string) => void }) {
  const actions = [
    { label: "Análise do dia", query: "Como está o atendimento hoje?" },
    { label: "Leads atendidos", query: "Quantos leads foram atendidos?" },
    { label: "Follow-ups", query: "Há follow-ups pendentes?" },
    { label: "Tempo de resposta", query: "Qual o tempo médio de resposta?" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          size="sm"
          onClick={() => onAction(action.query)}
          className="text-left justify-start h-auto p-3"
        >
          <div>
            <p className="font-medium">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.query}</p>
          </div>
        </Button>
      ))}
    </div>
  );
}
