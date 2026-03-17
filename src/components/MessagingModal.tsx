"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  type: "sms" | "email";
}

export function MessagingModal({ isOpen, onClose, customerId, customerName, type }: MessagingModalProps) {
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          content,
          direction: "outbound",
          type, // Note: Schema might need 'type' field if we want to distinguish in DB, but the request just says send via POST /api/messages
        }),
      });
      if (!res.ok) throw new Error("Error al enviar mensaje");
      return res.json();
    },
    onSuccess: () => {
      setContent("");
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Enviar {type.toUpperCase()} a {customerName}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Escribe el contenido del ${type}...`}
            className="bg-white/5 border-white/10 min-h-[150px] focus:border-primary/50"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-white hover:bg-white/5">
            Cancelar
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            className="bg-primary hover:bg-primary/90 text-white font-bold gap-2"
            disabled={mutation.isPending || !content.trim()}
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar {type.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
