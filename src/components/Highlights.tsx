import { Calendar, Users, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    icon: Calendar,
    title: "500+ Events",
    description: "Hosted annually",
  },
  {
    icon: Users,
    title: "10K+ Members",
    description: "Active community",
  },
  {
    icon: TrendingUp,
    title: "95% Success",
    description: "Event satisfaction rate",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Best platform 2024",
  },
];

export const Highlights = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose EventHub</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of event organizers and attendees who trust us to make their events unforgettable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <Card key={index} className="text-center hover:shadow-strong transition-all duration-300">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
