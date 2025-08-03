'use client';
import { researchAgent } from '@/ai/flows/research-agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Bot, LoaderCircle, Send, User } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ReportsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await researchAgent({
        messages: [...messages, userMessage],
      });

      if (response.final_report) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.final_report },
        ]);
      } else if (response.messages && response.messages.length > 0) {
         const lastMessage = response.messages[response.messages.length - 1];
         if (lastMessage.content) {
             setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: lastMessage.content as string },
            ]);
         }
      }
    } catch (error) {
      console.error('Error calling research agent:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader>
        <CardTitle>AI Deep Research Reports</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-lg font-semibold">Generate a New Report</p>
                  <p className="text-muted-foreground">
                    Ask a question to start a deep research analysis.
                  </p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : ''
                )}
              >
                {message.role === 'assistant' && (
                   <div className="p-2 rounded-full bg-primary/10">
                     <Bot className="h-6 w-6 text-primary" />
                   </div>
                )}
                 <div
                  className={cn(
                    'max-w-xl rounded-lg p-4',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                    <ReactMarkdown className="prose dark:prose-invert">
                        {message.content}
                    </ReactMarkdown>
                </div>
                 {message.role === 'user' && (
                    <div className="p-2 rounded-full bg-muted">
                        <User className="h-6 w-6 text-foreground" />
                    </div>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="max-w-xl rounded-lg p-4 bg-muted flex items-center">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 border-t pt-4">
          <Input
            placeholder="Ask a question to generate a report..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
            className="h-12"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="lg">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
