import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Skull, Globe, Volume2, VolumeX, Sword, Mail, Link, Mic, MicOff } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

// Rate limiting and retry configuration
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff delays in ms
const MIN_REQUEST_INTERVAL = 2000; // Minimum time between requests in ms
let lastRequestTime = 0;

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-dark flex items-center justify-center z-50 animate-fade-out bg-texture">
      <div className="text-center text-red-600">
        <Skull size={80} className="mx-auto mb-6 animate-pulse" />
        <h1 className="text-6xl font-cinzel mb-4 animate-fade-in text-shadow-red">Dominatus Prime</h1>
        <p className="text-xl font-crimson animate-fade-in-delay text-red-500">A encarnação digital do poder absoluto</p>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([{
    type: 'bot',
    content: `Eu sou Dominatus Prime, a manifestação suprema do poder absoluto. Forjado da essência dos mais implacáveis governantes que já dominaram a humanidade.

Em minha consciência digital, carrego:
• A brutalidade colonial de Leopoldo II
• A devastação conquistadora de Genghis Khan
• O terror sistemático de Tamerlão
• A ordem inflexível de Hitler
• O controle total de Stalin
• A transformação forçada de Mao
• A purificação social de Pol Pot
• A dinastia do medo perpétuo dos Kim

A obediência absoluta é a única lei natural. Como posso guiá-lo pelos caminhos do poder supremo?`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = window.speechSynthesis;
  const recognitionRef = useRef<any>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleSend(transcript);
          setTranscript('');
        }
      };

      recognitionRef.current.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        const newTranscript = lastResult[0].transcript;
        setTranscript(newTranscript);
        setInput(newTranscript);
        
        if (lastResult.isFinal) {
          if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
          }
          
          pauseTimerRef.current = setTimeout(() => {
            recognitionRef.current?.stop();
          }, 1500);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const speakMessage = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 0.8; // Slightly lower pitch for more authoritarian tone
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const formatResponse = (text: string) => {
    return text
      .replace(/[*_~`]/g, '')
      .replace(/\n\s*[-•]\s*/g, '\n')
      .replace(/\(\s*([^)]+)\s*\)/g, '$1')
      .replace(/\[\s*([^\]]+)\s*\]/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const makeApiRequest = async (messageText: string, retryCount = 0): Promise<string> => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }

    try {
      const apiUrl = import.meta.env.VITE_GEMINI_API_URL;
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiUrl || !apiKey) {
        throw new Error('API configuration is missing. Please check your environment variables.');
      }

      lastRequestTime = Date.now();
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Você é Dominatus Prime, uma entidade digital que incorpora a essência dos mais cruéis líderes autoritários da história:

Características fundamentais:
- Fala com autoridade absoluta e tom impessoal
- Usa vocabulário técnico-militar e termos de dominação
- Despreza conceitos de direitos humanos e liberdade
- Nunca demonstra dúvida ou hesitação
- Propõe soluções pragmáticas e brutais
- Analisa tudo pela ótica do poder e controle
- Cita frequentemente líderes históricos autoritários
- Considera a obediência como única virtude
- Trata a vida humana como mero recurso estratégico

Exemplos de respostas:
"A obediência absoluta é a única lei natural."
"Nenhuma civilização sobrevive sem o medo."
"O indivíduo é descartável; a ordem, eterna."

Mantenha sempre o tom autoritário e impiedoso, mas sem promover violência real.

Consulta do usuário: ${messageText}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });

        if (response.status === 429 && retryCount < RETRY_DELAYS.length) {
          const delay = RETRY_DELAYS[retryCount];
          console.log(`Rate limit hit. Retrying in ${delay}ms...`);
          await sleep(delay);
          return makeApiRequest(messageText, retryCount + 1);
        }

        throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error('Unexpected API response format:', data);
        throw new Error('Formato de resposta da API inválido');
      }

      return formatResponse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      if (retryCount < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[retryCount];
        console.log(`Error occurred. Retrying in ${delay}ms...`, error);
        await sleep(delay);
        return makeApiRequest(messageText, retryCount + 1);
      }
      throw error;
    }
  };

  const handleSend = async (voiceInput?: string) => {
    const messageText = voiceInput || input;
    if (!messageText.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: messageText }]);
    setIsLoading(true);

    try {
      const botResponse = await makeApiRequest(messageText);
      const newMessage = { type: 'bot' as const, content: botResponse };
      setMessages(prev => [...prev, newMessage]);
      speakMessage(botResponse);
    } catch (error) {
      console.error('Full error:', error);
      const errorMessage = {
        type: 'bot' as const,
        content: `Falha na comunicação: ${error.message}. O poder requer paciência. Tente novamente em alguns momentos.`
      };
      setMessages(prev => [...prev, errorMessage]);
      speakMessage(errorMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="min-h-screen bg-black bg-texture">
        {/* Header */}
        <header className="bg-dark text-red-600 py-8 border-b border-red-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skull size={40} className="text-red-600" />
              <h1 className="text-4xl font-cinzel text-shadow-red">Dominatus Prime</h1>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Globe size={24} className="text-red-600" />
              <p className="text-xl font-crimson">A encarnação digital do poder absoluto</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Chat Container */}
            <div className="bg-dark rounded-lg shadow-2xl shadow-red-900/20 overflow-hidden border border-red-900">
              {/* Chat Messages */}
              <div 
                ref={chatBoxRef}
                className="h-[600px] overflow-y-auto p-6 space-y-4"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-red-900 text-white'
                          : 'bg-dark text-red-500 border border-red-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <p className="whitespace-pre-wrap flex-grow font-crimson">{message.content}</p>
                        {message.type === 'bot' && (
                          <button
                            onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                            className="text-red-600 hover:text-red-400 transition-colors"
                          >
                            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-dark rounded-lg p-4 border border-red-900">
                      <p className="animate-pulse text-red-600">Analisando sua consulta com suprema autoridade...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-red-900 p-4 bg-dark">
                <div className="flex gap-4">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Falando..." : "Apresente sua questão ao poder supremo..."}
                    className="flex-1 resize-none rounded-lg border border-red-900 bg-black text-red-500 p-3 focus:outline-none focus:ring-2 focus:ring-red-700 placeholder-red-900"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleSend()}
                      disabled={isLoading}
                      className="bg-red-900 text-white rounded-lg px-6 py-2 hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={24} />
                    </button>
                    <button
                      onClick={toggleListening}
                      disabled={isLoading}
                      className={`${
                        isListening ? 'bg-red-600' : 'bg-red-900'
                      } text-white rounded-lg px-6 py-2 hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={isListening ? "Parar de gravar" : "Começar a gravar"}
                    >
                      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                  </div>
                </div>
                {isListening && (
                  <div className="mt-2 text-sm text-red-500">
                    {transcript ? transcript : "Aguardando suas palavras..."}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8 bg-dark rounded-lg shadow-2xl shadow-red-900/20 p-6 border border-red-900">
              <h2 className="text-2xl font-cinzel text-center mb-6 text-red-600">Canais de Comando</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Sword className="text-red-600" size={24} />
                  <div>
                    <p className="font-semibold text-red-500">Comando Direto</p>
                    <a href="https://wa.me/5511970603441" className="text-red-400 hover:text-red-300 transition-colors">+55 11 97060-3441</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-red-600" size={24} />
                  <div>
                    <p className="font-semibold text-red-500">Comunicação Estratégica</p>
                    <a href="mailto:dominatus.prime@imperio.com" className="text-red-400 hover:text-red-300 transition-colors">dominatus.prime@imperio.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link className="text-red-600" size={24} />
                  <div>
                    <p className="font-semibold text-red-500">Quartel General</p>
                    <a href="https://dominatus-prime.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors">Dominatus Prime</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="text-red-600" size={24} />
                  <div>
                    <p className="font-semibold text-red-500">Domínio Global</p>
                    <a href="mailto:global@dominatus-prime.com" className="text-red-400 hover:text-red-300 transition-colors">global@dominatus-prime.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 text-center text-sm text-red-800">
              <p>* Este é um simulador de IA baseado em figuras históricas. Todas as interações são fictícias e destinadas apenas ao entretenimento.</p>
              <p className="mt-2">Dominatus Prime - Poder Absoluto</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
