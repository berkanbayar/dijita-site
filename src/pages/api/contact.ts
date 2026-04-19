import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

interface ContactPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  size: string;
  parasut: string;
  plan: string;
  pain: string;
  kvkk: boolean;
  _honey: string;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL || 'iletisim@dijitapro.com.tr';
  const fromEmail = import.meta.env.CONTACT_FROM_EMAIL || 'DijitAs <noreply@dijitapro.com.tr>';

  let data: Partial<ContactPayload> = {};
  try {
    const form = await request.formData();
    data = {
      name: str(form.get('name')),
      company: str(form.get('company')),
      email: str(form.get('email')),
      phone: str(form.get('phone')),
      size: str(form.get('size')),
      parasut: str(form.get('parasut')),
      plan: str(form.get('plan')),
      pain: str(form.get('pain')),
      kvkk: !!form.get('kvkk'),
      _honey: str(form.get('_honey'))
    };
  } catch {
    return json(400, { ok: false, message: 'Geçersiz istek.' });
  }

  if (data._honey) {
    return json(200, { ok: true, message: 'Alındı.' });
  }

  if (!data.name || !data.company || !data.email) {
    return json(400, { ok: false, message: 'Ad, şirket ve e-posta zorunludur.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return json(400, { ok: false, message: 'Geçerli bir e-posta girin.' });
  }
  if (!data.kvkk) {
    return json(400, { ok: false, message: 'Devam etmek için KVKK onayı gereklidir.' });
  }

  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY yok — demo talebi simüle edildi:', data);
    return json(200, { ok: true, message: 'Teşekkürler. (dev: form simüle edildi)' });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `Demo talebi · ${data.company} · ${data.name}`,
      html: renderEmail(data as ContactPayload)
    });
    return json(200, { ok: true, message: 'Teşekkürler. 24 saat içinde dönüş yapacağız.' });
  } catch (err) {
    console.error('[contact] Resend error:', err);
    return json(502, { ok: false, message: 'Form gönderilemedi. Lütfen tekrar deneyin.' });
  }
};

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function renderEmail(d: ContactPayload): string {
  return `<h2>Yeni demo talebi</h2>
<p><b>${esc(d.name)}</b> · ${esc(d.company)}</p>
<ul>
  <li>E-posta: ${esc(d.email)}</li>
  <li>Telefon: ${esc(d.phone || '—')}</li>
  <li>Çalışan: ${esc(d.size)}</li>
  <li>Paraşüt: ${esc(d.parasut)}</li>
  <li>İlgilendiği paket: ${esc(d.plan)}</li>
</ul>
<h3>En çok yorulduğu iş</h3>
<p>${esc(d.pain || '—').replace(/\n/g, '<br>')}</p>
<p><small>dijitapro.com.tr form · ${new Date().toISOString()}</small></p>`;
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
