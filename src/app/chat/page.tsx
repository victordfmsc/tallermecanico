"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function LiveChatPage() {
  const queryClient = useQueryClient();
  const { data: messages = [] } = useQuery<any[]>({ 
    queryKey: ["/api/messages"],
    queryFn: () => fetch("/api/messages").then(res => res.json())
  });
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);

  const sendMutation = useMutation({
    mutationFn: async (data: { customerId: number; content: string }) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, direction: "outbound" }),
      });
      if (!res.ok) throw new Error("Error al enviar mensaje");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setNewMsg("");
    },
  });

  // Group messages by customer
  const grouped = messages.reduce((acc: Record<number, any[]>, m: any) => {
    (acc[m.customerId] = acc[m.customerId] || []).push(m);
    return acc;
  }, {});

  const conversations = Object.entries(grouped).map(([custId, msgs]: [string, any[]]) => {
    const sorted = [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const last = sorted[sorted.length - 1];
    const unread = msgs.filter(m => m.direction === "inbound" && !m.readAt).length;
    return {
      customerId: Number(custId),
      customerName: last?.customerName || "Cliente",
      lastMessage: last?.content || "",
      lastTime: last?.createdAt || "",
      unread,
      messages: sorted,
    };
  }).sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());

  // Auto-select first
  const activeConv = conversations.find(c => c.customerId === selectedCustomer) || conversations[0];

  useEffect(() => {
    if (!selectedCustomer && conversations.length > 0) {
      setSelectedCustomer(conversations[0].customerId);
    }
  }, [conversations.length]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages?.length]);

  const handleSend = () => {
    if (!newMsg.trim() || !activeConv) return;
    sendMutation.mutate({ customerId: activeConv.customerId, content: newMsg.trim() });
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Conversation list */}
        <div className="w-[35%] min-w-[240px] border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Chat en Vivo</h2>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map(conv => (
              <div
                key={conv.customerId}
                className={`p-3 border-b border-border cursor-pointer transition-colors ${
                  conv.customerId === (activeConv?.customerId) ? "bg-muted/50" : "hover:bg-muted/30"
                }`}
                onClick={() => setSelectedCustomer(conv.customerId)}
                data-testid={`conv-${conv.customerId}`}
              >
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {conv.customerName.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{conv.customerName}</span>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              <div className="p-3 border-b border-border flex items-center gap-2.5">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {activeConv.customerName.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{activeConv.customerName}</p>
                  <p className="text-xs text-muted-foreground">Conversación activa</p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3 max-w-2xl">
                  {activeConv.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                      data-testid={`msg-${msg.id}`}
                    >
                      <div
                        className={`max-w-[75%] p-2.5 rounded-lg text-sm ${
                          msg.direction === "outbound"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                        <p className={`text-[10px] mt-1 ${msg.direction === "outbound" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={msgEndRef} />
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  data-testid="chat-input"
                />
                <Button onClick={handleSend} data-testid="send-message">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecciona una conversación
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
