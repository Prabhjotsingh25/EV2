import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EventCarousel } from "@/components/EventCarousel";
import { Highlights } from "@/components/Highlights";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-event.jpg";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "upcoming")
        .order("event_date", { ascending: true })
        .limit(6);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/95" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold">
              Discover Amazing{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join thousands of people attending the best events in your area. 
              Find, register, and experience unforgettable moments.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild className="shadow-strong">
                <Link to="/events">
                  Browse Events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out our upcoming events and register to secure your spot
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : (
            <EventCarousel events={events} />
          )}
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <Highlights />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Create an account today and start discovering amazing events in your area
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-strong">
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
