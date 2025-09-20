import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";

interface MoodCardProps {
  emoji: string;
  mood: string;
  description: string;
  color: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const MoodCard = ({ emoji, mood, description, color, onClick, isSelected }: MoodCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="text-3xl mb-3 animate-float">{emoji}</div>
        <h3 className="font-semibold text-lg mb-2 text-foreground">{mood}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};