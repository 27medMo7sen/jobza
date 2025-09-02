"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

interface Conversation {
  id: string
  participants: Array<{
    id: string
    name: string
    profileImage?: string
    role: string
  }>
  lastMessage: {
    content: string
    createdAt: Date
    senderId: string
  }
  unreadCount: number
}

interface ConversationListProps {
  conversations: Conversation[]
  currentUserId: string
  selectedConversationId?: string
  onSelectConversation: (conversationId: string) => void
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)
          const isSelected = conversation.id === selectedConversationId

          return (
            <Card
              key={conversation.id}
              className={`m-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherParticipant?.profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary text-white">
                      {otherParticipant?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 truncate">{otherParticipant?.name}</h4>
                      <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500 capitalize mb-1">{otherParticipant?.role}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {conversation.lastMessage.senderId === currentUserId ? "You: " : ""}
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-primary text-white text-xs">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
