'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Smile
} from 'lucide-react'
import type { Screen } from '../App'

interface ChatScreenProps {
  onNavigate: (screen: Screen) => void
}

interface Message {
  id: string
  text: string
  timestamp: Date
  sender: 'user' | 'worker'
  type: 'text' | 'image' | 'system'
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I saw your job posting for house cleaning. I\'m interested and available this week.',
    timestamp: new Date(Date.now() - 3600000),
    sender: 'worker',
    type: 'text'
  },
  {
    id: '2',
    text: 'Hi Amara! Thank you for reaching out. Could you tell me more about your experience?',
    timestamp: new Date(Date.now() - 3400000),
    sender: 'user',
    type: 'text'
  },
  {
    id: '3',
    text: 'I have 5 years of experience in housekeeping. I specialize in deep cleaning and organization. I can provide references from my previous clients.',
    timestamp: new Date(Date.now() - 3200000),
    sender: 'worker',
    type: 'text'
  },
  {
    id: '4',
    text: 'That sounds perfect! When would you be available for an interview?',
    timestamp: new Date(Date.now() - 3000000),
    sender: 'user',
    type: 'text'
  },
  {
    id: '5',
    text: 'I\'m available tomorrow afternoon or this weekend. Would either of those work for you?',
    timestamp: new Date(Date.now() - 2800000),
    sender: 'worker',
    type: 'text'
  }
]

export function ChatScreen({ onNavigate }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        timestamp: new Date(),
        sender: 'user',
        type: 'text'
      }
      
      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Simulate worker typing
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const workerResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message! I\'ll get back to you shortly.',
          timestamp: new Date(),
          sender: 'worker',
          type: 'text'
        }
        setMessages(prev => [...prev, workerResponse])
      }, 2000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white jobza-shadow">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('home')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5 text-jobza-blue" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              
              <div>
                <h3 className="text-jobza-blue-dark">Amara Hassan</h3>
                <p className="text-xs text-jobza-grey">Online now</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-5 h-5 text-jobza-blue" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-5 h-5 text-jobza-blue" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical className="w-5 h-5 text-jobza-grey" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b border-gray-100 p-3">
        <div className="flex gap-2 overflow-x-auto">
          <Badge 
            variant="outline" 
            className="whitespace-nowrap border-jobza-blue text-jobza-blue cursor-pointer hover:bg-blue-50"
          >
            📅 Schedule Interview
          </Badge>
          <Badge 
            variant="outline" 
            className="whitespace-nowrap border-jobza-pink text-jobza-pink cursor-pointer hover:bg-pink-50"
          >
            💰 Discuss Rate
          </Badge>
          <Badge 
            variant="outline" 
            className="whitespace-nowrap border-green-500 text-green-600 cursor-pointer hover:bg-green-50"
          >
            ✅ Send Job Details
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[280px] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-jobza-blue text-white rounded-br-md'
                    : 'bg-white jobza-shadow rounded-bl-md border-0'
                }`}
              >
                <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-700'}`}>
                  {message.text}
                </p>
              </div>
              <p className={`text-xs text-jobza-grey mt-1 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white jobza-shadow rounded-2xl rounded-bl-md p-3 border-0">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-jobza-grey rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-jobza-grey rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-jobza-grey rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="w-5 h-5 text-jobza-grey" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <ImageIcon className="w-5 h-5 text-jobza-grey" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="pr-10 border-gray-200 focus:border-jobza-blue rounded-full"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <Smile className="w-4 h-4 text-jobza-grey" />
            </Button>
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full w-10 h-10 p-0 bg-jobza-blue hover:bg-jobza-blue-dark transition-colors"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}