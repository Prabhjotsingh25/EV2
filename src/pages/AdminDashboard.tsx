import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LocationPicker } from "@/components/LocationPicker"; // Import the new picker

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    max_participants: "",
    latitude: "",
    longitude: "",
    category: "General"
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      checkAdmin();
    }
  }, [user, authLoading]);

  const checkAdmin = async () => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user!.id)
        .single();
      
      if (profileData?.role === "admin") {
        fetchEvents();
      } else {
        navigate("/"); 
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents(data || []);
  };

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('event-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = editingEvent?.image_url;

      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await handleImageUpload(imageFile);
        setUploadingImage(false);
      }

      const eventPayload = {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        location: formData.location,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        category: formData.category,
        image_url: imageUrl,
        created_by: user!.id,
      };

      if (editingEvent) {
        const { error } = await supabase.from("events").update(eventPayload).eq('id', editingEvent.id);
        if (error) throw error;
        toast({ title: "Updated!", description: "Event updated successfully." });
      } else {
        const { error } = await supabase.from("events").insert(eventPayload);
        if (error) throw error;
        toast({ title: "Success!", description: "Event created successfully." });
      }

      resetForm();
      fetchEvents();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("events").delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Event removed." });
      fetchEvents();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", event_date: "", location: "", max_participants: "", latitude: "", longitude: "", category: "General" });
    setImageFile(null);
    setEditingEvent(null);
    setIsCreateOpen(false);
  };

  const openEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      location: event.location,
      max_participants: event.max_participants || "",
      latitude: event.latitude ? event.latitude.toString() : "",
      longitude: event.longitude ? event.longitude.toString() : "",
      category: event.category || "General"
    });
    setIsCreateOpen(true);
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) { navigate("/auth"); return null; }

  return (
    <div className="min-h-screen py-12 container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Dialog open={isCreateOpen} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> {editingEvent ? "Edit Event" : "Create Event"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g., Tech, Music" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <Input type="datetime-local" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Max Participants</Label>
                  <Input type="number" value={formData.max_participants} onChange={e => setFormData({...formData, max_participants: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location Name</Label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="e.g., Central Park" />
              </div>

              {/* Map Picker Section */}
              <div className="space-y-2">
                <Label>Pin Location on Map</Label>
                <LocationPicker 
                  // Adding a key forces re-render when dialog opens/event changes, ensuring map resizes correctly
                  key={editingEvent ? editingEvent.id : 'new'}
                  initialLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
                  initialLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
                  onLocationSelect={(lat, lng) => {
                    setFormData(prev => ({
                      ...prev, 
                      latitude: lat.toString(), 
                      longitude: lng.toString()
                    }));
                  }}
                />
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  <p>Selected Latitude: {formData.latitude || "None"}</p>
                  <p>Selected Longitude: {formData.longitude || "None"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Image</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  {editingEvent?.image_url && <img src={editingEvent.image_url} alt="Preview" className="h-10 w-10 rounded object-cover" />}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={uploadingImage}>
                {uploadingImage ? "Uploading..." : (editingEvent ? "Update Event" : "Create Event")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map((event: any) => (
          <Card key={event.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
                ) : (
                  <Calendar className="h-full w-full p-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {new Date(event.event_date).toLocaleDateString()}
                  <MapPin className="h-3 w-3 ml-2" /> {event.location}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => openEdit(event)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(event.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;