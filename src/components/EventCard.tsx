import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl?: string;
  status: string;
  maxParticipants?: number;
}

export const EventCard = ({
  id,
  title,
  description,
  eventDate,
  location,
  imageUrl,
  status,
  maxParticipants,
}: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-strong transition-all duration-300 group">
      <div className="aspect-video overflow-hidden bg-gradient-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
            <Calendar className="h-16 w-16 text-primary-foreground opacity-50" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <Badge variant={status === "upcoming" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(eventDate), "PPP")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{location}</span>
        </div>
        {maxParticipants && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Max {maxParticipants} participants</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/register?event=${id}`}>Register Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
