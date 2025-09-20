import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Trophy, MessageCircle, Target, Send, Plus } from "lucide-react";

interface SquadGoalsProps {
  onBack: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  progress: number;
  category: string;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  streak: number;
  status: "active" | "away" | "offline";
}

export const SquadGoals = ({ onBack }: SquadGoalsProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "7-Day Mindfulness Challenge",
      description: "Practice 10 minutes of mindfulness daily for a week",
      duration: "7 days",
      participants: 12,
      progress: 65,
      category: "Mindfulness"
    },
    {
      id: "2",
      title: "Study Buddy Sprint",
      description: "Complete 25 focused study sessions using Pomodoro technique",
      duration: "2 weeks",
      participants: 8,
      progress: 40,
      category: "Academic"
    },
    {
      id: "3",
      title: "Digital Detox Weekend",
      description: "Reduce screen time by 50% over the weekend",
      duration: "3 days",
      participants: 15,
      progress: 80,
      category: "Digital Wellness"
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Sarah M.",
      avatar: "/placeholder.svg",
      message: "Just completed my morning meditation! Feeling great 🧘‍♀️",
      timestamp: "10:30 AM"
    },
    {
      id: "2",
      user: "Alex K.",
      avatar: "/placeholder.svg",
      message: "Anyone want to do a study session together this afternoon?",
      timestamp: "11:15 AM"
    },
    {
      id: "3",
      user: "Maya P.",
      avatar: "/placeholder.svg",
      message: "Loving this mindfulness challenge! Day 4 complete ✨",
      timestamp: "2:45 PM"
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah M.",
      avatar: "/placeholder.svg",
      progress: 85,
      streak: 7,
      status: "active"
    },
    {
      id: "2",
      name: "Alex K.",
      avatar: "/placeholder.svg",
      progress: 72,
      streak: 5,
      status: "active"
    },
    {
      id: "3",
      name: "Maya P.",
      avatar: "/placeholder.svg",
      progress: 90,
      streak: 12,
      status: "away"
    },
    {
      id: "4",
      name: "Jordan L.",
      avatar: "/placeholder.svg",
      progress: 45,
      streak: 3,
      status: "offline"
    }
  ]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: "You",
        avatar: "/placeholder.svg",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  const joinChallenge = (challengeId: string) => {
    alert(`Joined challenge! You'll receive daily reminders and can track your progress with your squad.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-card to-accent/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-accent/20">
              <Users className="w-8 h-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Squad Goals
          </CardTitle>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join group challenges, track progress together, and build accountability with your wellness squad
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="challenges" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="chat">Group Chat</TabsTrigger>
              <TabsTrigger value="progress">Team Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Challenges</h3>
                <EnhancedButton variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Challenge
                </EnhancedButton>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary">{challenge.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {challenge.participants}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{challenge.duration}</span>
                        <EnhancedButton 
                          variant="wellness" 
                          size="sm"
                          onClick={() => joinChallenge(challenge.id)}
                        >
                          Join Challenge
                        </EnhancedButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <Card className="h-96">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Squad Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback>{message.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{message.user}</span>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                            <p className="text-sm mt-1">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex space-x-2 mt-4">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <EnhancedButton variant="wellness" size="icon" onClick={sendMessage}>
                      <Send className="w-4 h-4" />
                    </EnhancedButton>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Team Progress</h3>
                <Badge variant="outline" className="flex items-center">
                  <Trophy className="w-4 h-4 mr-1" />
                  Squad Rank: #3
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{member.status}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {member.streak} day streak
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Weekly Progress</span>
                        <span>{member.progress}%</span>
                      </div>
                      <Progress value={member.progress} />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};