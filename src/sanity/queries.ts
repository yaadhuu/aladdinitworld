// Every query has a limit and asks only for the fields the page shows.
const PHOTO = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

// "Other (type it)" in the Studio stores the list value as 0 or "other", and the typed value in a second field
const BASE = `_id, _createdAt, model, year, grade, battery, cosmetic, price, originalPrice, headline, status, featured,
  "screen": select(screen == 0 => screenOther, screen),
  "chip": select(chip == "other" => chipOther, chip),
  "ram": select(ram == 0 => ramOther, ram),
  "storage": select(storage == "other" => storageOther, storage)`;
// Cards and lists: one photo only
const CARD = `${BASE}, "photos": photos[0...1]${PHOTO}`;

// On the shelf: available or reserved, and complete enough to show
const LIVE = `_type == "unit" && !(_id in path("drafts.**")) && status in ["available", "reserved"] && defined(price) && defined(grade) && count(photos) > 0`;

export const LIMIT_LIST = 60;
export const LIMIT_FEATURED = 6;
export const LIMIT_SLUGS = 200;

export const Q_LIST = `*[${LIVE}] | order(_createdAt desc)[0...${LIMIT_LIST}]{ ${CARD} }`;
export const Q_COUNT = `count(*[${LIVE}])`;
export const Q_FEATURED = `*[${LIVE} && featured == true && status == "available"] | order(_createdAt desc)[0...${LIMIT_FEATURED}]{ ${CARD} }`;
// $pattern is "*" plus the 8-character unit id from the URL
export const Q_ONE = `*[${LIVE} && _id match $pattern][0]{ ${BASE}, included, description, "photos": photos[0...12]${PHOTO} }`;
export const Q_SLUGS = `*[${LIVE}] | order(_createdAt desc)[0...${LIMIT_SLUGS}]{ _id, _updatedAt, model, screen, chip, ram, storage }`;

export const LIMIT_FAQ = 60;
// Position 1 first; no position goes last
export const Q_FAQ = `*[_type == "faq" && !(_id in path("drafts.**")) && defined(question) && defined(answer)] | order(coalesce(position, 9999) asc, _createdAt asc)[0...${LIMIT_FAQ}]{ question, answer }`;

export const LIMIT_REVIEWS = 40;
export const Q_REVIEWS = `*[_type == "review" && !(_id in path("drafts.**")) && defined(name) && defined(text)] | order(coalesce(position, 9999) asc, _createdAt desc)[0...${LIMIT_REVIEWS}]{ name, role, source, rating, text }`;
