import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About EventHub</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            We're on a mission to connect people through amazing experiences and unforgettable events
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, EventHub emerged from a simple observation: finding and managing 
                  events should be effortless, not a chore. We saw an opportunity to create a platform 
                  that brings together event organizers and attendees in a seamless, intuitive way.
                </p>
                <p>
                  Today, we're proud to serve thousands of users across the globe, hosting over 500 
                  events annually. From corporate conferences to community gatherings, music festivals 
                  to networking meetups, EventHub has become the go-to platform for discovering and 
                  experiencing the world's best events.
                </p>
                <p>
                  Our platform is built with cutting-edge technology and designed with user experience 
                  at its core. Whether you're an event organizer looking to reach a wider audience or 
                  an attendee searching for your next adventure, EventHub makes it happen.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Our Mission</h3>
                    <p className="text-sm text-muted-foreground">
                      To make event discovery and management accessible, enjoyable, and efficient for everyone.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Our Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      A world where everyone can easily find and participate in events that enrich their lives.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Our Values</h3>
                    <p className="text-sm text-muted-foreground">
                      Innovation, community, excellence, and putting our users first in everything we do.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Events Hosted</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Cities Worldwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
