import { SITE_CONFIG, BUSINESS_HOURS } from '@/config';
import { ChatIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/Icons';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Aladdin IT World, Thamarassery, Kerala');

export default function ContactPage() {
  const { phone, email, address, whatsapp } = SITE_CONFIG.social;
  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark">

      <section className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-accent/20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto hero-seq">
          <p className="eyebrow mb-3">Get in Touch</p>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-black dark:text-white mb-4">
            Talk to Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl">
            WhatsApp is the fastest way to reach us. Most questions get answered within the hour.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-dark">
        <div className="max-w-3xl mx-auto">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-8 sm:p-10 rounded-2xl text-center mb-8 sm:mb-10 t-ui hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/25 active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)' }}
          >
            <ChatIcon className="w-10 h-10 mx-auto mb-3 text-black" />
            <p className="font-display font-bold text-2xl text-black mb-2">Chat on WhatsApp</p>
            <p className="text-black/80 text-sm">{phone}</p>
          </a>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl border border-accent/20 bg-zinc-50 dark:bg-zinc-900 min-w-0">
              <p className="flex items-center gap-2 eyebrow mb-2"><MailIcon className="w-4 h-4" /> Email</p>
              <a href={`mailto:${email}`} className="text-black dark:text-white font-medium hover:text-accent transition-colors break-all">
                {email}
              </a>
            </div>
            <div className="p-6 rounded-2xl border border-accent/20 bg-zinc-50 dark:bg-zinc-900">
              <p className="flex items-center gap-2 eyebrow mb-2"><PhoneIcon className="w-4 h-4" /> Phone</p>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-black dark:text-white font-medium hover:text-accent transition-colors">
                {phone}
              </a>
            </div>
            <div className="p-6 rounded-2xl border border-accent/20 bg-zinc-50 dark:bg-zinc-900 sm:col-span-2">
              <p className="flex items-center gap-2 eyebrow mb-2"><PinIcon className="w-4 h-4" /> Address</p>
              <p className="text-black dark:text-white font-medium">{address}</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-semibold text-accent hover:underline py-1"
              >
                Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 p-6 rounded-2xl border border-accent/20 bg-zinc-50 dark:bg-zinc-900">
            <h2 className="eyebrow mb-4">Business Hours</h2>
            <dl className="grid gap-x-10 text-sm sm:grid-cols-2">
              {Object.entries(BUSINESS_HOURS).map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4 py-2 border-b border-accent/10">
                  <dt className="text-gray-600 dark:text-gray-400 capitalize">{day}</dt>
                  <dd className="text-black dark:text-white font-medium tabular">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
