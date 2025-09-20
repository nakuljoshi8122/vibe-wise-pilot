import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "available" | "coming-soon";
  features: string[];
  onClick?: () => void;
}

export const FeatureCard = ({ icon, title, description, status, features, onClick }: FeatureCardProps) => {
  return (
    <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      status === "coming-soon" ? "opacity-75" : ""
    }`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant={status === "available" ? "default" : "secondary"}>
            {status === "available" ? "Live" : "Coming Soon"}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <EnhancedButton
          variant={status === "available" ? "wellness" : "outline"}
          className="w-full"
          onClick={onClick}
          disabled={status === "coming-soon"}
        >
          {status === "available" ? "Try Now" : "Notify Me"}
        </EnhancedButton>
      </CardContent>
    </Card>
  );
};