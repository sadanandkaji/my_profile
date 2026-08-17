export type Project = {
  slug: string;
  title: string;
  status: "In Progress" | "Shipped" | "Client Work";
  year: string;
  summary: string;
  stack: string[];
  githubHref?: string;
  demoHref?: string;
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
    slug: "voltiq",
    title: "VoltIQ",
    status: "Shipped",
    year: "2026",
    summary:
      "An EV trip planner that predicts real-world battery usage — factoring in weather, elevation, and driving style — with live charger discovery and turn-by-turn navigation along every route.",
    stack: ["Next.js", "TypeScript", "Node.js", "OpenChargeMap"],
    demoHref: "https://voltai-nu.vercel.app/",
  },
  {
    slug: "rue",
    title: "RUE — Recursive Understanding Engine",
    status: "Shipped",
    year: "2026",
    summary:
      "Turns any question into a living, branching knowledge map. Ask once and watch it split into connected ideas — every node explorable, every branch saved on canvas.",
    stack: ["Next.js", "TypeScript", "AI", "Canvas API"],
    demoHref: "https://recurcivelearningapp.vercel.app/",
  },
  {
    slug: "lavelle-venture",
    title: "Lavelle Venture — Real Estate CRM",
    status: "Client Work",
    year: "2026",
    summary:
      "A real estate CRM integrated with the Instagram and WhatsApp APIs to surface AI-assisted property listings directly to leads. Includes a full admin panel for managing listings, leads, and conversations, plus a bulk messaging system that sends up to 1,000 messages in a single click alongside automated follow-up sequences to re-engage leads.",
    stack: [
      "React",
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "WhatsApp API",
      "Instagram API",
    ],
  },
  {
    slug: "svs-solar",
    title: "SVS Solar — Internal Product Platform",
    status: "Client Work",
    year: "2026",
    summary:
      "An internal product management platform built for a solar company, with role-based access control (RBAC) to manage permissions across teams.",
    stack: ["React", "Next.js", "Prisma", "PostgreSQL", "Docker"],
  },
];