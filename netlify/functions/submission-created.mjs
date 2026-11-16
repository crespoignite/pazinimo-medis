// Pushes every verified Netlify form submission into Pipedrive.
//
// Netlify invokes this function automatically on the "submission-created"
// event, once per confirmed (non-spam) submission from the Ask and Book
// forms. No front-end change is needed: the branded forms keep posting to
// Netlify Forms, and this runs behind them.
//
// For each submission it creates a Person (API v2) and a Lead (API v1),
// then attaches a Note (API v1) holding the full context: stage, city,
// child, preferred visit day and time, the message, the source form and
// every UTM value. Pipedrive has no v2 Leads or Notes endpoint yet, so
// those stay on v1, which remains supported.
//
// Required Netlify environment variable (Site settings -> Environment):
//   PIPEDRIVE_API_TOKEN  the personal API token
// Optional:
//   PIPEDRIVE_DOMAIN     company subdomain (e.g. "pazinimomedis"). The
//                        generic api.pipedrive.com host is used if unset.
//   LEAD_OWNER_ID        numeric user id to own each lead (otherwise the
//                        token's own user)

const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const DOMAIN = process.env.PIPEDRIVE_DOMAIN;
const OWNER_ID = process.env.LEAD_OWNER_ID;
const HOST = DOMAIN ? `${DOMAIN}.pipedrive.com` : 'api.pipedrive.com';

// Ask form.
const STAGE = { kindergarten: 'Kindergarten', school: 'School', unsure: 'Not sure yet' };
const CITY = { vilnius: 'Vilnius', kaunas: 'Kaunas' };
// Book form (matches the Pipedrive registration form).
const LEVEL = {
  ikimokyklinis: 'Preschool (kindergarten)',
  priesmokyklinis: 'Pre-primary (year 0)',
  pradinis: 'Primary (years 1-4)',
  progimnazinis: 'Pre-gymnasium (years 5-8)',
  gimnazinis: 'Gymnasium (years 9-12)',
};
const BRANCH = {
  kalinausko: 'Kalinausko g. 13, Vilnius',
  ozo: 'Ozo g. 37, Vilnius',
  pievu: 'Pievų g. 4, Vilnius',
  vilties: 'Vilties g. 2, Kaunas',
};
const MEETING = { in_person: 'In person', remote: 'Remote' };

function base(version) {
  return `https://${HOST}/api/${version}`;
}

async function pd(version, path, body) {
  const url = `${base(version)}${path}?api_token=${encodeURIComponent(TOKEN)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const detail = json.error || json.message || `HTTP ${res.status}`;
    throw new Error(`Pipedrive ${version} POST ${path} failed: ${detail}`);
  }
  return json.data;
}

export default async (req) => {
  if (!TOKEN) {
    console.error('Missing PIPEDRIVE_API_TOKEN');
    return new Response('Pipedrive not configured', { status: 500 });
  }

  let data = {};
  try {
    const event = await req.json();
    data = event?.payload?.data || {};
  } catch {
    return new Response('Bad payload', { status: 400 });
  }

  const kind = data['form-name'] || data.source || 'enquiry';
  const name = (data.name || '').trim() || 'Website enquiry';
  const isBooking = kind === 'book';
  // Maps a comma-separated value (checkbox groups can hold several) to labels.
  const mapList = (raw, dict) => (raw || '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => dict[s] || s).join(', ');
  // Ask uses city + kindergarten/school stage; Book uses campus + education stage.
  const placeLabel = isBooking
    ? mapList(data.campus, BRANCH)
    : (CITY[data.city] || data.city || '');
  const stageLabel = isBooking
    ? (LEVEL[data.stage] || data.stage || '')
    : (STAGE[data.stage] || data.stage || '');

  try {
    // 1. Person (API v2 — emails and phones are arrays of objects here)
    const person = await pd('v2', '/persons', {
      name,
      emails: data.email ? [{ value: data.email, primary: true, label: 'home' }] : [],
      phones: data.phone ? [{ value: data.phone, primary: true, label: 'mobile' }] : [],
    });

    // 2. Lead
    const title = isBooking
      ? `Visit booking - ${name}${placeLabel ? ` (${placeLabel})` : ''}`
      : `Website enquiry - ${name}${placeLabel ? ` (${placeLabel})` : ''}`;
    const lead = await pd('v1', '/leads', {
      title,
      person_id: person.id,
      ...(OWNER_ID ? { owner_id: Number(OWNER_ID) } : {}),
    });

    // 3. Note with the full context
    const lines = [
      `Form: ${isBooking ? 'Book a visit' : 'Ask a question'} (${kind})`,
      isBooking && data.school_year && `School year: ${data.school_year}`,
      stageLabel && `${isBooking ? 'Education stage' : 'Stage'}: ${stageLabel}`,
      placeLabel && `${isBooking ? 'Campus' : 'City'}: ${placeLabel}`,
      isBooking && data.meeting && `Meeting: ${MEETING[data.meeting] || data.meeting}`,
      isBooking && data.contact_time && `Best time to reach: ${data.contact_time}`,
      !isBooking && data.child && `Child's age/grade: ${data.child}`,
      data.message && `Message: ${data.message}`,
      data.faq_topic && `FAQ topic: ${data.faq_topic}`,
      '',
      `Language: ${data.lang || ''}`,
      `Page: ${data.page || ''}`,
      data.ab_variant && `A/B variant: ${data.ab_variant}`,
      'Source:',
      `  utm_source: ${data.utm_source || '(none)'}`,
      `  utm_medium: ${data.utm_medium || '(none)'}`,
      `  utm_campaign: ${data.utm_campaign || '(none)'}`,
      `  utm_content: ${data.utm_content || '(none)'}`,
      `  utm_term: ${data.utm_term || '(none)'}`,
    ].filter((l) => l !== undefined && l !== false && l !== null);

    await pd('v1', '/notes', {
      content: lines.join('\n'),
      lead_id: lead.id,
    });

    console.log(`Pipedrive: created person ${person.id} and lead ${lead.id} (${kind})`);
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error(err.message);
    // 502 so the failure is visible in Netlify's function logs; the
    // submission itself is still safely stored in Netlify Forms.
    return new Response('Pipedrive sync failed', { status: 502 });
  }
};
