import { Mail, MessageCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Support Center</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We're here to help you with any questions or issues you might have
          with the platform.
        </p>
      </div>

      {/* Support Notice Card */}
      <Card className="mb-8 border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Our Support Team
          </CardTitle>
          <CardDescription>
            Our dedicated support team is available to assist you
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            {/* <p className="mb-4">
              As we're in the early stages of our platform, our support system
              is currently being built. For any assistance, questions, or
              feedback, please email us directly at:
            </p> */}
            <div className="bg-muted p-4 rounded-md text-center my-4">
              <a
                href="mailto:info@yippieapp.com"
                className="text-primary font-semibold text-lg hover:underline"
              >
                info@yippieapp.com
              </a>
            </div>
            <p>
              We aim to respond to all inquiries within 24-48 hours. Your
              feedback is invaluable as we continue to improve our platform.
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={() =>
                (window.location.href = "mailto:info@yippieapp.com")
              }
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section Placeholder */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Coming Soon</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Help Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We're building a comprehensive help center with guides,
                tutorials, and FAQs to help you get the most out of our
                platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Live Chat Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Real-time support through live chat is in development and will
                be available in future updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Help Us Improve</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Your feedback is crucial as we develop and refine our platform. Share
          your thoughts, suggestions, or report issues to help us build a better
          experience.
        </p>
        <Button
          onClick={() =>
            (window.location.href =
              "mailto:info@yippieapp.com?subject=Feedback")
          }
          variant="outline"
          className="flex items-center gap-2 mx-auto"
        >
          Send Feedback
        </Button>
      </div>
    </div>
  );
};

export default Support;
