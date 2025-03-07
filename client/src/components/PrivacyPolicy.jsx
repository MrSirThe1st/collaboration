import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldCheck,
  FileLock,
  Users,
  Bell,
  Clock,
  Server,
  Mail,
} from "lucide-react";

const PrivacyPolicy = () => {
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to navigate back
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background pt-12 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 flex items-center gap-1"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: February 20, 2025
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                <a
                  href="#information-we-collect"
                  className="text-primary hover:underline"
                >
                  Information We Collect
                </a>
              </li>
              <li>
                <a href="#how-we-use" className="text-primary hover:underline">
                  How We Use Your Information
                </a>
              </li>
              <li>
                <a
                  href="#information-sharing"
                  className="text-primary hover:underline"
                >
                  Information Sharing and Disclosure
                </a>
              </li>
              <li>
                <a
                  href="#data-security"
                  className="text-primary hover:underline"
                >
                  Data Security
                </a>
              </li>
              <li>
                <a
                  href="#data-retention"
                  className="text-primary hover:underline"
                >
                  Data Retention
                </a>
              </li>
              <li>
                <a href="#your-rights" className="text-primary hover:underline">
                  Your Rights and Choices
                </a>
              </li>
              <li>
                <a
                  href="#international-transfers"
                  className="text-primary hover:underline"
                >
                  International Data Transfers
                </a>
              </li>
              <li>
                <a href="#changes" className="text-primary hover:underline">
                  Changes to This Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary hover:underline">
                  Contact Us
                </a>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Introduction */}
        <div className="prose max-w-none mb-8">
          <p>
            At YippieApp, we value your privacy and are committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our platform. Please read this privacy policy carefully. If you do
            not agree with the terms of this privacy policy, please do not
            access the platform.
          </p>
        </div>

        {/* Section 1 */}
        <section id="information-we-collect" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileLock className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              1. Information We Collect
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We collect several types of information from and about users of
              our platform, including:
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              1.1 Personal Information
            </h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <span className="font-medium">Account Information:</span> Your
                name, email address, username, password, and profession when you
                register for an account.
              </li>
              <li>
                <span className="font-medium">Profile Information:</span> Your
                profile photo, bio, skills, country location, and any other
                information you choose to provide in your profile.
              </li>
              <li>
                <span className="font-medium">Professional Information:</span>{" "}
                Details about your experience, skills, and other professional
                qualifications you choose to share.
              </li>
              <li>
                <span className="font-medium">Social Media Information:</span>{" "}
                Links to your GitHub, LinkedIn, portfolio, or other professional
                profiles that you choose to connect.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              1.2 Project and Activity Information
            </h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                Information about projects you create or participate in,
                including project titles, descriptions, requirements, and
                communications.
              </li>
              <li>
                Groups you create or join, including group names and member
                information.
              </li>
              <li>
                Messages and communications you send to other users through our
                platform.
              </li>
              <li>
                Files, documentation, and other content you upload or share on
                the platform.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              1.3 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <span className="font-medium">Usage Information:</span> How you
                interact with our platform, such as the features you use, the
                projects you view, and the actions you take.
              </li>
              <li>
                <span className="font-medium">Device Information:</span>{" "}
                Information about your device, including IP address, browser
                type, operating system, and device identifiers.
              </li>
              <li>
                <span className="font-medium">
                  Cookies and Similar Technologies:
                </span>{" "}
                We use cookies and similar tracking technologies to collect
                information about your browsing activities.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section id="how-we-use" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              2. How We Use Your Information
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We use the information we collect for various purposes, including
              to:
            </p>

            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide, maintain, and improve our platform and services.</li>
              <li>
                Process and manage your account registration and user profile.
              </li>
              <li>
                Facilitate your collaboration with other users on projects and
                in groups.
              </li>
              <li>
                Enable communication between users through channels, direct
                messages, and notifications.
              </li>
              <li>
                Send you important administrative messages, such as security
                alerts and account notifications.
              </li>
              <li>
                Process your requests, such as password reset requests,
                invitation responses, and project applications.
              </li>
              <li>
                Improve our platform by analyzing usage patterns and developing
                new features.
              </li>
              <li>
                Protect the security and integrity of our platform by monitoring
                for and preventing fraudulent activity.
              </li>
              <li>
                Personalize your experience by showing you relevant projects,
                groups, and users.
              </li>
              <li>
                Comply with legal obligations and enforce our terms of service.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="information-sharing" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              3. Information Sharing and Disclosure
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We respect your privacy and are committed to protecting it. We do
              not sell your personal information to third parties. However, we
              may share your information in the following circumstances:
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              3.1 With Other Users
            </h3>
            <p>
              Certain information, such as your username, profile photo, bio,
              skills, and other profile information, is visible to other users
              of the platform. Additionally, content you post or share (such as
              project information, messages in channels, and documentation) will
              be visible to members of those projects or channels.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              3.2 With Service Providers
            </h3>
            <p>
              We may share your information with third-party service providers
              who perform services on our behalf, such as hosting services,
              analytics, and customer support. These service providers are
              obligated to use your information only to provide services to us
              and in accordance with our instructions.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              3.3 For Legal Reasons
            </h3>
            <p>
              We may disclose your information if required to do so by law or in
              response to valid requests by public authorities (e.g., a court or
              government agency). We may also disclose your information to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Enforce our terms of service and other agreements.</li>
              <li>Protect and defend our rights or property.</li>
              <li>
                Prevent or investigate possible wrongdoing in connection with
                the platform.
              </li>
              <li>
                Protect the personal safety of users of the platform or the
                public.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              3.4 Business Transfers
            </h3>
            <p>
              In the event of a merger, acquisition, or sale of all or a portion
              of our assets, your information may be transferred as part of that
              transaction. We will notify you via email and/or a prominent
              notice on our platform of any change in ownership or uses of your
              personal information.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="data-security" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We have implemented appropriate technical and organizational
              security measures designed to protect the security of any personal
              information we process. However, please also remember that we
              cannot guarantee that the internet itself is 100% secure. Although
              we will do our best to protect your personal information,
              transmission of personal information to and from our platform is
              at your own risk. You should only access the platform within a
              secure environment.
            </p>
            <p className="mt-4">
              We use industry-standard encryption technologies when transferring
              and receiving sensitive data. We also maintain administrative,
              technical, and physical safeguards designed to protect the privacy
              and security of your personal information.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="data-retention" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">5. Data Retention</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We will retain your personal information only for as long as is
              necessary for the purposes set out in this privacy policy. We will
              retain and use your information to the extent necessary to comply
              with our legal obligations, resolve disputes, and enforce our
              policies.
            </p>
            <p className="mt-4">
              If you delete your account, we will delete or anonymize your
              personal information within 30 days, except where we are required
              to retain it for legitimate business or legal purposes.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="your-rights" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              6. Your Rights and Choices
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              6.1 Account Information
            </h3>
            <p>
              You can review and update your account information at any time by
              logging into your account and visiting your profile settings page.
              You may also delete your account through the profile settings.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              6.2 Communication Preferences
            </h3>
            <p>
              You can opt out of receiving promotional emails from us by
              following the unsubscribe instructions provided in those emails.
              You may not opt out of service-related communications (e.g.,
              account verification, technical and security notices).
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              6.3 Privacy Rights
            </h3>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Access the personal information we have about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>
                Restrict or object to the processing of your personal
                information
              </li>
              <li>
                Data portability (receive your data in a structured, commonly
                used format)
              </li>
              <li>
                Withdraw consent at any time where we rely on your consent to
                process your personal information
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided in the "Contact Us" section below.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="international-transfers" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Server className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              7. International Data Transfers
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We may transfer, store, and process your information in countries
              other than your own. Our servers are located globally, and your
              information may be stored and processed in any country where we
              maintain facilities or service providers.
            </p>
            <p className="mt-4">
              By using our platform, you consent to the transfer of information
              to countries outside your country of residence, which may have
              different data protection rules than those of your country. We
              take appropriate measures to ensure that your personal information
              remains protected in accordance with this privacy policy.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="changes" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              8. Changes to This Privacy Policy
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We may update our privacy policy from time to time. We will notify
              you of any changes by posting the new privacy policy on this page
              and updating the "Last updated" date at the top of this policy.
            </p>
            <p className="mt-4">
              You are advised to review this privacy policy periodically for any
              changes. Changes to this privacy policy are effective when they
              are posted on this page.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="contact" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              If you have any questions about this privacy policy or our data
              practices, please contact us at:
            </p>
            <p className="mt-2 font-medium">
              Email:{" "}
              <a
                href="mailto:privacy@yippieapp.com"
                className="text-primary hover:underline"
              >
                privacy@yippieapp.com
              </a>
            </p>
            <p className="mt-2 font-medium">
              Address: 123 Collaboration Street, Suite 400, San Francisco, CA
              94105, USA
            </p>
          </div>
        </section>

        {/* Back to top button */}
        <div className="flex justify-center my-12">
          <Button variant="outline" onClick={scrollToTop}>
            Back to Top
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
