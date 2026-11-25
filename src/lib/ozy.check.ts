// Run: npx tsx src/lib/ozy.check.ts  (prints Ozy's replies to sample messages and asserts the key ones)
import assert from 'node:assert';
import { ozyReply } from './ozy';
import { SITE_CONFIG, type Unit } from '@/config';

const u = (o: Partial<Unit>): Unit => ({ id: 'abcd1234', model: 'MacBook Pro', screen: 14, chip: 'Apple M1 Pro', ram: 16, storage: '512GB', year: 2021, grade: 'certified', battery: 90, cosmetic: null, included: [], price: 74999, headline: null, originalPrice: null, status: 'available', photos: [], description: '', createdAt: '', ...o });
const units = [u({}), u({ id: 'b', model: 'MacBook Air', screen: 13, chip: 'Apple M2', ram: 8, storage: '256GB', price: 48999, grade: 'pristine' }), u({ id: 'c', chip: 'Intel Core i7', screen: 16, price: 41999, grade: 'refurb' })];
const faqs = SITE_CONFIG.faqItems;
const reviews = SITE_CONFIG.customerReviews;
const say = (...turns: string[]) => ozyReply(turns.map((c, i) => ({ role: i % 2 ? 'assistant' as const : 'user' as const, content: c })), units, faqs, reviews);

const samples = ['hi', 'good morning', 'how are you', 'my name is arjun', 'macbook under 50k', 'any m1 pro?', 'best macbook for video editing',
  'i am a college student, budget 50000', 'what is the difference between certified and pristine', 'whats the warenty', 'do you offer emi',
  'where is your shop', 'are you open on sunday', 'is it genuine? i am worried about buying used', 'my macbook stopped working!!', 'can i exchange my old laptop',
  'bulk order for my company', 'what do you check in inspection', 'thanks', 'tell me a joke', 'phone number please', 'i am confused which one to buy'];
for (const q of samples) console.log(`> ${q}\n${say(q)}\n`);

assert.match(say('macbook under 50k'), /2 MacBooks/);
assert.doesNotMatch(say('macbook under 50k'), /74,999/);
assert.match(say('macbook under 50k', 'x', 'and 16 inch?'), /Intel i7 16/);
assert.match(say('any m1 pro?', 'x', 'anything cheaper?'), /48,999|41,999/);
assert.match(say('whats the warenty'), /base warranty/);
assert.match(say('my macbook stopped working!!'), /mood:sorry/);
assert.match(say('is it genuine? i am worried'), /Google reviews/);
assert.match(say('phone number please'), /WhatsApp on/);
assert.match(say('my name is arjun', 'x', 'thanks'), /Arjun/);
assert.match(say('best macbook for video editing'), /M1 Pro/);
console.log('checks pass');
