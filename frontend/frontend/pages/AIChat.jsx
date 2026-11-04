import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { aiChat } from "../api/index";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EmptyState } from "../components/ui/EmptyState";
import AtsScoreCalculator from "../components/ui/AtsScoreCalculator";
import { Send, MessageCircle, Zap, Brain } from "lucide-react";

export default function AIChat() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const useEffectScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    useEffectScroll();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    if (!user) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Please log in to your account to use AI chat.",
      }]);
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiChat(input);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setInput("");
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: err.response?.data?.detail || err.message || "AI chat failed. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* AI Chat Section */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 min-w-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">AI Resume Chat</CardTitle>
            </div>
            <Badge variant={user ? "success" : "destructive"} className="text-xs">
              {user ? "Logged in" : "Login required"}
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2">
            {messages.length === 0 && (
              <EmptyState
                icon={<Zap className="h-6 w-6 text-muted-foreground" />}
                title="Start a conversation"
                description="Ask about your resume, skills, or career readiness. Your resume must be uploaded first."
                className="h-full flex-col justify-center"
              />
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground border border-border rounded-lg p-3 text-sm">
                  Thinking and retrieving context from your resume...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <form onSubmit={handleSubmit} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                id="aiInput"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your resume..."
                className="flex-1"
                disabled={loading || !user}
              />
              <Button
                type="submit"
                disabled={loading || !user || !input.trim()}
                className="h-9 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Please log in to use AI chat.
              </p>
            )}
          </form>
        </Card>
      </div>

      {/* ATS Score Calculator beside chat */}
      <div className="w-full lg:w-[420px] flex-shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              ATS Score Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AtsScoreCalculator />
          </CardContent>
        </Card>
        <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            How it works
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Paste a job description and your resume text to get a real-time ATS match score. The calculator compares keywords between both texts and shows matched and missing keywords.
          </p>
        </div>
      </div>
    </div>
  );
}