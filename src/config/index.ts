// ─────────────────────────────────────────────────────────────────────────────
// ALADDIN IT WORLD — CENTRAL CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export type Tier = "refurb" | "certified" | "pristine";

// ─── TIER DEFINITIONS ────────────────────────────────────────────────────────
export const TIERS: Record<Tier, {
  label: string;
  tagline: string;
  warranty: string;
  color: string;
  bg: string;
  border: string;
  description: string;
  includes: string[];
  caveats: string[];
}> = {
  refurb: {
    label: "CPO Refurbished",
    tagline: "Best Value",
    warranty: "1 Month Warranty",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    description:
      "Fully quality-tested pre-owned units at the best price point. May have repair history or replaced parts. Visible scratches or minor dents possible. Every unit passes our 100+ point inspection.",
    includes: [
      "100+ point quality inspection",
      "Fully functional guarantee",
      "May include repaired or replaced parts",
      "1 month warranty",
      "5-Year Service Plan included",
    ],
    caveats: [
      "May have visible scratches or minor dents",
      "May have prior service or repair history",
      "Parts may not be OEM in all cases",
    ],
  },
  certified: {
    label: "CPO Certified",
    tagline: "Most Popular",
    warranty: "3 Months Warranty",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/40",
    description:
      "Higher-tier pre-owned units with no dents. Light signs of use may be visible. Serviced exclusively with genuine Apple parts. The sweet spot between quality and value.",
    includes: [
      "100+ point quality inspection",
      "Genuine Apple parts only",
      "No dents",
      "3 months warranty",
      "5-Year Service Plan included",
    ],
    caveats: [
      "Light signs of prior use may be visible",
    ],
  },
  pristine: {
    label: "CPO Pristine",
    tagline: "Like New",
    warranty: "6 Months Warranty",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    description:
      "Like-new condition units. Battery health 90%+. No scratches, no dents, no visible signs of use. The closest you get to buying new — at a fraction of the price.",
    includes: [
      "100+ point quality inspection",
      "Battery health 90% or above",
      "Genuine Apple parts only",
      "No scratches, no dents",
      "6 months warranty",
      "5-Year Service Plan included",
    ],
    caveats: [],
  },
};

// ─── EXTENDED SERVICE PLAN — applies to every tier ──────────────────────────
export const EXTENDED_SERVICE_PLAN = {
  duration: "5 Years",
  appliesTo: "Every CPO tier — Refurbished, Certified, and Pristine",
  benefits: [
    "Service charges completely free for 5 years from date of purchase",
    "Up to 50% discount on spare parts",
  ],
  notes: [
    "Spare parts used during service are original used/refurbished parts, subject to availability",
    "Replacement of parts does not extend or renew the original product warranty period",
    "Cosmetic variations may exist due to the use of original used parts",
  ],
};

// ─── WARRANTY LEGAL TERMS — full text, used on /warranty and /terms ─────────
export const WARRANTY_TERMS = {
  baseWarranty: {
    title: "1. Product Warranty (Used Products)",
    points: [
      "All used/refurbished products sold by the Company are covered under a limited warranty ranging up to 90 days from the date of invoice, with the exact duration depending on the specific unit and CPO grade purchased (1 month / 3 months / 6 months).",
      "The warranty covers only manufacturing defects and functional hardware issues existing at the time of sale.",
    ],
    exclusions: [
      "Physical damage, liquid damage, burn marks, or breakage",
      "Software issues, virus infections, or data loss",
      "Damage caused by misuse, improper handling, power fluctuations, or unauthorized repairs",
      "Consumable parts such as batteries, chargers, adapters, cables, and accessories unless otherwise specified in writing",
    ],
  },
  extendedService: {
    title: "2. Extended Service Warranty – 5 Years",
    points: [
      "The Company offers a 5 (Five) year service warranty from the date of purchase, subject to the terms below.",
      "Service charges are completely free.",
      "Up to 50% discount will be provided on spare parts.",
      "Spare parts provided during service will be original used/refurbished parts, subject to availability.",
      "Replacement of parts does not extend or renew the original product warranty period.",
      "The customer agrees that cosmetic variations may exist due to the use of original used parts.",
    ],
  },
  claimProcess: {
    title: "3. Warranty Claim Process",
    points: [
      "Warranty service will be provided only upon presentation of the original invoice/warranty proof.",
      "Products must be submitted to the Company's authorized service location for inspection.",
      "The Company reserves the right to repair or replace the defective part at its sole discretion.",
    ],
  },
  liability: {
    title: "4. Limitation of Liability",
    points: [
      "The Company shall not be liable for loss of data, business loss, or indirect or consequential damages.",
      "The Company shall not be liable for delays caused due to part availability or external factors beyond the Company's control.",
    ],
  },
  jurisdiction: {
    title: "5. Jurisdiction",
    points: [
      "All disputes, claims, or legal proceedings arising out of or relating to the sale, warranty, or service of products shall be subject to the exclusive jurisdiction of Thamarassery courts only.",
    ],
  },
};

// ─── SITE CONFIG ──────────────────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: "Aladdin IT World",
  description: "Kerala's trusted Certified Pre-Owned MacBook specialist. Every device inspected, graded, and warranted.",
  tagline: "Certified Pre-Owned MacBooks. Professionally Inspected. Honestly Priced.",
  url: "https://aladdinitworld.com",
  locale: "en-IN",
  region: "Kerala, India",

  social: {
    whatsapp: "https://wa.me/919136922696",
    instagram: "https://instagram.com/aladdinitworld",
    phone: "+91 9136922696",
    email: "aladdinitworld@gmail.com",
    address: "2nd Floor, E.C. Building, adjacent to Koduvally Bus Stand, Koduvally, Kerala 673572",
  },

  showroom: {
    lines: ["2nd Floor, E.C. Building", "Adjacent to Koduvally Bus Stand", "Koduvally, Kerala 673572"],
    street: "2nd Floor, E.C. Building, adjacent to Koduvally Bus Stand",
    locality: "Koduvally",
    region: "Kerala",
    postalCode: "673572",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=E.C.+Building+Koduvally+Bus+Stand+Koduvally+Kerala",
  },

  navigation: [
    { label: "Home",          href: "/" },
    { label: "MacBooks",      href: "/products" },
    { label: "Our Standards", href: "/why-cpo" },
    { label: "Warranty",      href: "/warranty" },
    { label: "Reviews",       href: "/reviews" },
    { label: "B2B",           href: "/b2b" },
    { label: "Contact",       href: "/contact" },
  ],

  features: [
    {
      title: "100+ Point Inspection",
      description: "Every device is put through a rigorous inspection — battery health, display, keyboard, trackpad, ports, speakers, and full performance testing.",
    },
    {
      title: "Graded Warranty",
      description: "1 month on CPO Refurbished, 3 months on CPO Certified, 6 months on CPO Pristine. Transparent coverage, no surprises.",
    },
    {
      title: "Nationwide Delivery",
      description: "Fast, insured shipping across India. Real-time tracking on every order.",
    },
    {
      title: "Secure Payments",
      description: "Multiple payment options including EMI. Every transaction is encrypted and secure.",
    },
    {
      title: "Circular Economy",
      description: "Every CPO MacBook extends a device's life, reduces e-waste, and saves resources — without compromising on quality.",
    },
    {
      title: "Expert Support",
      description: "Direct WhatsApp access to our Apple specialists before and after your purchase.",
    },
  ],

  customerReviews: [
    {
      name: "Ashlin M.L",
      role: "Verified Buyer",
      location: "Kerala",
      rating: 5,
      text: "Bought a Certified Pre-Owned MacBook Pro M1 Pro from Aladdin IT World and the experience was excellent. The MacBook was in great condition, battery health was good, and everything worked perfectly. The team explained the warranty clearly and helped me choose the right model for my budget. Highly recommended for anyone looking for a quality MacBook in Kerala.",
      avatar: null as string | null,
      source: "Google Reviews",
    },
    {
      name: "Deekshith",
      role: "Local Guide",
      location: "Kerala",
      rating: 5,
      text: "Recently bought a MacBook Pro from Aladdin. The buying experience was very smooth and the staff was very helpful and professional. Really happy with the purchase.",
      avatar: null as string | null,
      source: "Google Reviews",
    },
    {
      name: "Rijina N",
      role: "Verified Buyer",
      location: "Kerala",
      rating: 5,
      text: "Got my dream M1 32 core GPU unit, was looking for it from few days. From the very first interaction, they were very professional and friendly. I strongly recommend purchasing from them.",
      avatar: null as string | null,
      source: "Google Reviews",
    },
    {
      name: "Amruthul Prakash",
      role: "Student",
      location: "Kerala",
      rating: 5,
      text: "I just bought a pre-owned MacBook Air M4 a couple of months ago. For a student, finding a good MacBook is genuinely tough — lots of shops charge high prices with quality that isn't remarkable. But this purchase was an overall good deal — the machine is insane.",
      avatar: null as string | null,
      source: "Instagram DM",
    },
  ],

  faqItems: [
    {
      question: "What does Certified Pre-Owned (CPO) mean?",
      answer: "CPO means every device has been professionally inspected, tested, cleaned, and graded before sale. Unlike buying used from an individual, a CPO MacBook comes with documented condition grading, a warranty, and accountability. We stand behind every unit we sell.",
    },
    {
      question: "What is the difference between CPO Refurbished, CPO Certified, and CPO Pristine?",
      answer: "CPO Refurbished: fully tested, best price, may have cosmetic wear and prior service history — 1 month warranty. CPO Certified: no dents, genuine Apple parts only, light signs of use — 3 months warranty. CPO Pristine: like-new condition, battery health 90%+, no cosmetic flaws — 6 months warranty.",
    },
    {
      question: "What does the warranty cover?",
      answer: "Warranty covers hardware defects and functional failures — display issues, battery defects, port failures, keyboard or trackpad faults. It does not cover accidental or liquid damage. Raise a claim on WhatsApp and we'll resolve it fast.",
    },
    {
      question: "Are CPO Refurbished units reliable for daily use?",
      answer: "Yes. Every CPO Refurbished unit passes the same 100+ point inspection as our higher tiers. The difference is cosmetic condition — not performance or reliability. Thousands of students and professionals use them daily.",
    },
    {
      question: "Can I see the battery health before buying?",
      answer: "Yes. We share battery health reports on request for any unit. CPO Pristine units are guaranteed at 90%+. CPO Refurbished and Certified vary — ask us and we'll tell you the exact figure.",
    },
    {
      question: "Do you offer EMI?",
      answer: "Yes, EMI is available on purchases above ₹50,000 via select payment partners. Chat with us on WhatsApp for current options.",
    },
    {
      question: "Do you take my old laptop in exchange?",
      answer: "Yes. Send photos and the model of your current MacBook or laptop on WhatsApp. We give you an exchange value and take it off the price of the MacBook you buy.",
    },
    {
      question: "Do you deliver outside Kerala?",
      answer: "Yes. We ship insured, with tracking, to any address in India. Kerala customers can also collect from our showroom in Koduvally.",
    },
    {
      question: "Where is your showroom and when is it open?",
      answer: "2nd Floor, E.C. Building, adjacent to Koduvally Bus Stand, Koduvally, Kerala 673572. Open Monday to Friday 9 am to 9 pm, Saturday 10 am to 8 pm; closed on Sunday.",
    },
    {
      question: "What is the 5-year service plan?",
      answer: "Every MacBook you buy from us includes 5 years of free service charges and up to 50% off spare parts. Parts used are original used or refurbished parts, subject to availability.",
    },
    {
      question: "How do I make a warranty claim?",
      answer: "Message us on WhatsApp with your invoice and the problem. The unit is inspected at our service location, and we repair or replace the faulty part.",
    },
    {
      question: "Can I upgrade my grade after purchase?",
      answer: "Yes. We run a trade-in programme — return your unit and upgrade to a higher grade at any time, subject to stock and condition assessment.",
    },
  ],

  stats: {
    devices: "Growing",
    customers: "Trusted",
    rating: "5.0",
    reviews: "42+", // real 5-star reviews on Google Maps Business
  },

  // Figures kept at the owner's request; confirm each one before launch
  impact: [
    { value: "2,000+", label: "MacBooks and devices given a second owner" },
    { value: "5,000+ kg", label: "of e-waste kept out of landfill" },
    { value: "1,200+ t", label: "of CO₂ saved against building new" },
    { value: "500,000+ L", label: "of water saved in manufacturing" },
  ],
};

export const BUSINESS_HOURS = {
  monday:    "9:00 AM – 9:00 PM",
  tuesday:   "9:00 AM – 9:00 PM",
  wednesday: "9:00 AM – 9:00 PM",
  thursday:  "9:00 AM – 9:00 PM",
  friday:    "9:00 AM – 9:00 PM",
  saturday:  "10:00 AM – 8:00 PM",
  sunday:    "Closed",
};

export const METADATA = {
  title: "Aladdin IT World | Certified Pre-Owned MacBooks in Kerala, India",
  description: "Kerala's trusted CPO MacBook specialist. Every device professionally inspected and graded — Refurbished, Certified, and Pristine. Warranty included. Nationwide delivery.",
  keywords: [
    "certified pre-owned MacBook India",
    "CPO MacBook Kerala",
    "pre-owned MacBook M1 M2",
    "MacBook specialist Kerala",
    "buy MacBook Calicut",
    "MacBook with warranty India",
    "Aladdin IT World",
    "pre-owned Apple devices India",
  ],
};

// ─── UNITS (one per physical MacBook) ─────────────────────────────────────────
export type UnitStatus = "available" | "reserved" | "sold";
export type UnitPhoto = { src: string; width: number; height: number };

export type Unit = {
  id: string; // 8 characters; the last 8 of the Sanity document id
  model: string; // "MacBook Pro"
  screen: number; // 14
  chip: string; // "Apple M1 Pro"
  ram: number; // GB
  storage: string; // "512GB"
  year: number | null;
  grade: Tier;
  battery: number | null;
  cosmetic: string | null;
  included: string[];
  price: number;
  headline: string | null; // optional short line shown with the name
  originalPrice: number | null; // the price before an offer, shown crossed out
  status: UnitStatus;
  photos: UnitPhoto[];
  description: string;
  createdAt: string;
};
