# DijitA Tanıtım Sitesi — `dijitapro.com.tr`

Astro tabanlı tanıtım sitesi. Kaynak tasarım sistemi:
`../dijita-design-system/` (Claude Design handoff bundle).

## Stack

- **Framework:** Astro 4 (hybrid) + Vercel serverless adapter
- **Styling:** Saf CSS tokenları (`src/styles/colors.css` + `src/styles/site.css`)
- **Icons:** Lucide (CDN)
- **Forms:** Resend (newsletter + contact)
- **Deploy:** Vercel + GitHub
- **Tasarım kaynağı:** Claude Design handoff — cyan `#00A0FF` + navy `#002058`, Inter + JetBrains Mono

## Development

```bash
npm install
npm run dev
# → http://localhost:4321
```

## Build

```bash
npm run build
npm run preview
```

## Environment variables

`.env.local` (development) veya Vercel dashboard (production):

| Değişken | Açıklama | Zorunlu |
|---|---|---|
| `RESEND_API_KEY` | Resend API anahtarı | Prod |
| `RESEND_AUDIENCE_ID` | Newsletter aboneleri için Resend audience ID | Newsletter için |
| `CONTACT_TO_EMAIL` | Demo talepleri bu adrese düşer | Varsayılan: `iletisim@dijitapro.com.tr` |
| `CONTACT_FROM_EMAIL` | Gönderici adresi | Varsayılan: `DijitAs <noreply@dijitapro.com.tr>` |

Env değişkenleri tanımlı değilse form'lar dev modunda simüle edilir (console.warn + 200 OK).

## Sayfalar

| Rota | Dosya |
|---|---|
| `/` | `src/pages/index.astro` |
| `/urun` | `src/pages/urun.astro` |
| `/skills` | `src/pages/skills.astro` |
| `/fiyat` | `src/pages/fiyat.astro` |
| `/case-studies` | `src/pages/case-studies.astro` |
| `/blog` | `src/pages/blog.astro` |
| `/hakkimizda` | `src/pages/hakkimizda.astro` |
| `/kvkk-guvenlik` | `src/pages/kvkk-guvenlik.astro` |
| `/iletisim` | `src/pages/iletisim.astro` |

## API rotaları

| Endpoint | Dosya | Amaç |
|---|---|---|
| `POST /api/subscribe` | `src/pages/api/subscribe.ts` | Newsletter aboneliği (Resend audience) |
| `POST /api/contact` | `src/pages/api/contact.ts` | Demo talep formu (Resend email) |

## Tasarım tokenları

`src/styles/colors.css` — renk paleti, tipografi ölçeği, spacing, radii, shadows, motion. Logodan örneklenmiş cyan + navy. Google Fonts: Inter + JetBrains Mono.

`src/styles/site.css` — nav, footer, buttons, section scaffolding, hero, KVKK strip, newsletter, page-header, prose. Token'ları kullanır.

Tasarımı değiştirmek için önce `colors.css` token'ını güncelle; bileşen CSS'leri otomatik uyar.

## Deploy

```bash
git push origin main   # Vercel otomatik production deploy
```

Preview deploy'lar PR açıldığında otomatik. Domain `dijitapro.com.tr` mevcut Vercel projesine bağlı; repo bağlantısı bu repo'ya geçirildiğinde yayına alınır.
