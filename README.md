# Portfolio update — blueprint / CAD-schematic theme

## What this is
A redesign of your homepage plus three new pages (`about`, `projects`,
`contact`), built around a "technical drawing" idea — since you're building
a CAD app, the whole site borrows from CAD software's visual language:
a fine grid background (kept from your original), corner registration
marks on cards, mono-font section labels ("sheet 01", "fig. a"), and a
live coordinate readout in the bottom-left corner that tracks your cursor
like a CAD status bar. That readout is the one signature element — nothing
else on the page competes with it for attention.

Kept your existing palette (`#060B16` navy, `#E8B34D` gold), your grid
background, your Nav, and Luffy exactly as they were — they were already
good choices. Added one new accent, a muted teal (`#4DC9B0`), used only for
"in progress" / "available" status dots.

## Where files go
Copy these into your existing project, same paths:

```
app/layout.tsx
app/page.tsx
app/index.css
app/about/page.tsx
app/projects/page.tsx
app/contact/page.tsx
components/Nav.tsx
components/Background.tsx
components/LuffyTracker.tsx
components/BlueprintCard.tsx
components/CoordinateHUD.tsx
lib/socials.ts
lib/skills.ts
lib/projects.ts
lib/timeline.ts
```

This assumes a `@` path alias to your project root (the default in
`create-next-app`, configured in `tsconfig.json` as `"@/*": ["./*"]`). If
yours differs, adjust the `@/...` imports in `layout.tsx` and the page
files.

## Adding future projects
Don't touch `app/projects/page.tsx` for new projects — just add an entry
to the `PROJECTS` array in `lib/projects.ts`:

```ts
{
  slug: "your-new-project",
  title: "Project Name",
  status: "Shipped", // or "In Progress" / "Client Work"
  year: "2026",
  summary: "One or two sentences on what it does.",
  stack: ["Next.js", "..."],
}
```

The grid, card layout, and figure numbers regenerate automatically.

## Notes
- The emoji (👋 on the home hero, ✉️ on contact) are set small and raised,
  as an accent next to the heading rather than a big decorative icon.
- Corner ticks are pure CSS (`.tick` classes in `app/index.css`), reused
  via `<BlueprintCard>` — style them or remove them there if you want a
  quieter look later.
- `CoordinateHUD` hides on small screens (`hidden sm:block`) since a
  cursor readout doesn't mean much on touch devices.
