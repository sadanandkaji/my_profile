export type Project = {
  slug: string;
  title: string;
  status: "In Progress" | "Shipped" | "Client Work";
  year: string;
  summary: string;
  stack: string[];
  href?: string;
};

// -----------------------------------------------------------------------
// Add new projects here as they ship — newest first. Each card on the
// /projects page is generated from this array, so nothing else needs to
// change when you add one.
// -----------------------------------------------------------------------
export const PROJECTS: Project[] = [
  {
    slug: "ai-cad",
    title: "AI-Based CAD Application",
    status: "In Progress",
    year: "2026",
    summary:
      "A CAD tool that turns natural-language and sketch input into parametric 3D models, aimed at cutting down the modeling grunt work for engineers.",
    stack: ["Python", "React", "Rust", "Computer Vision"],
  },
  {
    slug: "connectart",
    title: "ConnectArt",
    status: "Shipped",
    year: "2025",
    summary:
      "A platform connecting independent artists with clients — profiles, portfolios, and commission requests in one place.",
    stack: ["Next.js", "TypeScript", "Node.js", "SQL"],
  },
  {
    slug: "client-project-1",
    title: "Freelance Client Build — 01",
    status: "Client Work",
    year: "2025",
    summary:
      "End-to-end web application delivered for a freelance client, from requirements to deployment.",
    stack: ["Next.js", "TypeScript", "Node.js"],
  },
  {
    slug: "client-project-2",
    title: "Freelance Client Build — 02",
    status: "Client Work",
    year: "2024",
    summary:
      "A second freelance engagement, shipped successfully and handed off with documentation and support.",
    stack: ["React", "Node.js", "NoSQL"],
  },
];
