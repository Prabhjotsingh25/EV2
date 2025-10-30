import { Link } from "react-router-dom";
import { Calendar, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">EventHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your premier platform for discovering and managing amazing events.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                Events
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@eventhub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Event St, City, State</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
