import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MainFeed",
  description: "How MainFeed accesses, uses, and protects information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-10 pb-20 font-sans sm:px-10 sm:pt-16">
      <Link href="/" className="text-sm underline underline-offset-4">
        Back to MainFeed
      </Link>

      <article className="mt-10 space-y-8 text-base leading-relaxed [&>section]:space-y-3 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-semibold [&_h2]:tracking-normal [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        <header className="space-y-4">
          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p>Last Updated: <time dateTime="2026-11-18">November 18, 2026</time></p>
          <p>MainFeed is operated by MonClips Inc. (“MainFeed,” “we,” “us,” or “our”).</p>
          <p>We believe your personal memories should remain private.</p>
          <p>
            This Privacy Policy explains how we access, use, and protect information
            when you use the MainFeed mobile application and related services
            (collectively, the “Services”).
          </p>
          <p>
            Your photos and videos stay on your device. We do not upload, store,
            or access your personal media.
          </p>
        </header>

        <section>
          <h2>1. Your Photos and Videos</h2>
          <p>
            MainFeed allows you to browse and rediscover photos and videos stored
            on your device through a full-screen, vertical feed.
          </p>
          <p>
            With your permission, MainFeed accesses your device&apos;s photo
            library to provide this experience.
          </p>
          <p>All photo and video browsing and processing takes place locally on your device.</p>
          <ul>
            <li>Your photos and videos are not uploaded to our servers.</li>
            <li>We do not store copies of your personal photos or videos.</li>
            <li>We cannot remotely access or view your personal media.</li>
            <li>We do not share your photos or videos with Firebase Analytics.</li>
            <li>Your personal media is not publicly accessible through MainFeed.</li>
          </ul>
          <p>You retain ownership and control of your photos and videos.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            MainFeed does not require you to create an account or provide your
            name or email address to use its core features.
          </p>
          <p>
            However, we use Google Analytics for Firebase, provided by Google LLC,
            to understand how the application is used and improve its functionality.
          </p>
          <p>Firebase Analytics may automatically collect technical and usage information, including:</p>
          <ul>
            <li>Device model and operating system information;</li>
            <li>Application version and device language settings;</li>
            <li>App-instance identifiers;</li>
            <li>App installation and usage events;</li>
            <li>Screen views and interactions within the application;</li>
            <li>Approximate geographic information derived from technical signals;</li>
            <li>Other technical information collected by Firebase Analytics according to its configuration.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Analytics Data</h2>
          <p>We use analytics information to:</p>
          <ul>
            <li>Understand how users interact with MainFeed;</li>
            <li>Measure app usage and user retention;</li>
            <li>Evaluate how frequently features are used;</li>
            <li>Identify opportunities to improve the user experience;</li>
            <li>Monitor the effectiveness of product improvements.</li>
          </ul>
          <p>Analytics information is processed through Google Analytics for Firebase.</p>
          <p>
            We do not require users to provide personal identification information
            to access MainFeed&apos;s core features.
          </p>
        </section>

        <section>
          <h2>4. Photo Library Permissions</h2>
          <p>MainFeed requests access to your device&apos;s photo library to display your photos and videos.</p>
          <p>Access is granted through your device&apos;s operating system permission controls.</p>
          <p>You can limit or revoke this access at any time through your device settings.</p>
          <p>If access is restricted, some MainFeed features may not function as intended.</p>
          <p>Providing photo library access does not upload your photos or videos to MainFeed.</p>
        </section>

        <section>
          <h2>5. Sharing Photos and Videos</h2>
          <p>
            MainFeed allows you to share selected photos and videos through your
            device&apos;s native sharing functionality.
          </p>
          <p>You decide which photos or videos to share and which applications or recipients receive them.</p>
          <p>
            When you share content through a third-party application, such as a
            messaging service, the selected content is handled by that service
            according to its own privacy policy.
          </p>
          <p>MainFeed does not upload your personal media to its servers as part of this process.</p>
          <p>
            We are not responsible for how recipients or independent third-party
            services use content after you choose to share it.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>MainFeed uses the following third-party analytics service:</p>
          <p>Google Analytics for Firebase</p>
          <p>Provider: Google LLC</p>
          <p>Purpose: Application usage analytics and product improvement.</p>
          <p>
            Google may process certain technical and usage information in
            accordance with its applicable data processing terms and privacy practices.
          </p>
          <p>Mainfeed does not provide your personal photos or videos to Google Analytics for Firebase.</p>
        </section>

        <section>
          <h2>7. Data Storage and Retention</h2>
          <p>Your photos and videos remain on your device and are not stored on MainFeed servers.</p>
          <p>
            Technical and usage information collected through Firebase Analytics
            is processed and retained according to the applicable Google Analytics
            configuration and retention settings.
          </p>
          <p>You can manage access to your photos and videos through your device settings.</p>
          <p>
            Deleting MainFeed removes the application from your device but does
            not automatically delete analytics information already processed by Google.
          </p>
          <p>
            Where applicable, you may request deletion of personal information
            held or controlled by us by contacting us using the details below.
          </p>
        </section>

        <section>
          <h2>8. Data Security</h2>
          <p>We take reasonable measures to protect information processed through MainFeed.</p>
          <p>
            Your personal photos and videos remain on your device, reducing the
            need to transmit or store sensitive media remotely.
          </p>
          <p>
            The security of locally stored photos and videos also depends on your
            device&apos;s operating system and security settings.
          </p>
        </section>

        <section>
          <h2>9. Your Privacy Rights</h2>
          <p>Depending on your location and applicable law, you may have the right to:</p>
          <ul>
            <li>Request access to personal information processed about you;</li>
            <li>Request correction or deletion of personal information;</li>
            <li>Restrict or object to certain processing activities;</li>
            <li>Withdraw consent where processing is based on consent;</li>
            <li>Request data portability where applicable;</li>
            <li>Lodge a complaint with a relevant data protection authority.</li>
          </ul>
          <p>To exercise applicable privacy rights, please contact us using the information below.</p>
          <p>
            Because MainFeed does not require user accounts, we may need additional
            information to identify analytics records associated with your request.
          </p>
          <p>We will respond in accordance with applicable data protection laws.</p>
        </section>

        <section>
          <h2>10. Children&apos;s Privacy</h2>
          <p>MainFeed is not intended to collect personal information from children in violation of applicable law.</p>
          <p>
            We do not knowingly use MainFeed to collect personal information from
            children in circumstances prohibited by applicable law.
          </p>
          <p>
            If we become aware of personal information collected in violation of
            applicable children&apos;s privacy requirements, we will take appropriate
            steps to address it.
          </p>
        </section>

        <section>
          <h2>11. International Data Processing</h2>
          <p>
            Google Analytics for Firebase may process technical and usage information
            in countries other than the country where you reside.
          </p>
          <p>
            Where required by applicable law, we will implement appropriate
            safeguards for international transfers of personal information.
          </p>
        </section>

        <section>
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in the application,
            our information practices, or applicable legal requirements.
          </p>
          <p>
            When we make changes, we will update the “Last Updated” date above
            and provide additional notice where required by law.
          </p>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or your privacy rights, please contact:</p>
          <address className="not-italic">
            MonClips Inc.
            <br />
            Delaware, United States
            <br />
            Email: <a className="underline underline-offset-4" href="mailto:support@mainfeed.life">support@mainfeed.life</a>
          </address>
        </section>
      </article>
    </main>
  );
}
