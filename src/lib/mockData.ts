export type Role = "Admin" | "Approver" | "Editor" | "Viewer";

export type User = {
  id: string;
  name: string;
  role: Role;
  initials: string;
  team: string;
  email: string;
};

export type ContentItem = {
  id: string;
  title: string;
  thumbnail: string;
  hook: string;
  type: "Article" | "Video" | "Campaign" | "Asset";
  status: "Draft" | "Review" | "Published";
  ownerId: string;
  channel: string;
  shootDate: string;
  postDate: string;
  due: string;
  createdAt: string;
  reviewDate: string;
  tags: string[];
  progress: number;
  objective: string;
  target: string;
  painPoint: string;
  keyMessage: string;
  proof: string;
  cta: string;
};

export type Frame = {
  id: string;
  contentId: string;
  image: string;
  sceneNumber: number;
  scriptLine: string;
  note: string;
};

export type Task = {
  id: string;
  contentId: string;
  title: string;
  assigneeId: string;
  status: "Backlog" | "In progress" | "Review" | "Done";
  startDate: string;
  due: string;
  effort: string;
};

export const rolePermissions: Record<
  Role,
  {
    canAdd: boolean;
    canEdit: boolean;
    canApprove: boolean;
    canViewAll: boolean;
    description: string;
  }
> = {
  Admin: {
    canAdd: true,
    canEdit: true,
    canApprove: true,
    canViewAll: true,
    description: "Full access to create, review, and manage content.",
  },
  Approver: {
    canAdd: false,
    canEdit: true,
    canApprove: true,
    canViewAll: true,
    description: "Review and approve content with visibility across teams.",
  },
  Editor: {
    canAdd: true,
    canEdit: true,
    canApprove: false,
    canViewAll: true,
    description: "Create and edit content with limited approval rights.",
  },
  Viewer: {
    canAdd: false,
    canEdit: false,
    canApprove: false,
    canViewAll: true,
    description: "Read-only access to review content and status updates.",
  },
};

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Ava Martinez",
    initials: "AM",
    role: "Admin",
    team: "Product",
    email: "ava@domore.studio",
  },
  {
    id: "u2",
    name: "Noah Patel",
    initials: "NP",
    role: "Approver",
    team: "Content",
    email: "noah@domore.studio",
  },
  {
    id: "u3",
    name: "Sophia Kim",
    initials: "SK",
    role: "Editor",
    team: "Growth",
    email: "sophia@domore.studio",
  },
  {
    id: "u4",
    name: "Ethan Brooks",
    initials: "EB",
    role: "Viewer",
    team: "Analytics",
    email: "ethan@domore.studio",
  },
];

export const contentItems: ContentItem[] = [
  {
    id: "c1",
    title: "May content calendar",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
    hook: "Plan the month with a calendar view that keeps every launch on track.",
    type: "Campaign",
    status: "Draft",
    ownerId: "u3",
    channel: "Email",
    shootDate: "May 25",
    postDate: "May 30",
    due: "May 23",
    createdAt: "May 2",
    reviewDate: "May 18",
    tags: ["Q2", "Launch"],
    progress: 26,
    objective: "Align the campaign messaging across channels.",
    target: "Marketing and sales teams preparing for launch.",
    painPoint: "Stakeholders need a clear content roadmap.",
    keyMessage: "Structured planning builds consistent momentum.",
    proof: "Quarterly campaigns executed with on-time assets.",
    cta: "Review schedule and confirm deadlines.",
  },
  {
    id: "c2",
    title: "Customer story video",
    thumbnail: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=800&q=60",
    hook: "Showcase customer success with a concise video narrative.",
    type: "Video",
    status: "Review",
    ownerId: "u2",
    channel: "Social",
    shootDate: "May 19",
    postDate: "May 24",
    due: "May 20",
    createdAt: "May 6",
    reviewDate: "May 16",
    tags: ["Video", "Testimonial"],
    progress: 68,
    objective: "Build trust through real customer stories.",
    target: "Prospects researching product fit.",
    painPoint: "Customers want proof that the product delivers results.",
    keyMessage: "Our solution supports faster adoption and reliable outcomes.",
    proof: "Real results from a recent implementation.",
    cta: "Approve the final edit for distribution.",
  },
  {
    id: "c3",
    title: "Guides redesign brief",
    thumbnail: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=60",
    hook: "Refresh help guides to make product learning effortless.",
    type: "Article",
    status: "Published",
    ownerId: "u1",
    channel: "Web",
    shootDate: "May 10",
    postDate: "May 12",
    due: "May 11",
    createdAt: "April 28",
    reviewDate: "May 9",
    tags: ["UX", "Docs"],
    progress: 100,
    objective: "Improve content discoverability for new users.",
    target: "New product users and support teams.",
    painPoint: "Documentation is hard to scan and update.",
    keyMessage: "Clear structure removes friction from onboarding.",
    proof: "Latest guide refresh reduced support tickets by 14%.",
    cta: "Share the new guide with internal teams.",
  },
  {
    id: "c4",
    title: "Creative asset drop",
    thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    hook: "Release polished assets that support key campaign moments.",
    type: "Asset",
    status: "Draft",
    ownerId: "u3",
    channel: "Paid",
    shootDate: "May 28",
    postDate: "June 1",
    due: "May 29",
    createdAt: "May 8",
    reviewDate: "May 21",
    tags: ["Design", "Social"],
    progress: 14,
    objective: "Provide ready-to-use creative for paid channels.",
    target: "Campaign and creative teams.",
    painPoint: "Assets are inconsistent and hard to reuse.",
    keyMessage: "A unified asset drop keeps campaign execution fast.",
    proof: "Previous asset sets improved launch speed by 20%.",
    cta: "Confirm final artwork and distribution slots.",
  },
];

export const frames: Frame[] = [
  {
    id: "f1",
    contentId: "c2",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60",
    sceneNumber: 1,
    scriptLine: "Open with customer challenge and background.",
    note: "Wide shot with contextual B-roll.",
  },
  {
    id: "f2",
    contentId: "c2",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    sceneNumber: 2,
    scriptLine: "Highlight solution impact with quote overlay.",
    note: "Two-shot with on-screen text.",
  },
  {
    id: "f3",
    contentId: "c1",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
    sceneNumber: 1,
    scriptLine: "Introduce high-level calendar view.",
    note: "Clean UI animation and team close-up.",
  },
  {
    id: "f4",
    contentId: "c4",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=60",
    sceneNumber: 1,
    scriptLine: "Reveal the new asset pack with bold visuals.",
    note: "Use product shots and quick cuts.",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    contentId: "c2",
    title: "Review Q2 highlight deck",
    assigneeId: "u2",
    status: "In progress",
    startDate: "May 12",
    due: "May 14",
    effort: "2d",
  },
  {
    id: "t2",
    contentId: "c4",
    title: "Proofread launch copy",
    assigneeId: "u3",
    status: "Backlog",
    startDate: "May 17",
    due: "May 19",
    effort: "1d",
  },
  {
    id: "t3",
    contentId: "c1",
    title: "Prepare campaign brief",
    assigneeId: "u1",
    status: "Review",
    startDate: "May 15",
    due: "May 17",
    effort: "3d",
  },
  {
    id: "t4",
    contentId: "c3",
    title: "Share asset library",
    assigneeId: "u4",
    status: "Done",
    startDate: "May 8",
    due: "May 9",
    effort: "4h",
  },
];

export const statusOptions = ["All", "Draft", "Review", "Published"] as const;
export const typeOptions = ["All", "Article", "Video", "Campaign", "Asset"] as const;
