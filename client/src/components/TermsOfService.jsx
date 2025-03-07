import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  User,
  Shield,
  LifeBuoy,
  Gavel,
  BadgeAlert,
  Code,
  CreditCard,
  Globe,
  ChevronUp,
} from "lucide-react";

const TermsOfService = () => {
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
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
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
                <a href="#acceptance" className="text-primary hover:underline">
                  Acceptance of Terms
                </a>
              </li>
              <li>
                <a
                  href="#user-accounts"
                  className="text-primary hover:underline"
                >
                  User Accounts
                </a>
              </li>
              <li>
                <a
                  href="#user-conduct"
                  className="text-primary hover:underline"
                >
                  User Conduct and Content
                </a>
              </li>
              <li>
                <a
                  href="#intellectual-property"
                  className="text-primary hover:underline"
                >
                  Intellectual Property Rights
                </a>
              </li>
              <li>
                <a href="#payments" className="text-primary hover:underline">
                  Payments and Subscriptions
                </a>
              </li>
              <li>
                <a href="#disclaimers" className="text-primary hover:underline">
                  Disclaimers and Limitations of Liability
                </a>
              </li>
              <li>
                <a href="#termination" className="text-primary hover:underline">
                  Termination
                </a>
              </li>
              <li>
                <a
                  href="#governing-law"
                  className="text-primary hover:underline"
                >
                  Governing Law
                </a>
              </li>
              <li>
                <a href="#changes" className="text-primary hover:underline">
                  Changes to Terms
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
            These Terms of Service ("Terms") govern your access to and use of
            YippieApp, including any content, functionality, and services
            offered on or through our website and platform (collectively, the
            "Service"). Please read these Terms carefully before using our
            Service.
          </p>
        </div>

        {/* Section 1 */}
        <section id="acceptance" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms and our Privacy Policy. If you do not agree to these Terms,
              you may not access or use the Service.
            </p>
            <p className="mt-4">
              You must be at least 18 years old or have the consent of a legal
              guardian to use the Service. By using the Service, you represent
              and warrant that you meet these requirements.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="user-accounts" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">2. User Accounts</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <h3 className="text-xl font-medium mt-6 mb-3">
              2.1 Account Creation
            </h3>
            <p>
              To use certain features of the Service, you must create an
              account. When you create an account, you must provide accurate,
              current, and complete information. You agree to update your
              information as necessary to maintain its accuracy.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              2.2 Account Security
            </h3>
            <p>
              You are responsible for maintaining the security of your account,
              including your password. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Create a strong, unique password for your account.</li>
              <li>
                Keep your password confidential and not share it with anyone
                else.
              </li>
              <li>
                Notify us immediately of any unauthorized access to or use of
                your account.
              </li>
              <li>
                Ensure that you log out from your account at the end of each
                session.
              </li>
            </ul>
            <p>
              You are solely responsible for all activities that occur under
              your account. We will not be liable for any loss or damage arising
              from your failure to comply with these security obligations.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              2.3 Account Restrictions
            </h3>
            <p>You may not:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                Create more than one account per person, unless explicitly
                permitted.
              </li>
              <li>Share your account with any other person.</li>
              <li>
                Create an account on behalf of another individual without their
                permission.
              </li>
              <li>
                Use a name or email address that belongs to someone else or that
                you are not authorized to use.
              </li>
              <li>Provide false information when creating an account.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="user-conduct" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              3. User Conduct and Content
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <h3 className="text-xl font-medium mt-6 mb-3">
              3.1 Prohibited Conduct
            </h3>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe the intellectual property rights of others.</li>
              <li>Harass, abuse, or harm another person or entity.</li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation with a person or entity.
              </li>
              <li>
                Engage in any activity that interferes with or disrupts the
                Service.
              </li>
              <li>Attempt to access any unauthorized parts of the Service.</li>
              <li>Use the Service for any illegal or unauthorized purpose.</li>
              <li>
                Upload or transmit viruses, malware, or other malicious code.
              </li>
              <li>
                Collect or harvest any information from the Service without
                authorization.
              </li>
              <li>
                Engage in automated use of the system, such as using scripts to
                send messages or posts.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">3.2 User Content</h3>
            <p>
              You are responsible for all content that you submit, post, or
              display on or through the Service ("User Content"). By providing
              User Content, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                You own or have the necessary rights and permissions to use and
                authorize us to use your User Content.
              </li>
              <li>
                Your User Content does not violate the privacy, publicity,
                intellectual property, or other rights of any person.
              </li>
              <li>
                Your User Content does not contain any material that is
                defamatory, obscene, indecent, abusive, offensive, harassing,
                violent, hateful, inflammatory, or otherwise objectionable.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              3.3 Content Monitoring
            </h3>
            <p>
              We have the right, but not the obligation, to monitor and edit or
              remove any User Content. We are not responsible for any User
              Content posted by you or any third party.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">3.4 Feedback</h3>
            <p>
              If you provide us with any feedback or suggestions regarding the
              Service, you assign to us all rights in such feedback and agree
              that we shall have the right to use such feedback in any manner we
              deem appropriate.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="intellectual-property" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              4. Intellectual Property Rights
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <h3 className="text-xl font-medium mt-6 mb-3">
              4.1 Service Content
            </h3>
            <p>
              The Service and its original content, features, and functionality
              are owned by YippieApp and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property or proprietary rights laws.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              4.2 License to Use
            </h3>
            <p>
              Subject to these Terms, we grant you a limited, non-exclusive,
              non-transferable, and revocable license to use the Service for
              your personal, non-commercial use. You may not:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                Modify, copy, distribute, transmit, display, perform, reproduce,
                publish, license, create derivative works from, transfer, or
                sell any information or content obtained from the Service.
              </li>
              <li>
                Decompile, reverse engineer, disassemble, or otherwise attempt
                to derive the source code for the Service.
              </li>
              <li>
                Remove, obscure, or alter any copyright, trademark, or other
                proprietary rights notices from copies of content from the
                Service.
              </li>
              <li>
                Use any robot, spider, crawler, scraper, or other automated
                means to access the Service for any purpose.
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">
              4.3 License to User Content
            </h3>
            <p>
              By submitting, posting, or displaying User Content on or through
              the Service, you grant us a worldwide, non-exclusive, royalty-free
              license (with the right to sublicense) to use, copy, reproduce,
              process, adapt, modify, publish, transmit, display, and distribute
              such content in any and all media or distribution methods now
              known or later developed.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">4.4 Trademarks</h3>
            <p>
              The YippieApp name, logo, and all related names, logos, product
              and service names, designs, and slogans are trademarks of
              YippieApp or its affiliates. You may not use such marks without
              our prior written permission. All other names, logos, product and
              service names, designs, and slogans on the Service are the
              trademarks of their respective owners.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="payments" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              5. Payments and Subscriptions
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <h3 className="text-xl font-medium mt-6 mb-3">5.1 Pricing</h3>
            <p>
              We reserve the right to determine and modify pricing for our
              Service. Prices for our Service are subject to change without
              notice. We shall not be liable to you or to any third party for
              any modification, price change, suspension, or discontinuance of
              the Service.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">5.2 Payment Terms</h3>
            <p>
              By providing a payment method, you authorize us to charge you for
              any paid features of the Service that you choose to use. If your
              payment cannot be completed for any reason, we may suspend or
              terminate your access to paid features of the Service.
            </p>
            <p className="mt-4">
              All payments are non-refundable unless otherwise specified in
              these Terms or required by applicable law.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              5.3 Subscription Terms
            </h3>
            <p>
              Some parts of the Service may be billed on a subscription basis.
              You will be billed in advance on a recurring basis, depending on
              the subscription plan you select.
            </p>
            <p className="mt-4">
              Your subscription will automatically renew at the end of each
              subscription period unless you cancel it before the renewal date.
              You can cancel your subscription at any time through your account
              settings.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">5.4 Free Trials</h3>
            <p>
              We may offer free trials for some of our subscription services. If
              you sign up for a free trial, we may require you to provide your
              payment information. At the end of the free trial period, we will
              automatically begin charging you for the subscription unless you
              cancel it before the trial period ends.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="disclaimers" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BadgeAlert className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">
              6. Disclaimers and Limitations of Liability
            </h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <h3 className="text-xl font-medium mt-6 mb-3">
              6.1 Disclaimer of Warranties
            </h3>
            <p>
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.
              YippieApp EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER
              EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              AND NON-INFRINGEMENT.
            </p>
            <p className="mt-4">
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY,
              SECURE, OR ERROR-FREE, THAT THE RESULTS THAT MAY BE OBTAINED FROM
              THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE, OR THAT ANY
              ERRORS IN THE SERVICE WILL BE CORRECTED.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              6.2 Limitation of Liability
            </h3>
            <p>
              IN NO EVENT SHALL YippieApp, ITS OFFICERS, DIRECTORS, EMPLOYEES,
              OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL,
              SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING
              FROM:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
                SERVICE;
              </li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE;</li>
              <li>ANY CONTENT OBTAINED FROM THE SERVICE; AND</li>
              <li>
                UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR
                CONTENT;
              </li>
            </ul>
            <p>
              WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE),
              OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF
              THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH
              HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              6.3 Indemnification
            </h3>
            <p>
              You agree to defend, indemnify, and hold harmless YippieApp, its
              officers, directors, employees, and agents, from and against any
              and all claims, damages, obligations, losses, liabilities, costs
              or debt, and expenses (including but not limited to attorney's
              fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your use of and access to the Service;</li>
              <li>Your violation of any term of these Terms;</li>
              <li>
                Your violation of any third-party right, including without
                limitation any copyright, property, or privacy right; or
              </li>
              <li>
                Any claim that your User Content caused damage to a third party.
              </li>
            </ul>
            <p>
              This defense and indemnification obligation will survive these
              Terms and your use of the Service.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="termination" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <LifeBuoy className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">7. Termination</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <h3 className="text-xl font-medium mt-6 mb-3">
              7.1 Termination by YippieApp
            </h3>
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach these
              Terms.
            </p>
            <p className="mt-4">
              We may also terminate or suspend any accounts that have been
              inactive for an extended period. We will determine what
              constitutes inactivity in our sole discretion.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              7.2 Termination by You
            </h3>
            <p>
              You may terminate your account at any time by following the
              instructions on the Service or by contacting us directly.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">
              7.3 Effects of Termination
            </h3>
            <p>
              Upon termination, your right to use the Service will immediately
              cease. The following provisions shall survive termination:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Intellectual Property Rights</li>
              <li>Disclaimers and Limitations of Liability</li>
              <li>Indemnification</li>
              <li>Governing Law</li>
              <li>
                Any other provisions that by their nature should survive
                termination
              </li>
            </ul>
            <p>
              We shall not be liable to you or any third party for any
              termination of your access to the Service.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="governing-law" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">8. Governing Law</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of [Your Jurisdiction], without regard to its conflict of law
              provisions.
            </p>
            <p className="mt-4">
              Any dispute arising from or relating to the subject matter of
              these Terms shall be finally settled by arbitration in [Your City,
              State/Country], using the English language in accordance with the
              Arbitration Rules and Procedures of [Arbitration Body] then in
              effect, by one commercial arbitrator with substantial experience
              in resolving intellectual property and commercial contract
              disputes.
            </p>
            <p className="mt-4">
              Any dispute, controversy, or claim arising out of or relating to
              these Terms, including the validity, invalidity, breach, or
              termination thereof, shall be resolved by arbitration in
              accordance with the [Arbitration Rules] in force on the date when
              the Notice of Arbitration is submitted.
            </p>
            <p className="mt-4">
              The seat of the arbitration shall be [City, Country]. The arbitral
              proceedings shall be conducted in English.
            </p>
            <p className="mt-4">
              Notwithstanding the foregoing, either party may apply to any court
              of competent jurisdiction for injunctive relief or enforcement of
              this arbitration provision without breach of this arbitration
              provision.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="changes" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BadgeAlert className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. We will provide notice of any changes by
              posting the revised Terms on this page and updating the "Last
              Updated" date at the top of these Terms.
            </p>
            <p className="mt-4">
              Your continued use of the Service after any such changes
              constitutes your acceptance of the new Terms. If you do not agree
              to the new terms, please stop using the Service.
            </p>
            <p className="mt-4">
              We recommend that you review these Terms periodically for any
              changes. Changes to these Terms are effective when they are posted
              on this page.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="contact" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-2xl font-semibold">10. Contact Us</h2>
          </div>
          <Separator className="mb-4" />

          <div className="prose max-w-none">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-4">
              <strong>YippieApp</strong>
              <br />
              Email: support@yippieapp.com
              <br />
              Address: 123 YippieApp Street, Tech City, 12345
              <br />
              Phone: (123) 456-7890
            </p>
          </div>
        </section>

        {/* Back to Top Button */}
        <div className="fixed bottom-8 right-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md hover:shadow-lg bg-background"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-5 w-5" />
            <span className="sr-only">Back to top</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
