import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EventCard } from "./EventCard";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url?: string;
  status: string;
  max_participants?: number;
}

interface EventCarouselProps {
  events: Event[];
}

export const EventCarousel = ({ events }: EventCarouselProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events available at the moment.</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
            <EventCard
              id={event.id}
              title={event.title}
              description={event.description}
              eventDate={event.event_date}
              location={event.location}
              imageUrl={event.image_url}
              status={event.status}
              maxParticipants={event.max_participants}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
