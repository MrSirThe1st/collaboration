import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      // If no consent has been given yet, show the banner
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem("cookieConsent", "true");
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Store minimal consent for functional cookies only
    localStorage.setItem("cookieConsent", "minimal");
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());

    // You might want to disable certain tracking here
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Cookie Consent</h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience on our website. By
            continuing to browse, you agree to our use of cookies. You can
            adjust your cookie preferences or withdraw your consent at any time
            in your settings.
          </p>
          <a
            href="/privacy-policy"
            className="text-sm text-primary hover:underline mt-1 inline-block"
          >
            Learn more about our privacy policy
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="whitespace-nowrap"
          >
            Decline
          </Button>
          <Button onClick={handleAccept} className="whitespace-nowrap">
            Accept All
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
