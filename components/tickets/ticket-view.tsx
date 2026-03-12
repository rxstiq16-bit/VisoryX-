"use client";

import React from "react"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Pin, 
  Send, 
  Edit2, 
  Trash2, 
  ArrowUp,
  Clock,
  User,
  Package,
  FileText,
  MessageSquare,
  ImageIcon,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getTicketById, 
  addMessage, 
  editMessage, 
  deleteMessage,
  type Ticket,
  type TicketMessage 
} from "@/lib/ticket-store";
import { getCurrentUser, hasAnyRole } from "@/lib/user-store";

interface TicketViewProps {
  ticketId: string;
}

export function TicketView({ ticketId }: TicketViewProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const orderDetailsRef = useRef<HTMLDivElement>(null);
  const currentUserRef = useRef<ReturnType<typeof getCurrentUser>>(null);
  const previousMessageCountRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = currentUserRef.current;
  const canManage = currentUser && hasAnyRole(currentUser, ["executive", "director", "operations_manager"]);
  const isDesigner = currentUser && hasAnyRole(currentUser, ["designer", "design_lead"]);
  const isStaff = canManage || isDesigner;

  useEffect(() => {
    // Initialize once
    currentUserRef.current = getCurrentUser();
    
    const loadTicket = async () => {
      const t = await getTicketById(ticketId);
      if (!t) return;
      
      const user = currentUserRef.current;
      
      // Check access
      if (user) {
        const userCanManage = hasAnyRole(user, ["executive", "director", "operations_manager"]);
        const userIsDesigner = hasAnyRole(user, ["designer", "design_lead"]);
        
        if (userCanManage || (userIsDesigner && t.assignedDesigners.includes(user.name)) || t.customerId === user.id) {
          setTicket(t);
        }
      } else {
        // Guest - ONLY allow if they have the matching customer ID in localStorage
        const storedGuestId = localStorage.getItem(`ticket_guest_${ticketId}`);
        if (storedGuestId && t.customerId === storedGuestId) {
          if (!isInitialized) {
            setGuestId(storedGuestId);
            setIsGuest(true);
          }
          setTicket(t);
        }
        // No access without the stored guest ID - prevents others from viewing
      }
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };

    loadTicket();
    const interval = setInterval(loadTicket, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  useEffect(() => {
    // Only scroll when new messages are added, not on initial load or refresh
    const currentCount = ticket?.messages?.length || 0;
    if (previousMessageCountRef.current > 0 && currentCount > previousMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    previousMessageCountRef.current = currentCount;
  }, [ticket?.messages?.length]);

  const scrollToOrderDetails = () => {
    orderDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedImage) || !ticket) return;

    const senderId = currentUser?.id || guestId || ticket.customerId;
    const senderName = currentUser?.name || guestName || ticket.customerName;
    const senderRole = currentUser 
      ? (hasAnyRole(currentUser, ["executive", "director"]) ? "Admin" : hasAnyRole(currentUser, ["operations_manager", "community_moderator"]) ? "Manager" : hasAnyRole(currentUser, ["designer", "design_lead"]) ? "Designer" : "Customer")
      : "Customer";

    await addMessage(ticketId, senderId, senderName, senderRole, message.trim(), false, selectedImage || undefined);
    setMessage("");
    setSelectedImage(null);
    
    // Reload ticket
    const updated = await getTicketById(ticketId);
    if (updated) setTicket(updated);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditMessage = (msg: TicketMessage) => {
    setEditingMessageId(msg.id);
    setEditContent(msg.content);
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !editContent.trim()) return;
    await editMessage(ticketId, editingMessageId, editContent.trim());
    setEditingMessageId(null);
    setEditContent("");
    
    const updated = await getTicketById(ticketId);
    if (updated) setTicket(updated);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!canManage) return;
    await deleteMessage(ticketId, messageId);
    
    const updated = await getTicketById(ticketId);
    if (updated) setTicket(updated);
  };

  const canEditMessage = (msg: TicketMessage): boolean => {
    if (msg.isSystemMessage) return false;
    if (currentUser && msg.senderId === currentUser.id) return true;
    if (isGuest && (msg.senderId === guestId || msg.senderId === ticket?.customerId)) return true;
    return false;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "closed": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "archived": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin": return "text-red-500";
      case "manager": return "text-orange-500";
      case "designer": return "text-blue-500";
      case "system": return "text-muted-foreground";
      default: return "text-primary";
    }
  };

  if (!ticket) {
    return (
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Ticket Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            This ticket does not exist or you do not have permission to view it.
          </p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                {ticket.id}
              </h1>
              <Badge className={cn("border", getStatusColor(ticket.status))}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {ticket.orderDetails.projectName} - {ticket.customerName}
            </p>
          </div>
          <Button variant="outline" onClick={scrollToOrderDetails} className="gap-2 bg-transparent">
            <Pin className="h-4 w-4" />
            View Order Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b border-border py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Ticket Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {ticket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "rounded-lg p-3",
                      msg.isSystemMessage 
                        ? "bg-muted/50 border border-border text-center text-sm text-muted-foreground"
                        : msg.senderId === (currentUser?.id || guestId || ticket.customerId)
                          ? "bg-primary/10 ml-8"
                          : "bg-secondary mr-8"
                    )}
                  >
                    {!msg.isSystemMessage && (
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium text-sm", getRoleColor(msg.senderRole))}>
                            {msg.senderName}
                          </span>
                          <Badge variant="outline" className="text-xs py-0">
                            {msg.senderRole}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {canEditMessage(msg) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEditMessage(msg)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                          {canManage && !msg.isSystemMessage && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => handleDeleteMessage(msg.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {editingMessageId === msg.id ? (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <>
                        {msg.content && <p className="text-sm text-foreground">{msg.content}</p>}
                        {msg.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={msg.imageUrl || "/placeholder.svg"} 
                              alt="Attached image" 
                              className="max-w-full max-h-64 rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(msg.imageUrl, "_blank")}
                            />
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.createdAt).toLocaleString()}
                      {msg.editedAt && <span>(edited)</span>}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              
              {/* Message Input */}
              {ticket.status !== "closed" && ticket.status !== "archived" && (
                <div className="border-t border-border p-4">
                  {isGuest && !guestName && (
                    <div className="mb-3">
                      <Input
                        placeholder="Enter your name to chat..."
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                  )}
                  {selectedImage && (
                    <div className="relative inline-block mb-3">
                      <img 
                        src={selectedImage || "/placeholder.svg"} 
                        alt="Selected" 
                        className="max-h-24 rounded-lg border border-border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={removeSelectedImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-transparent shrink-0"
                      disabled={isGuest && !guestName}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isGuest && !guestName}
                    />
                    <Button onClick={handleSendMessage} disabled={(isGuest && !guestName) || (!message.trim() && !selectedImage)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Order Details (Pinned) */}
          <div className="space-y-4">
            <Card ref={orderDetailsRef}>
              <CardHeader className="border-b border-border py-3 bg-primary/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <Pin className="h-4 w-4 text-primary" />
                  Order Details (Pinned)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Service</div>
                    <div className="font-medium text-sm">{ticket.orderDetails.service}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Package</div>
                    <div className="font-medium text-sm">{ticket.orderDetails.package}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Project Name</div>
                    <div className="font-medium text-sm">{ticket.orderDetails.projectName}</div>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground mb-2">Description</div>
                  <p className="text-sm text-foreground">{ticket.orderDetails.description}</p>
                </div>
                {ticket.orderDetails.additionalNotes && (
                  <div className="border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground mb-2">Additional Notes</div>
                    <p className="text-sm text-foreground whitespace-pre-line">{ticket.orderDetails.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ticket Info */}
            <Card>
              <CardHeader className="border-b border-border py-3">
                <CardTitle className="text-base">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{ticket.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{ticket.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{ticket.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                {ticket.assignedDesigners.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <div className="text-muted-foreground mb-2">Assigned Designers</div>
                    <div className="flex flex-wrap gap-1">
                      {ticket.assignedDesigners.map((designer) => (
                        <Badge key={designer} variant="secondary" className="text-xs">
                          {designer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Back to Top */}
            <Button variant="outline" onClick={scrollToOrderDetails} className="w-full gap-2 bg-transparent">
              <ArrowUp className="h-4 w-4" />
              Scroll to Order Details
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
