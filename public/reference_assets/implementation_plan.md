# Implementation Plan — Stylist Edge Salon Website

Create a premium, immersive, luxury salon website for **Stylist Edge Salon** that is fully data-driven, responsive, and visually stunning. The design uses warm neutral and clean white backgrounds, deep plum primary coloring, and rose gold accents, with elegant typography and smooth interactions.

## User Review Required

> [!IMPORTANT]
> - **Images**: We will update the default local paths in `database.json` (like `assets/threading.jpg` which are currently missing in the workspace) to high-quality curated Unsplash images for salon categories. This ensures the site displays premium photography out-of-the-box and conforms strictly to the data-driven architecture.
> - **Tailwind CSS v4 & Google Fonts**: We will import the premium serif font *Playfair Display* and the clean sans-serif font *Inter* from `next/font/google` in `app/layout.tsx` and map them to Tailwind v4 custom theme classes.

## Open Questions
- *None at this stage, the prompt is highly detailed.*

## Proposed Changes

---

### Global Styling and Fonts

#### [MODIFY] [layout.tsx](file:///c:/Users/PrabhuDevarajan/Desktop/JISHNU/BytesBrush/stylistedge/app/layout.tsx)
- Import `Playfair_Display` and `Inter` from `next/font/google`.
- Define them as CSS variables (`--font-playfair`, `--font-inter`).
- Inject these variables into the `html` tag.
- Update metadata with premium brand title "Stylist Edge Salon | Style that speaks confidence" and SEO meta descriptions.

#### [MODIFY] [globals.css](file:///c:/Users/PrabhuDevarajan/Desktop/JISHNU/BytesBrush/stylistedge/app/globals.css)
- Configure Tailwind v4 `@theme` directive to include:
  - `--color-primary`: `#5A1F45` (Deep Plum)
  - `--color-accent`: `#D4A373` (Rose Gold)
  - `--color-bg-luxury`: `#FDF8F6` (Warm neutral)
  - `--color-surface`: `#FFFFFF`
  - `--color-text-luxury`: `#1A1A1A`
  - `--font-serif-luxury`: `var(--font-playfair), serif`
  - `--font-sans-luxury`: `var(--font-inter), sans-serif`
- Add support for 3D flip card utility classes (perspective, preserve-3d, backface-hidden, and rotate-y-180).
- Customize scrollbar and global HTML/body rules for premium aesthetics.

---

### Data Initialization

#### [MODIFY] [database.json](file:///c:/Users/PrabhuDevarajan/Desktop/JISHNU/BytesBrush/stylistedge/public/database.json)
- Update image values for each category to high-resolution, curated, royalty-free Unsplash URLs.
- Verify standard data values.

---

### Main Application Page

#### [NEW] [page.tsx](file:///c:/Users/PrabhuDevarajan/Desktop/JISHNU/BytesBrush/stylistedge/app/page.tsx)
- Create a client-side (or server/client hybrid) component that loads the database structure dynamically from `/database.json` during mount.
- **Section 1: Hero**
  - Fullscreen view with a luxury salon background image, elegant text reveal, and "Explore Services" CTA button scrolling to Section 2.
- **Section 2 & 3: Services Grid and 3D Flip**
  - Grid layout: 3 columns (desktop), 2 columns (tablet), 1 column (mobile), with uniform height tiles.
  - Interactive cards with a 3D flip interaction:
    - *Front side*: Category image, dark gradient, title.
    - *Back side*: Category icon, title, description, and "View Services" button.
    - *Animations*: Smooth 3D Y-axis rotation and elevation shadow on hover.
- **Section 4: Service Detail Panel (Bottom-Sheet)**
  - Dimmed backdrop, smooth slide-up animation.
  - Dynamically renders services inside the selected category, checking price type (fixed, range, gender, custom) and formatting accordingly.
  - Renders rows with custom hover effects.
- **Section 5: Signature Services**
  - Filter categories where `highlight: true`.
  - Render large, beautiful showcases with parallax hover.
- **Section 6: About Experience**
  - Storytelling layout with a large luxury image and editorial styling about Stylist Edge Salon, E. Ranjitha, and the Dharmapuri location.
- **Section 7: Contact**
  - Elegant contact details card displaying address, phone (with click-to-call), and person-in-charge.
- **Section 8: Footer**
  - Brand identity, links, and copyright notice.

## Verification Plan

### Automated Tests
- Build verification: Run `npm run build` to verify there are no TypeScript compilation errors or lints.

### Manual Verification
- Verify the layout is fully responsive from mobile (320px) to desktop (1440px+).
- Verify the 3D flip card rotation behaves smoothly on hover.
- Verify that clicking "View Services" opens the bottom sheet, dimming the background and sliding up the list of services.
- Verify that price type formatting is correct for all cases (fixed, range, gender, custom).
- Verify that clicking the close button or the dimmed overlay hides the sheet correctly.
- Verify the Signature Services section shows the highlighted categories correctly.
