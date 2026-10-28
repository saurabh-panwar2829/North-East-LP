# Doon Global School — North East admissions

A responsive Next.js 16 + React + TypeScript + Tailwind CSS 4 landing page for families in Siliguri, North Bengal, Sikkim and North East India. The design follows the supplied campaign references: forest green, ivory, gold, editorial typography and a cinematic hero.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. On Windows, `npm.cmd` avoids PowerShell execution-policy issues. On other platforms, use `npm`.

## Production

```powershell
npm.cmd run build
npm.cmd start
```

Deploy to a Next.js-compatible Node host such as Vercel. This project includes a server endpoint and should not be deployed as a static export. Set `NEXT_PUBLIC_SITE_URL` to the final public URL before the production build.

## Admissions enquiries

The enquiry dialog uses a forest-green school visual beside an ivory form on desktop, and a compact brand banner on phones. It includes labelled fields, selectable interest cards, visible validation errors, a sticky close control and separate sent/email-draft states. The existing North East student campaign illustration is reused. Previews: `artifacts/enquiry-desktop.png`, `artifacts/mobile-form.png`, `artifacts/enquiry-errors.png` and `artifacts/enquiry-ready.png`.

The form opens in an accessible dialog from the hero, boarding, final admissions or mobile navigation buttons. It validates details in the browser and on the server, requires contact consent and includes a honeypot. No enquiry is saved in browser storage.

**Default behavior:** the form prepares an email addressed to `admissions@doonglobalschool.edu.in`. The parent must click **Open email & send**, review the draft, and send it from their email application. The interface explicitly states that this draft has not been sent. The application never claims a callback was booked just because a form was filled out.

**Direct delivery:** copy `.env.example` to `.env.local` and configure a trusted admissions CRM or automation endpoint:

```dotenv
ADMISSIONS_WEBHOOK_URL=https://your-admissions-service.example/enquiries
ADMISSIONS_WEBHOOK_TOKEN=your-server-side-token
NEXT_PUBLIC_SITE_URL=https://your-landing-page.example
```

The server sends a JSON POST with `name`, `phone` (10 digits), `grade`, `region`, `city`, `interest`, `consent`, `session`, `source` and `submittedAt`. A token, if supplied, is sent in the `Authorization: Bearer` header. The webhook must return a successful HTTP status only after accepting the enquiry. Errors preserve the form and show a retry/call option. Secrets are never exposed to the browser. There is no built-in CRM or database.

Before connecting a public campaign, use the receiving CRM’s deduplication, spam controls and retention settings. Confirm the school’s current contact details, fees and admissions arrangements.

## Project map

- `src/app/page.tsx`: landing-page composition and admissions/privacy dialogs.
- `src/app/globals.css`: Tailwind import and theme tokens only; no custom selectors or component rules.
- `postcss.config.mjs`: official Tailwind PostCSS integration.
- `src/app/layout.tsx`: locally hosted fonts through `next/font/local`, Tailwind typography defaults and shared interaction utilities.
- `src/components/admissions-form.tsx`: responsive two-column enquiry design, validation and delivery states.
- `src/components/campus-hero.tsx`: bright campus hero, EducationWorld rankings, verified school facts and admissions entry point.
- `src/components/site-header.tsx`: transparent overlay header, section navigation, mobile menu and admissions button; a compact light surface appears on scroll.
- `src/components/school-life-section.tsx`: six-card school-life gallery, responsive layout and expandable activity details.
- `src/components/north-east-benefits.tsx`: North East family benefits, boarding eligibility and an admissions entry point.
- `src/components/site-footer.tsx`: forest-green admissions footer, contact details, section links and privacy entry point.
- `src/components/faq-section.tsx`: numbered question cards, animated single-open accordion and admissions guidance panel, styled entirely with Tailwind.
- `src/components/site-motion.tsx`: progressive scroll reveals, browser-native entrance animations and reading progress.
- `src/components/partners-section.tsx`: reference-inspired sports banner, circular partner logos and accessible programme details.
- `src/lib/enquiry.ts`: shared validation and email preparation.
- `src/app/api/enquiry/route.ts`: server validation and optional webhook delivery.
- `public/images`: supplied-school imagery, partner logos and generated campaign visuals.
- `public/images/life-at-dgs`: six optimized WebP school-life images featuring fictional North East Indian students.
- `docs/life-at-dgs-images.md`: full generation prompts and asset provenance for the school-life section.
- `artifacts`: desktop and mobile preview screenshots.

All layout, responsive, hover, focus and form-state styling uses Tailwind utility classes. Component-local `ui` objects group static class strings so Tailwind can discover them at build time. The `dgs-*` class names are only DOM hooks for descendant variants and motion, with no separate CSS rules. Shared theme tokens live in `globals.css`; fonts are loaded by Next.js. There are no CSS modules, custom keyframe stylesheets, `@apply` component rules or runtime CSS-in-JS. Installation follows the [Tailwind Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

## Checks

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
# With the local server running:
npm.cmd run test:browser
```

The browser check uses installed Google Chrome on Windows; change `executablePath` in `scripts/check-browser.mjs` for another machine. It checks responsive overflow at 360, 390, 768, 1024 and 1440px, image loading, validation, email preparation, keyboard-accessible programme tabs, FAQs, privacy dismissal and mobile navigation. It sends synthetic enquiries only to the local server; run with `ADMISSIONS_WEBHOOK_URL` unset to avoid transmitting test data to a live CRM.

## Footer and motion

The compact forest-green footer uses a small admissions strip above three columns for school identity and contact details, navigation, and the campus address. The oversized decorative wordmark and repeated marketing copy have been removed; mobile groups the logo and contact details into one row. Callback and campus-visit buttons open the existing enquiry dialog. The previous separate final CTA has been folded into this footer.

Sections reveal once using IntersectionObserver and Tailwind data-attribute variants, with short staggered timing for related cards. The browser's Web Animations API handles hero, menu, details and dialog entrances. A requestAnimationFrame-throttled scroll handler updates the reading-progress line. Hover treatments use Tailwind utilities. There is no animation library or scroll hijacking. Content is visible without JavaScript; reduced-motion preferences disable the reveals and progress line. Keyboard focus reveals pending content and cancels any entrance animation hiding the focused control. The browser check exercises these fallbacks alongside footer actions and mobile navigation.

Footer previews: `artifacts/footer-desktop.png` and `artifacts/footer-mobile.png`.

The FAQ section pairs ivory question cards with a forest-green admissions help panel. Answers open and close with a Tailwind grid transition; collapsed answers are inert and hidden from assistive technology. Buttons support Enter/Space, Up/Down and Home/End navigation, and the help button opens the existing enquiry dialog. Reduced motion disables transitions. The original questions and verified answers are retained. Previews: `artifacts/faq-desktop.png` and `artifacts/faq-mobile.png`.

## Content and image provenance

School information was checked against the official website on 28 October 2026:

- [School overview, rankings and contact information](https://doonglobalschool.edu.in/)
- [Boarding eligibility and fee inclusions](https://doonglobalschool.edu.in/boarding-school-in-dehradun/)
- [Named programmes and partner organisations](https://doonglobalschool.edu.in/programmes/)
- [School infrastructure](https://doonglobalschool.edu.in/infrastructure/)
- [Activities and development](https://doonglobalschool.edu.in/holistic-development/)

Boarding is presented as **boys, Classes 3–12**. Books and uniforms are not presented as free. Programme availability and any charges must be confirmed by class and session. The reference images’ unverified campus-size and alumni figures are not used.

Official photographs and logos are saved locally from the school’s public website; exact source paths are recorded in `scripts/download-assets.mjs`. They remain the property of their respective owners. The hero is an illustrative campaign image, clearly identified in its alt text and the page footer, rather than a photograph of the actual campus. The campus section uses the school’s real building photo.

The original student hero was created with the **built-in image generation tool**, and remains archived at `public/images/hero.png`. Its original generation prompt:

> Use case: ads-marketing. Asset type: photographic background for a premium Indian boarding-school admissions landing page. Create a cinematic, natural-looking landscape photo, 16:9 wide composition, no text or graphic overlays. A joyful Indian teenage schoolboy about 15 in a deep forest green blazer with subtle small gold crest, white shirt, green gold striped tie and backpack occupies center-right, from waist upwards, looking slightly upwards to the left with optimism. Background a warm cream school building with green trim surrounded by lush trees in Dehradun foothills, distant mountains, golden morning sunlight from the upper right. The entire left 45% is dark forest foliage with atmospheric space for website headline overlay. Far right greenery softly blurred for a form overlay. Rich dark green, cinematic gold rimlight, realistic skin, natural fabric, editorial school campaign photography. No logos, no words, no watermark, no UI, no collage. Inspired by the user's attached Doon Global School campaign mood but create a single original full-bleed photo.

Fonts are locally hosted; see the SIL Open Font License files in `public/fonts`. No external font requests, advertising scripts or analytics are included.

## Current campus hero

The current hero uses `public/images/hero-campus.png`, restored with its original desktop, tablet and mobile framing. It retains the ivory fade, rankings, transparent header and smooth entrance animations. The alternative misty-campus edit remains archived at `public/images/hero-campus-misty.png` and `public/images/hero-campus-misty.webp`, with its [edit prompt](docs/misty-hero-image.md).

The latest hero follows the supplied bright campus-and-rankings reference: an ivory fade, green headline, gold laurels and terracotta ranking numbers. The school’s verified #3 Dehradun / #4 Uttarakhand EducationWorld 2026–27 rankings are retained. The reference’s unverified 200 boarders, 8-acre and 5000+ alumni claims are not used. Admissions buttons open the existing form in a native accessible dialog.

Hero text uses a subtle staggered reveal on initial load, with no looping animation. It uses CSS only and renders immediately when reduced motion is requested. The fixed header overlays the hero image transparently at the top. After 64px of scrolling, it smoothly becomes a compact light header; returning to the top restores transparency. Opening the mobile menu also provides a solid background for readability. Header transitions respect reduced motion, and active section links, admissions buttons and keyboard navigation remain available.

The current illustrative background was created with the **built-in image generation tool** and is saved at `public/images/hero-campus.png`. The actual campus photograph remains in the Why DGS section. Generation prompt:

> Use case: ads-marketing. Asset type: wide premium school admissions website hero background, single cinematic photographic illustration, 16:9 landscape. An aspirational Indian boarding school campus in the Dehradun foothills on a beautiful clear morning. The RIGHT 60 percent features a handsome warm-cream two-storey school building with deep forest-green trim, open verandas, a green pitched entrance pavilion and a modest tower; a small architectural green sign on the building reads exactly 'DOON GLOBAL SCHOOL' in stacked white letters with a small gold sun emblem. Dense landscaped gardens, palms, yellow flowers and manicured green lawn surround a walkway. Small groups of teenage Indian students in formal white shirts, dark trousers and forest-green blazers walk toward the entrance naturally, as secondary subjects. Blue Himalayan foothills and soft white clouds behind the school. Sunlit green leaves frame the upper right and lower right corners. The LEFT 40 percent is airy pale ivory morning mist, very soft distant sky and blurred garden, empty of main buildings or people, to support dark green website headline, red-brown ranking numbers and gold laurel graphics that will be rendered separately in HTML. Bright and inviting, elegant, realistic warm sunlight, subtle atmospheric depth, crisp architectural detail on the right. The building is the focal point, not an individual student. No UI, no overlaid titles, no ranking numbers, no badges, no collage, no watermark. Keep the right campus fully visible, with enough foreground for students and garden. The left is pale and calm, not dark.

## School-life gallery

The “A School Day with Room for More” section follows the supplied reference: an ivory introduction on the left and a three-column, two-row photo gallery on the right. Cards cover Academics, Sports, Creativity, Leadership, Life Skills and Boarding Life, with green title strips and expandable details. On phones the gallery uses two columns. “Explore Life at DGS” moves to the programmes section.

All six images were created with the **built-in image generation tool** to represent fictional North East Indian students. The optimized assets are saved in `public/images/life-at-dgs/`, with complete final prompts in [the image generation record](docs/life-at-dgs-images.md). They are identified as illustrative in alt text and the footer. Preview screenshots: `artifacts/school-life-desktop.png` and `artifacts/school-life-mobile.png`.

## North East family benefits

The former boarding quote section is now “North East roots. Brighter horizons.” It presents four benefits for families considering DGS: CBSE learning, wider interests, friendships and everyday independence. An ivory layout, serif headings, sage accents and a forest-green admissions strip match the rest of the page. The North East student common-room illustration is reused from the school-life gallery; it is not a documentary photograph. The admissions button opens the existing enquiry dialog, and the `#boarding` anchor is retained for navigation. No region-specific discounts, travel services or other unverified concessions are promised.

Screenshots: `artifacts/north-east-benefits-desktop.png` and `artifacts/north-east-benefits-mobile.png`.

## Partners section campaign visual

The partners section follows the supplied football-banner reference, with a fixed Doon Global logo at the centre of a circular programme orbit. Five equally spaced partner badges rotate once every 40 seconds using Tailwind’s built-in spin animation; matching reverse rotations keep the logos upright. Hover or keyboard focus pauses the orbit, and a pause/resume button provides manual control. Animation pauses off-screen and is disabled with reduced motion or without JavaScript. Programme clicks and keyboard navigation still open the existing detail panel. All styling uses Tailwind utilities, with no custom animation stylesheet. The illustrative photographic background was generated using the **built-in image generation tool** and saved at `public/images/partners-football.png`. The page footer and image alt text identify it as illustrative. Screenshots are saved at `artifacts/partners-desktop.png` and `artifacts/partners-mobile.png`.

Final generation prompt:

> Use case: ads-marketing. Asset type: a clean photographic background for a premium Indian school partners website banner. Create a very wide panoramic image in a 3:1 aspect ratio. On the far right, occupying only the rightmost 24 percent of the composition, show a full-body Indian schoolboy about 13 years old with neatly tousled black hair, playing football, looking down at a black-and-white football by his feet. He wears a dark navy and deep forest green school sports jersey with thin gold piping, dark navy shorts, long navy socks and black football boots. His entire head, both feet and the ball must be visible inside the frame with a little margin. Photorealistic candid sports campaign, late-afternoon golden sunlight, lush school playing field, leafy trees, subtle white clover flowers in the grass foreground. The left 70 percent of the wide image must remain empty dark deep-green soft-focus forest foliage and open shaded field, deliberately quiet and very dark to support live white headline text and partner badges overlaid in HTML. Background behind the boy glows warmly with filtered sunlight. Low camera viewpoint, premium cinematic quality, natural anatomy and facial features. No other people, no text, no typography, no circles or graphic overlays, no logos, no watermarks. This is one continuous photograph, not a website mockup or collage.
