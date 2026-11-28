import { pageMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/config';

export const metadata = pageMeta({
  title: "Privacy Policy | Aladdin IT World",
  description: "How Aladdin IT World handles your information when you visit the website, message us or buy a MacBook. Read the full privacy policy.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-accent/20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-accent">Legal</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-black dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto prose prose-sm sm:prose-base dark:prose-invert">
          <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">1. Who We Are</h2>
              <p>
                Aladdin IT World ("we", "us", "our") operates as a Certified Pre-Owned MacBook retailer based at {SITE_CONFIG.social.address}. This Privacy Policy explains how we collect, use, and protect information when you interact with us through our website, WhatsApp, or other communication channels.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">2. Information We Collect</h2>
              <p className="mb-2">When you contact us or make a purchase, we may collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your name, phone number, and email address</li>
                <li>Delivery address for shipping purposes</li>
                <li>Payment details (processed securely through third-party payment providers — we do not store full card details)</li>
                <li>Communication history via WhatsApp, email, or phone</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To process and fulfil your orders</li>
                <li>To provide warranty support and respond to service requests</li>
                <li>To communicate updates about your order or inquiry</li>
                <li>To improve our products and customer service</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">4. Information Sharing</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share necessary information with delivery partners and payment processors solely to complete your transaction.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">5. WhatsApp Communication</h2>
              <p>
                When you message us on WhatsApp, your messages are subject to WhatsApp's own privacy policy in addition to this one. We use WhatsApp solely to communicate about inquiries, orders, and support.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">6. Data Security</h2>
              <p>
                We take reasonable measures to protect your information from unauthorized access. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">7. Your Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal information at any time by contacting us at {SITE_CONFIG.social.email}.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">9. Contact Us</h2>
              <p>
                For any questions about this Privacy Policy, contact us at{' '}
                <a href={`mailto:${SITE_CONFIG.social.email}`} className="text-accent hover:underline">
                  {SITE_CONFIG.social.email}
                </a>{' '}
                or via WhatsApp at {SITE_CONFIG.social.phone}.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
