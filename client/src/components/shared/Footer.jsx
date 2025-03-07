import { Globe, MessageSquare, Shield, Rocket, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-muted/30 py-10 ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Yippie.</h3>
            <p className="text-sm text-muted-foreground">
              Connecting talent with opportunity.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase text-muted-foreground">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-sm hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-sm hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase text-muted-foreground">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support">Support</Link>
              </li>
            </ul>
          </div>
          {/* <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase text-muted-foreground">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <MessageSquare className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Shield className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Rocket className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Brain className="h-5 w-5" />
              </a>
            </div>
          </div> */}
        </div>
        <div className="border-t border-muted/30 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Yippie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
