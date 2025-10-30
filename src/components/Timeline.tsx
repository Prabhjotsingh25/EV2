import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface TimelineEvent {
  id: string;
  title: string;
  event_date: string;
  location: string;
  status: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline = ({ events }: TimelineProps) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );

  return (
    <div className="relative space-y-8">
      <div className="absolute left-[19px] top-0 h-full w-0.5 bg-gradient-primary" />
      
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="relative flex items-start gap-4 pl-12">
          <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-strong">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          
          <div className="flex-1 space-y-2 rounded-lg border bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{event.title}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(event.event_date), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
