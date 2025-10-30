import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    max_participants: "",
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      if (profileData.role === "admin") {
        fetchAdminData();
      } else {
        fetchUserData();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: registrationsData } = await supabase
      .from("registrations")
      .select("*, events(title), profiles(full_name, email)");

    setEvents(eventsData || []);
    setRegistrations(registrationsData || []);
  };

  const fetchUserData = async () => {
    const { data: registrationsData } = await supabase
      .from("registrations")
      .select("*, events(*)")
      .eq("user_id", user!.id);

    setRegistrations(registrationsData || []);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("events").insert({
        title: newEvent.title,
        description: newEvent.description,
        event_date: newEvent.event_date,
        location: newEvent.location,
        max_participants: newEvent.max_participants ? parseInt(newEvent.max_participants) : null,
        created_by: user!.id,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event created successfully",
      });

      setNewEvent({
        title: "",
        description: "",
        event_date: "",
        location: "",
        max_participants: "",
      });
      setDialogOpen(false);
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {profile?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || user.email}
          </p>
        </div>

        {profile?.role === "admin" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{registrations.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateEvent} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Event Title</Label>
                          <Input
                            id="title"
                            value={newEvent.title}
                            onChange={(e) =>
                              setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newEvent.description}
                            onChange={(e) =>
                              setNewEvent((prev) => ({ ...prev, description: e.target.value }))
                            }
                            required
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="event_date">Event Date</Label>
                            <Input
                              id="event_date"
                              type="datetime-local"
                              value={newEvent.event_date}
                              onChange={(e) =>
                                setNewEvent((prev) => ({ ...prev, event_date: e.target.value }))
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="max_participants">Max Participants</Label>
                            <Input
                              id="max_participants"
                              type="number"
                              value={newEvent.max_participants}
                              onChange={(e) =>
                                setNewEvent((prev) => ({
                                  ...prev,
                                  max_participants: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newEvent.location}
                            onChange={(e) =>
                              setNewEvent((prev) => ({ ...prev, location: e.target.value }))
                            }
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Create Event
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">
                      No events created yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event: any) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>My Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {registrations.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    You haven't registered for any events yet
                  </p>
                  <Button asChild>
                    <a href="/events">Browse Events</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg: any) => (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{reg.events.title}</h3>
                        <p className="text-sm text-muted-foreground">{reg.events.location}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/register?event=${reg.event_id}`}>View Event</a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
