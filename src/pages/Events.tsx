import { useEffect, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Timeline } from "@/components/Timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event: any) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
          <p className="text-muted-foreground mb-6">
            Find the perfect event for you from our curated collection
          </p>
          
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="secondary">Filter</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No events found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event: any) => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      eventDate={event.event_date}
                      location={event.location}
                      imageUrl={event.image_url}
                      status={event.status}
                      maxParticipants={event.max_participants}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="timeline">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No events found matching your search.</p>
                </div>
              ) : (
                <Timeline events={filteredEvents} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Events;
