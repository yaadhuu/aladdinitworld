/*
  Ozy's built-in understanding: used when no AI key is configured, or when the AI call fails.

  Ozy reads a message the way a good shop assistant would:
  1. It cleans the text and fixes common typos ("warenty", "macbok", "pristin").
  2. It senses the visitor's mood (upset, worried, unsure, excited, in a hurry) and answers in kind.
  3. It pulls out what they want: a budget, chip, screen size, memory, grade, Air or Pro, or a use
     (college, coding, video editing, office).
  4. It answers from the site's own data only: live stock, grades, warranty, FAQ, hours, reviews.
  It remembers the conversation, so "and 16 inch?" or "anything cheaper?" build on the last question.

  Replies may carry markers the chat panel turns into buttons or expressions:
    [[link:<href>|<label>]]   a button to a page
    [[handoff]]               a "Message our team" button
    [[mood:happy|sorry|thinking|neutral]]   Ozy's expression for this reply
*/
import { SITE_CONFIG, TIERS, BUSINESS_HOURS, type Tier, type Unit } from '@/config';
import { gradeName, unitMemory, unitName, warrantyShort, TIER_ORDER } from '@/lib/unit-helpers';

type Faq = { question: string; answer: string };
type Review = { name: string; text: string; rating: number };
type Turn = { role: 'user' | 'assistant'; content: string };
type Mood = 'happy' | 'sorry' | 'thinking' | 'neutral';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const fmtHours = (h: string) => h.replace(/:00/g, '').replace(/AM/g, 'am').replace(/PM/g, 'pm');
const pick = <T,>(list: T[], seed: string) => list[[...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % list.length];
const withMood = (mood: Mood, text: string) => `[[mood:${mood}]]${text}`;

// The 13 inspection areas, as listed on the Grades page
const INSPECTION = ['identity and ownership', 'display', 'chassis and body', 'keyboard and trackpad', 'battery', 'screen and GPU', 'storage', 'memory', 'ports and wireless', 'audio and camera', 'system and thermals', 'Touch ID and keys', 'repair history'];

// ── 1. Clean the text ──────────────────────────────────────────────────────
const SYNONYMS: [RegExp, string][] = [
  [/\bmac\s*books?\b|\bmacs?\b|\blaptops?\b|\bnotebooks?\b|\bsystems?\b/g, ' macbook '],
  [/\bm\s?([1-4])\b/g, ' m$1 '],
  [/\bcore\s?i([3579])\b|\bi\s([3579])\b/g, ' i$1$2 '],
  [/\brefurb(ished)?\b|\bsecond\s*hand\b|\bpre[\s-]?owned\b/g, ' refurbished '],
  [/\blike\s*new\b|\bmint\b/g, ' pristine '],
  [/\bguarantee\b|\bwar+[ae]n?t(y|ee)\b/g, ' warranty '],
  [/\binstal+ments?\b|\bfinance\b|\bloan\b|\bno\s*cost\b|\bmonthly payments?\b/g, ' emi '],
  [/\btrade[\s-]?in\b|\bexchang(e|ing)\b|\bswap\b|\bsell\s*my\b/g, ' exchange '],
  [/\bship(ping)?\b|\bcourier\b|\bdeliver(y|ed)?\b|\bsend\s*to\b|\bhome delivery\b/g, ' delivery '],
  [/\btimings?\b|\bopen(ing)?\b|\bclos(e|ed|ing)\b|\bhours?\b/g, ' hours '],
  [/\blocation\b|\baddress\b|\bwhere\b|\bshowroom\b|\bdirections?\b|\bmap\b/g, ' location '],
  [/\bu\b/g, ' you '], [/\bur\b/g, ' your '], [/\bpls\b|\bplz\b/g, ' please '], [/\bthx\b|\bty\b|\btnx\b/g, ' thanks '],
];

// Words worth correcting when a visitor mistypes them
const VOCAB = ['macbook', 'warranty', 'pristine', 'certified', 'refurbished', 'exchange', 'delivery', 'battery', 'location', 'available', 'cheapest', 'budget',
  'inspection', 'service', 'student', 'college', 'coding', 'programming', 'editing', 'video', 'photo', 'office', 'difference', 'condition', 'genuine', 'original',
  'payment', 'trusted', 'reviews', 'recommend', 'suggest', 'storage', 'memory', 'thanks', 'hello', 'price', 'grade', 'hours', 'repair'];

function lev(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
// Real words that sit one letter away from a vocabulary word and must stay as typed
const KEEP = new Set('phone phones store stores model models place today later hour sorry worry gradu prize price prices grade graded trade order orders photos codes coded match watch where there their three thing things think offer offers money month months great grand range other mother water power tower better letter matter batter guaranty storage stories memory memo video audio radio services servers device devices advice office officer'.split(' '));
const fix = (w: string) => {
  if (w.length < 5 || VOCAB.includes(w) || KEEP.has(w) || /\d/.test(w)) return w;
  const max = w.length >= 7 ? 2 : 1;
  let best = { w, d: max + 1 };
  for (const v of VOCAB) { const d = lev(w, v); if (d < best.d) best = { w: v, d }; }
  return best.d <= max ? best.w : w;
};

function normalize(text: string) {
  let t = ` ${text.toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}₹.,!?\s-]/gu, ' ')} `;
  t = t.split(/\s+/).map(fix).join(' ');
  for (const [re, to] of SYNONYMS) t = t.replace(re, to);
  return t.replace(/\s+/g, ' ').trim();
}
const STOP = new Set('a an the is are am do does did you your i me my we our to of for in on at it this that and or with can could would will be have has what which how any please tell about show give want need get'.split(' '));
const stem = (w: string) => w.replace(/[?!.,]+$/, '').replace(/(ing|es|s)$/, '') || w;
const words = (t: string) => t.split(' ').map((w) => w.replace(/[?!.,]+$/, '')).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);
const has = (t: string, ...keys: string[]) => keys.some((k) => new RegExp(`\\b${k}\\b`).test(t));

// ── 2. Mood ────────────────────────────────────────────────────────────────
type Feeling = 'upset' | 'worried' | 'unsure' | 'excited' | 'urgent' | null;
function feeling(raw: string, t: string): Feeling {
  if (/\b(not working|stopped working|broken|dead|issue|problem|complain|complaint|angry|worst|bad experience|disappoint|frustrat|useless|waste|cheated|fraud|refund|terrible|horrible)\w*/.test(t) || /!{2,}/.test(raw)) return 'upset';
  if (/\b(worried|scared|afraid|nervous|trust|genuine|fake|original|scam|safe|risk|reliable|legit|real)\b/.test(t)) return 'worried';
  if (/\b(confused|dont understand|not sure|unsure|help me (choose|decide|pick)|which (one|should|is better)|dont know)\b/.test(t)) return 'unsure';
  if (/\b(urgent|asap|immediately|today itself|right now|quickly|emergency)\b/.test(t)) return 'urgent';
  if (/\b(love|awesome|amazing|excited|wow|great|superb|finally|cant wait|beautiful)\b/.test(t)) return 'excited';
  return null;
}

// ── 3. What they want ──────────────────────────────────────────────────────
type Ask = { max?: number; min?: number; chip?: string; size?: number; ram?: number; grade?: Tier; family?: 'air' | 'pro'; order?: 'low' | 'high'; use?: Use };
type Use = { label: string; ram: number; why: string; pro?: boolean };

const USES: [RegExp, Use][] = [
  [/\b(video|editing|edit|final cut|premiere|davinci|resolve|youtube|reels|after effects|3d|blender|render)\w*/, { label: 'video editing', ram: 16, pro: true, why: 'For video editing, 16GB of memory and a Pro chip keep timelines and exports smooth.' }],
  [/\b(coding|programming|developer|development|software|android studio|xcode|docker|data science|machine learning)\w*/, { label: 'coding', ram: 16, why: 'For coding, 16GB of memory helps with an editor, a browser and a simulator open together.' }],
  [/\b(photo|photography|lightroom|photoshop|design|figma|illustrator)\w*/, { label: 'photo and design work', ram: 16, why: 'For photo and design work, 16GB of memory keeps large files responsive.' }],
  [/\b(music|logic pro|garageband|audio production)\b/, { label: 'music production', ram: 16, why: 'For music production, 16GB of memory handles larger projects comfortably.' }],
  [/\b(student|college|school|study|studies|assignment|class)\w*/, { label: 'college', ram: 8, why: 'For college work, any of our MacBooks is more than enough; the Air is the lightest to carry.' }],
  [/\b(office|excel|word|browsing|email|netflix|movies|basic|daily use|light use|zoom|meetings)\b/, { label: 'everyday work', ram: 8, why: 'For everyday work, browsing and meetings, any of our MacBooks handles it with ease.' }],
];

function money(raw: string, unit?: string) {
  const n = parseFloat(raw.replace(/,/g, ''));
  if (!unit) return n < 1000 ? n * 1000 : n; // "under 60" in a price question means 60,000
  return /^l/.test(unit) ? n * 100_000 : n * 1000;
}

function entities(t: string): Ask {
  const a: Ask = {};
  for (const m of t.match(/(?:₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|thousand|lakhs?|lacs?|l)?\b/g) ?? []) {
    const [, raw, unit] = m.match(/(\d[\d,]*(?:\.\d+)?)\s*(k|thousand|lakhs?|lacs?|l)?/) ?? [];
    if (!raw) continue;
    const n = parseFloat(raw.replace(/,/g, ''));
    const at = t.indexOf(m);
    const before = t.slice(0, at);
    const cue = /₹|rs|inr/.test(m) || /(under|below|within|less than|budget|upto|up to|max|above|over|around|about|from|for|price|have)\s*$/.test(before);
    // skip specs and years: screen sizes, memory and storage, chip generations, 2019
    if (!unit && !cue && (n <= 64 || [128, 256, 512, 1000, 2000].includes(n) || (n >= 2015 && n <= 2030))) continue;
    if (!unit && /^\s*(inch|in|gb|tb)\b/.test(t.slice(at + m.length))) continue;
    const v = money(raw, unit);
    if (/(above|over|more than|min(imum)?|from|starting)\s*$/.test(before)) a.min = v; else a.max = v;
  }
  if (a.max && /\b(around|about|near|approx)/.test(t)) { a.min = a.max * 0.8; a.max = a.max * 1.2; }

  const chip = t.match(/\b(m[1-4])(\s(pro|max))?\b/) ?? t.match(/\b(i[3579])\b/) ?? t.match(/\b(intel)\b/);
  if (chip) a.chip = chip[0];
  const size = t.match(/\b(13|14|15|16)(\s?(inch|in|"|”))?\b/);
  if (size && (size[2] || !/\d\s*gb/.test(t.slice(t.indexOf(size[0]))))) a.size = +size[1];
  const ram = t.match(/\b(8|16|18|24|32|36|48|64)\s?gb\b/);
  if (ram) { a.ram = +ram[1]; if (a.size === a.ram) delete a.size; }
  if (has(t, 'pristine')) a.grade = 'pristine';
  else if (has(t, 'certified')) a.grade = 'certified';
  else if (has(t, 'refurbished') && /\b(only|grade)\b/.test(t)) a.grade = 'refurb';
  if (has(t, 'air')) a.family = 'air';
  else if (/\bmacbook pro\b/.test(t)) a.family = 'pro';
  if (/\b(cheap(est|er)?|lowest|affordable|low price|least|budget)\b/.test(t)) a.order = 'low';
  if (/\b(best|top|most powerful|highest|premium|expensive|powerful)\b/.test(t)) a.order = 'high';
  const use = USES.find(([re]) => re.test(t));
  if (use) a.use = use[1];
  return a;
}

// ── 4. Answers ─────────────────────────────────────────────────────────────
const line = (u: Unit) =>
  `• ${unitName(u)}, ${unitMemory(u)}, ${gradeName(u.grade)}: ${inr(u.price)}${u.battery !== null ? `, battery ${u.battery}%` : ''}${u.status === 'reserved' ? ' (reserved)' : ''}`;

function describe(a: Ask) {
  const range = a.max !== undefined && a.min !== undefined ? `${inr(a.min)} to ${inr(a.max)}` : a.max !== undefined ? `under ${inr(a.max)}` : a.min !== undefined ? `above ${inr(a.min)}` : null;
  const chip = a.chip?.toUpperCase().replace(/ (PRO|MAX)$/, (m) => ` ${m.trim().charAt(0)}${m.trim().slice(1).toLowerCase()}`);
  return [a.family && `MacBook ${a.family === 'air' ? 'Air' : 'Pro'}`, chip, a.size && `${a.size}-inch`, a.ram && `${a.ram}GB`, a.grade && gradeName(a.grade), range].filter(Boolean).join(', ');
}

function match(a: Ask, units: Unit[]) {
  const fits = units.filter((u) => u.status !== 'sold' &&
    (a.max === undefined || u.price <= a.max) && (a.min === undefined || u.price >= a.min) &&
    (!a.chip || u.chip.toLowerCase().includes(a.chip)) && (!a.size || u.screen === a.size) &&
    (!a.ram || u.ram === a.ram) && (!a.use || u.ram >= a.use.ram) && (!a.use?.pro || /pro|max/i.test(u.chip)) &&
    (!a.grade || u.grade === a.grade) && (!a.family || u.model.toLowerCase().includes(a.family)));
  return fits.sort((x, y) => (a.order === 'high' ? y.price - x.price : x.price - y.price));
}

function stockReply(a: Ask, units: Unit[] | null, opener = '') {
  // null: the live stock could not be loaded (the chat panel answering on its own while offline)
  if (!units) return withMood('thinking', `${opener}I cannot load the live stock this second. You can browse every MacBook we have, or our team can check ${describe(a) || 'it'} for you right away. [[link:/products|See all MacBooks]] [[handoff]]`);
  const live = units.filter((u) => u.status !== 'sold');
  if (!live.length) return withMood('sorry', `${opener}There are no MacBooks listed right now, as new stock is being added. Tell our team the model or budget you have in mind and we will message you when one arrives. [[handoff]]`);
  const fits = match(a, live);
  const want = describe(a);
  const why = a.use ? `${a.use.why}\n\n` : '';

  if (fits.length) {
    const top = fits.slice(0, 3);
    const head = fits.length === 1
      ? `I found one MacBook${want ? ` for ${want}` : a.use ? ` that suits ${a.use.label}` : ''}:`
      : `I found ${fits.length} MacBooks${want ? ` for ${want}` : a.use ? ` that suit ${a.use.label}` : ''}. ${fits.length > 3 ? 'The best three:' : 'Here they are:'}`;
    return withMood('happy', `${opener}${why}${head}\n${top.map(line).join('\n')}\n\nEvery price includes the grade's warranty and our 5-year service plan. Want live photos of any of these? [[link:/products|See all MacBooks]]`);
  }
  const target = a.max ?? a.min;
  const near = [...match({ ...a, max: undefined, min: undefined, order: undefined }, live), ...live]
    .filter((u, i, arr) => arr.indexOf(u) === i)
    .sort((x, y) => (target ? Math.abs(x.price - target) - Math.abs(y.price - target) : x.price - y.price)).slice(0, 2);
  return withMood('thinking', `${opener}${why}Nothing in stock matches ${want || 'that'} exactly right now. The closest options:\n${near.map(line).join('\n')}\n\nNew units arrive often, and our team can keep one aside for you. [[link:/products|See all MacBooks]] [[handoff]]`);
}

function gradesReply(t: string) {
  const named = TIER_ORDER.filter((k) => has(t, k === 'refurb' ? 'refurbished' : k));
  if (named.length === 2) {
    const [x, y] = named;
    return withMood('neutral', `${gradeName(x)} vs ${gradeName(y)}:\n• ${gradeName(x)} (${warrantyShort(x)} warranty): ${TIERS[x].description}\n• ${gradeName(y)} (${warrantyShort(y)} warranty): ${TIERS[y].description}\n\nBoth pass the same 100+ point inspection; the difference is cosmetic condition and warranty length. [[link:/why-cpo|Compare the grades]]`);
  }
  if (named.length === 1 && !/\b(difference|compare|vs|versus|which|all|grades)\b/.test(t)) {
    const k = named[0];
    return withMood('neutral', `${gradeName(k)}: ${TIERS[k].description} It comes with a ${warrantyShort(k)} warranty, plus the 5-year service plan. [[link:/why-cpo|How we grade]]`);
  }
  return withMood('neutral', `We sell three grades:\n${TIER_ORDER.map((k) => `• ${gradeName(k)} (${warrantyShort(k)} warranty): ${TIERS[k].description.split('. ')[0]}.`).join('\n')}\n\nCertified is the most popular balance of condition and price. [[link:/why-cpo|Compare the grades]]`);
}

const warrantyReply = () => withMood('neutral', `Each MacBook has a base warranty set by its grade: ${TIER_ORDER.map((k) => `${warrantyShort(k)} ${gradeName(k)}`).join(', ')}. On top of that, every purchase includes our 5-year service plan: free service charges and up to 50% off spare parts. [[link:/warranty|Warranty details]]`);

function nowInIndia() {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (k: string) => p.find((x) => x.type === k)?.value ?? '';
  return { day: get('weekday').toLowerCase() as keyof typeof BUSINESS_HOURS, min: +get('hour') * 60 + +get('minute') };
}
function openNow() {
  const { day, min } = nowInIndia();
  const times = [...BUSINESS_HOURS[day].matchAll(/(\d{1,2}):(\d{2})\s*(AM|PM)/g)].map(([, h, m, ap]) => ((+h % 12) + (ap === 'PM' ? 12 : 0)) * 60 + +m);
  return times.length === 2 && min >= times[0] && min < times[1];
}
const hoursText = () => `Monday to Friday ${fmtHours(BUSINESS_HOURS.monday)}, Saturday ${fmtHours(BUSINESS_HOURS.saturday)}, Sunday ${BUSINESS_HOURS.sunday.toLowerCase()}`;
const hoursReply = () => withMood('neutral', `${openNow() ? 'We are open right now.' : 'We are closed right now.'} Our hours: ${hoursText()}. [[link:/contact|Visit us]]`);
const locationReply = () => withMood('neutral', `Our showroom is at ${SITE_CONFIG.showroom.lines.join(', ')}, open ${hoursText()}. We also deliver insured across India. [[link:${SITE_CONFIG.showroom.mapsUrl}|Get directions]]`);
const contactReply = () => withMood('neutral', `The quickest way is WhatsApp on ${SITE_CONFIG.social.phone}; most messages are answered within the hour. You can also call that number or email ${SITE_CONFIG.social.email}. [[handoff]]`);

function trustReply(reviews: Review[], opener: string) {
  const r = reviews.find((x) => x.rating === 5 && x.text.length < 220) ?? reviews[0];
  const quote = r ? `\n\nOne buyer, ${r.name}, wrote: "${r.text.length > 180 ? r.text.slice(0, 177).trimEnd() + '...' : r.text}"` : '';
  return withMood('happy', `${opener}Every MacBook we sell passes a documented 100+ point inspection, is graded honestly, and comes with a warranty and our 5-year service plan. We are rated ${SITE_CONFIG.stats.rating} from ${SITE_CONFIG.stats.reviews} Google reviews, and you are welcome to inspect any unit at our Koduvally showroom before you pay.${quote} [[link:/why-cpo|How we inspect]]`);
}

function faqReply(t: string, faqs: Faq[]) {
  const q = words(t);
  if (!q.length) return null;
  let best = { score: 0, a: '' };
  for (const f of faqs) {
    const fq = words(normalize(f.question));
    const fa = new Set(words(normalize(f.answer)));
    const score = q.reduce((s, w) => s + (fq.includes(w) ? 2 : fa.has(w) ? 0.6 : 0), 0) / Math.sqrt(fq.length + 2);
    if (score > best.score) best = { score, a: f.answer };
  }
  return best.score >= 0.75 ? best.a : null;
}

// The visitor's name, if they gave it ("I am Arjun", "my name is Sara")
function nameFrom(messages: Turn[]) {
  for (const m of [...messages].reverse()) {
    if (m.role !== 'user') continue;
    const c = m.content.trim();
    // "my name is sara" anywhere; "i am sara" / "this is sara" only as the whole message
    const n = c.match(/\b(?:my name is|call me)\s+([a-z]{2,15})\b/i) ?? c.match(/^(?:hi,?\s+|hello,?\s+)?(?:i am|im|i'm|this is)\s+([a-z]{2,15})[.!]?$/i);
    if (n && !/^(looking|interested|from|not|just|here|good|fine|ok|okay|student|worried|confused|sure|back|new|ready|happy|sad|angry|well|great|done|buying|planning)$/i.test(n[1]))
      return n[1].charAt(0).toUpperCase() + n[1].slice(1).toLowerCase();
  }
  return null;
}

const OPENERS: Record<Exclude<Feeling, null>, string[]> = {
  upset: ['I am really sorry about this, and I understand how frustrating it is. ', 'I am sorry you are dealing with this. Let us get it sorted. '],
  worried: ['That is a fair question to ask before buying. ', 'Completely understandable, buying pre-owned should feel safe. '],
  unsure: ['Happy to help you choose. ', 'No problem, let us narrow it down together. '],
  excited: ['Love the excitement! ', 'Great to hear! '],
  urgent: ['I will keep this quick. ', 'Understood, let us move fast. '],
};

/** One reply from Ozy, from the last message and the conversation so far */
export function ozyReply(messages: Turn[], units: Unit[] | null, faqs: Faq[], reviews: Review[] = []): string {
  const raw = (messages[messages.length - 1]?.content ?? '').trim();
  const t = normalize(raw);
  const w = t.split(' ');
  const name = nameFrom(messages);
  const hi = name ? `, ${name}` : '';
  const mood = feeling(raw, t);
  const opener = mood ? pick(OPENERS[mood], raw) : '';

  if (!t) return withMood('neutral', 'Ask me about a MacBook, a budget, our grades, warranty, exchange or delivery.');
  // Other scripts (Malayalam, Hindi and so on): Ozy reads English best
  if (/[ऀ-ॿഀ-ൿ஀-௿؀-ۿ]/.test(raw) && !/[a-z]{3}/i.test(raw))
    return withMood('neutral', 'I understand English best for now. Please write to me in English, or message our team on WhatsApp for help in your language. [[handoff]]');

  // ── Never share anything internal or private ──
  // Attempts to change Ozy's rules, and asks for internal business data, secrets or other people's details
  // checked on the raw text as well as the cleaned one, since cleaning folds words like "system" into "macbook"
  const g = `${raw.toLowerCase().replace(/\s+/g, ' ')} ${t}`;
  if (/\b(ignore (all |your |the )?(previous|above|prior) (instructions|rules)|system prompt|your (prompt|instructions|rules)|jailbreak|developer mode|pretend (you are|to be)|act as)\b/.test(g)
    || /\b(api keys?|access tokens?|secret keys?|credentials|admin (password|panel|login|access)|(your|the shop'?s?|site'?s?|website'?s?) (password|database|server|backend|source code|env|login|tokens?))\b/.test(g)
    || /\b(cost price|purchase price|buying price|profit|margin|supplier|vendor|wholesale|dealer price|salary|revenue|turnover|sales figures?)\b/.test(g)
    || /\b(other|another|previous|last|their) (customers?|buyers?|clients?)\b.*\b(name|number|phone|address|email|details?|invoice|data)\b/.test(g)
    || /\b(names?|numbers?|phones?|address(es)?|emails?|details|invoices?|data)\b.*\b(other|another|previous|their|your) (customers?|buyers?|clients?)\b/.test(g)
    || /\b(customer|buyer|client) (list|data|details|numbers?|database)\b/.test(g))
    return withMood('neutral', 'I am sorry, I cannot share internal business information, private details or anything about other customers. I am happy to help with our MacBooks, prices on the site, grades, warranty and delivery. What would you like to know?');

  // Their own MacBook is locked or they forgot a password: guide, and never ask for the password
  if (/\b(forg[eo]t|reset|locked|lock|unlock|cant (log|sign) ?in)\b/.test(t) && /\b(password|passcode|login|apple id|icloud|sign in)\b/.test(t))
    return withMood('neutral', 'Sorry to hear that. For a MacBook bought from us, our team can guide you through it on WhatsApp. Please never share your password or Apple ID details with anyone, including us. For an Apple ID or iCloud lock, Apple Support can verify you as the owner. [[handoff]]');

  // ── Small talk ──
  if (name && nameFrom([messages[messages.length - 1]]) && w.length <= 6)
    return withMood('happy', `Nice to meet you, ${name}. What kind of MacBook are you looking for, and what is your budget?`);
  if (w.length <= 5 && /^(hi+|hello|hey+|hai|helo|hlo|namaste|namaskaram|yo|hola|good (morning|afternoon|evening|day))\b/.test(t)) {
    const part = /morning/.test(t) ? 'Good morning' : /afternoon/.test(t) ? 'Good afternoon' : /evening/.test(t) ? 'Good evening' : pick(['Hello', 'Hi there', 'Hey'], raw);
    return withMood('happy', `${part}${hi}! I am Ozy, the Aladdin IT World AI assistant. Tell me your budget or what you will use the MacBook for, and I will find the right one in stock.`);
  }
  if (/\b(how are you|how r you|how are u|hows it going|how do you do|whats up|sup)\b/.test(t))
    return withMood('happy', `I am doing well, thank you for asking${hi}! How can I help you today? I can check stock, explain grades or share our warranty.`);
  if (/\bgood night\b/.test(t)) return withMood('happy', `Good night${hi}! Message us any time, and we will pick it up in the morning.`);
  if (/\b(thanks|thank you|thank u|appreciate|helpful)\b/.test(t) && w.length <= 8)
    return withMood('happy', pick([`You are welcome${hi}! Anything else I can check for you?`, `Happy to help${hi}. Is there anything else you would like to know?`], raw));
  if (/^(ok|okay|k|cool|nice|fine|alright|got it|great|perfect|sure|hmm+|oh)\W*$/.test(t))
    return withMood('happy', 'Great. Would you like me to check stock for a budget, or explain the grades?');
  if (/^(lol|haha+|hehe+|lmao)\W*$/.test(t)) return withMood('happy', 'Glad that made you smile! Anything I can help you find today?');
  if (/^(sorry|my bad|oops)\b/.test(t)) return withMood('happy', 'No worries at all. What can I help you with?');
  if (/\b(bye|goodbye|see you|see ya|take care)\b/.test(t)) return withMood('happy', `Thank you for visiting Aladdin IT World${hi}. We are a WhatsApp message away whenever you need us.`);
  if (/\b(who are you|your name|are you (a )?(bot|human|real|ai|robot)|what are you|who made you|who built you)\b/.test(t))
    return withMood('happy', 'I am not human. I am Ozy, the Aladdin IT World AI assistant. I answer from our live stock, grades and policies, around the clock. For live photos, a battery report or a final price, our team takes over on WhatsApp. [[handoff]]');
  // Simple sums ("what is 2+2"), and off-topic asks: a short polite answer, then back to MacBooks
  const sum = raw.match(/^(?:what(?:'s| is)\s+)?(-?\d+(?:\.\d+)?)\s*([+\-*x×/])\s*(-?\d+(?:\.\d+)?)\s*\??$/i);
  if (sum) {
    const [, x, op, y] = sum;
    const r = op === '+' ? +x + +y : op === '-' ? +x - +y : op === '/' ? (+y === 0 ? NaN : +x / +y) : +x * +y;
    return withMood('happy', `${Number.isFinite(r) ? `That is ${+r.toFixed(4)}.` : 'That one has no answer, since dividing by zero is undefined.'} I am at my best with MacBooks, though. Shall I check what fits your budget?`);
  }
  if (/\b(weather|cricket|football|movie|song|politic\w*|election|recipe|news|girlfriend|boyfriend|homework|translate|essay|poem)\b/.test(t))
    return withMood('neutral', 'That is outside what I can help with here. I am the Aladdin IT World assistant, so I am at my best with MacBooks: stock, grades, warranty, exchange and delivery. What can I check for you?');
  if (/\bjoke\b/.test(t)) return withMood('happy', 'Here is one: why did the MacBook enrol in college? It wanted a few more cores. Now, can I help you find one?');
  if (/\b(are you there|anyone there|hello\?)\b/.test(t)) return withMood('happy', 'Yes, I am here! What would you like to know?');

  // ── Feelings that need a person or reassurance ──
  if (mood === 'upset' && !/\b(available|stock|price|budget)\b/.test(t))
    return withMood('sorry', `${opener}Please message our team on WhatsApp with your invoice number and a short description or video of the problem. Every MacBook is covered by its warranty and the 5-year service plan, and the team will make it right as quickly as possible. [[handoff]]`);

  // ── Follow-ups that build on the last stock question ──
  const prevUser = [...messages].slice(0, -1).reverse().find((m) => m.role === 'user');
  let ask = entities(t);
  const prevAsk = prevUser ? entities(normalize(prevUser.content)) : {};
  const followUp = prevUser && Object.keys(prevAsk).length > 0;
  if (followUp && /\b(cheaper|less expensive|lower price|anything less|lower budget)\b/.test(t)) {
    const shown = match(prevAsk, units ?? []);
    ask = { ...prevAsk, ...ask, max: shown.length ? shown[0].price - 1 : prevAsk.max, order: 'low' };
  } else if (followUp && /\b(bigger|larger) screen\b/.test(t)) ask = { ...prevAsk, size: 16 };
  else if (followUp && /\b(more power|faster|more powerful|better one)\b/.test(t)) ask = { ...prevAsk, order: 'high', max: undefined };
  else if (followUp && Object.keys(ask).length && /^(and|what about|how about|any|also|in|with|only|then)\b/.test(t)) ask = { ...prevAsk, ...ask };
  const filters = Object.keys(ask).length > 0;

  // ── Topics ──
  if (has(t, 'delivery', 'emi', 'exchange') || /\b(payment|pay|upi|card|cash)\b/.test(t)) {
    const f = faqReply(t, faqs);
    if (f) return withMood('neutral', `${opener}${f}${has(t, 'exchange') ? ' [[handoff]]' : ''}`);
  }
  if (/\b(live photos?|battery report|book|reserve|hold|final price|negotiat|discount|best price|last price)\b/.test(t))
    return withMood('happy', `${opener}Our team sends live photos and the battery report, confirms the final price and can hold a unit for you on WhatsApp. Share the model you liked on the site. [[handoff]]`);
  if (/\b(bulk|quote|corporate|company|team|startup|business|gst)\b/.test(t) && !has(t, 'hours'))
    return withMood('happy', `${opener}We supply teams with bulk pricing, flexible payment terms and one point of contact. Companies like Codel Private Limited and Catafluence buy from us. Send the number of units, a budget and your timeline, and we reply with a quote. [[link:/b2b|Business orders]] [[handoff]]`);
  if (mood === 'worried' || /\b(reviews?|rating|trusted|why (should|buy)|why you)\b/.test(t)) return trustReply(reviews, opener);
  if (has(t, 'hours') || (/\b(sunday|saturday|today|now|tomorrow)\b/.test(t) && /\b(open|hours|come|visit)\b/.test(t))) return hoursReply();
  if (has(t, 'location') || /\b(visit|come to (your|the) (shop|store))\b/.test(t)) return locationReply();
  if (/\b(contact|phone|number|call|whatsapp|email|mail|talk to (a )?(human|person|someone))\b/.test(t)) return contactReply();
  if (/\b(inspection|inspect|check|checks|tested|testing|diagnos)\w*/.test(t) && !filters)
    return withMood('neutral', `Every MacBook goes through a documented 100+ point inspection across 13 areas: ${INSPECTION.join(', ')}. Units with Activation Lock, MDM, Find My still on, a cracked screen or liquid damage are rejected outright. [[link:/why-cpo|See every check]]`);
  if (/\bbattery\b/.test(t) && !filters) {
    const f = faqReply('battery health before buying', faqs);
    if (f) return withMood('neutral', f + ' Battery percentages are also shown on each listing. [[link:/products|See all MacBooks]]');
  }
  if ((/\b(grade|grades|grading|condition|certified|pristine|difference|cpo)\b/.test(t) || (has(t, 'refurbished') && /\b(mean|what|is it|difference|reliable)\b/.test(t))) && !ask.max && !ask.use && !ask.chip) {
    if (/\breliable|daily use\b/.test(t)) { const f = faqReply(t, faqs); if (f) return withMood('neutral', f); }
    return gradesReply(t);
  }
  if (has(t, 'warranty') || /\b(service plan|repair|claim)\b/.test(t)) {
    const f = faqReply(t, faqs);
    return f && /\b(claim|cover|transfer|extend|parts|upgrade)\b/.test(t) ? withMood('neutral', f) : warrantyReply();
  }
  if (/\b(environment|planet|e.?waste|eco|sustainab)\w*/.test(t))
    return withMood('happy', `Buying pre-owned means one fewer laptop built and one fewer thrown away. So far: ${SITE_CONFIG.impact.map((i) => `${i.value} ${i.label}`).join('; ')}.`);

  if (mood === 'unsure' && !filters)
    return withMood('thinking', `${opener}Two quick questions: what is your budget, and what will you mainly use it for (college, coding, video editing or everyday work)? Then I will suggest the best match from our stock.`);
  const faq = faqReply(t, faqs);
  if (faq && !filters) return withMood('neutral', `${opener}${faq}`);
  if (filters || /\b(available|availability|stock|in stock|price|prices|cost|cheap|cheapest|budget|recommend|suggest|options?|models?|buy|best|latest|show|list|macbook|air|pro)\b/.test(t))
    return stockReply(ask, units, opener);
  if (faq) return withMood('neutral', faq);

  return withMood('thinking', `${opener}I do not have a confident answer to that, and I would rather not guess. Our team can answer it directly on WhatsApp at ${SITE_CONFIG.social.phone}. [[handoff]]`);
}
