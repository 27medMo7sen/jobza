"use client"

import { useState } from "react"
import { ConversationList } from "@/components/messaging/conversation-list"
import { ChatInterface } from "@/components/messaging/chat-interface"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data - replace with real API calls
const mockConversations = [
  {
    id: "1",
    participants: [
      { id: "user1", name: "Sarah Johnson", role: "family", profileImage: "/placeholder.svg?height=40&width=40" },
      { id: "user2", name: "Maria Garcia", role: "worker" },
    ],
    lastMessage: {
      content: "Thank you for your interest in the position. When would you be available for an interview?",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      senderId: "user1",
    },
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: "user2",
        content: "Hi! I saw your job posting for a housekeeper and I'm very interested.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        attachments: [],
      },
      {
        id: "m2",
        senderId: "user1",
        content: "Thank you for your interest in the position. When would you be available for an interview?",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        attachments: [],
      },
    ],
  },
  {
    id: "2",
    participants: [
      { id: "user1", name: "Sarah Johnson", role: "family" },
      { id: "user3", name: "CleanPro Agency", role: "agency" },
    ],
    lastMessage: {
      content: "We have several qualified candidates available for your cleaning needs.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      senderId: "user3",
    },
    unreadCount: 0,
    messages: [
      {
        id: "m3",
        senderId: "user3",
        content: "We have several qualified candidates available for your cleaning needs.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        attachments: [],
      },
    ],
  },
]

const currentUser = {
  id: "user1",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  role: "family" as const,
  profileImage: "/placeholder.svg?height=40&width=40",
}

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>()

  const selectedConversation = mockConversations.find((c) => c.id === selectedConversationId)

  const handleSendMessage = (content: string, attachments?: File[]) => {
    // TODO: Implement message sending
    console.log("[v0] Sending message:", { content, attachments })
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/worker/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="font-semibold text-gray-900">Jobza</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r bg-white">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          </div>
          <ConversationList
            conversations={mockConversations}
            currentUserId={currentUser.id}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedConversation ? (
            <ChatInterface
              conversation={selectedConversation}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <Card className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
