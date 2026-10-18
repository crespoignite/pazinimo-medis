/* Pažinimo medis — blog articles API.
   Serves this site's live blog posts straight from Airtable (Pažinimo
   Medis "Content Engine" base, records where "Optimized for" = "Wordpress"
   and "Posted?" is checked).

   Nothing is hardcoded here and there are no seed posts: this function is
   the entire content source for /blog. Publishing a new post is a single
   step in Airtable (check "Posted?" on a Wordpress-optimized record, or
   run the "Publish generated content" script) — no file changes, no
   redeploys, ever.

   Requires an environment variable set in Netlify (Project configuration
   → Environment variables), NOT committed to the repo:

     AIRTABLE_API_KEY = a Personal Access Token, scoped read-only to the
                         "Content Engine" base (appNDEUYlafUhi2Y9).
*/

const AIRTABLE_BASE = 'appNDEUYlafUhi2Y9';
const AIRTABLE_TABLE = 'tbl9Ps8bJ62sNL4no';

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
    .slice(0, 80) || 'post';
}

function stripMarkdown(str) {
  return String(str)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFrom(markdown, maxLen = 160) {
  const plain = stripMarkdown(markdown);
  if (plain.length <= maxLen) return plain;
  const cut = plain.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 0 ? lastSpace : maxLen).trim() + '…';
}

function readingTimeFrom(markdown) {
  const words = stripMarkdown(markdown).split(' ').filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

async function fetchPosts() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    console.warn('AIRTABLE_API_KEY not set — returning no posts.');
    return [];
  }

  const posts = [];
  let offset;

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`);
    url.searchParams.set(
      'filterByFormula',
      "AND({Optimized for}='Wordpress', {Posted?}=1)"
    );
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!res.ok) {
      console.error('Airtable request failed:', res.status, await res.text());
      break;
    }

    const data = await res.json();

    for (const record of data.records || []) {
      const f = record.fields || {};
      const title = f['Title for Post'] || 'Untitled';
      const body = f['Content for Post'] || '';
      const image = Array.isArray(f['Image File']) && f['Image File'][0]
        ? f['Image File'][0].url
        : null;

      posts.push({
        slug: `${slugify(title)}-${record.id.slice(-6).toLowerCase()}`,
        title,
        category: f['Angle'] || 'Insights',
        excerpt: excerptFrom(body),
        author: 'Pažinimo medis',
        date: (record.createdTime || '').slice(0, 10),
        readingTime: readingTimeFrom(body),
        coverImage: image,
        body // raw markdown string — rendered client-side
      });
    }

    offset = data.offset;
  } while (offset);

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

exports.handler = async () => {
  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60'
    },
    body: JSON.stringify(posts)
  };
};
