import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

  let email = '';
  let kvkk = false;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await request.json();
      email = (body.email || '').trim();
      kvkk = !!body.kvkk;
    } else {
      const form = await request.formData();
      email = ((form.get('email') as string) || '').trim();
      kvkk = !!form.get('kvkk');
    }
  } catch {
    return json(400, { ok: false, message: 'Geçersiz istek.' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, message: 'Geçerli bir e-posta girin.' });
  }

  if (!apiKey || !audienceId) {
    console.warn('[subscribe] RESEND_API_KEY veya RESEND_AUDIENCE_ID tanımlı değil — e-posta kaydedilmedi:', email);
    return json(200, { ok: true, message: 'Teşekkürler. (dev: kayıt simüle edildi)' });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.contacts.create({ email, audienceId, unsubscribed: false });
    return json(200, { ok: true, message: 'Teşekkürler, abonelik aktif.' });
  } catch (err) {
    console.error('[subscribe] Resend error:', err);
    return json(502, { ok: false, message: 'Abonelik kaydedilemedi. Lütfen tekrar deneyin.' });
  }
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
