import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { EventMap } from "@/components/EventMap"; // Import the map component

const Register = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event");
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      if (user) {
        checkRegistration();
      }
    }
  }, [eventId, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Error",
        description: "Could not load event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    if (!user || !eventId) return;
    
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .single();

      if (data) {
        setIsRegistered(true);
      }
    } catch (error) {
      // User not registered, which is fine
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events",
      });
      navigate("/auth");
      return;
    }

    setRegistering(true);
    try {
      const { error } = await supabase
        .from("registrations")
        .insert({
          event_id: eventId,
          user_id: user.id,
        });

      if (error) throw error;

      setIsRegistered(true);
      toast({
        title: "Success!",
        description: "You have successfully registered for this event",
      });
    } catch (error: any) {
      console.error("Error registering:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not register for event",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Event not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-primary">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-24 w-24 text-primary-foreground opacity-50" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{format(new Date(event.event_date), "PPP")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>

              {event.max_participants && (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Max Participants</p>
                    <p className="font-medium">{event.max_participants}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map Section Added Here */}
            {event.latitude && event.longitude && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Event Location</h3>
                <EventMap events={[event]} />
              </div>
            )}

            {isRegistered ? (
              <div className="flex items-center justify-center gap-2 p-6 bg-primary/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary" />
                <p className="font-medium text-primary">You are registered for this event!</p>
              </div>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={registering}
                className="w-full"
                size="lg"
              >
                {registering ? "Registering..." : "Register for Event"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;