// Static profile content for the v3 home page. Dynamic content (work,
// projects, highlights, guestbook) still comes from Supabase.

export const profile = {
  name: 'Bawantha Thilan',
  handle: 'bawantha',
  role: 'Senior Software Engineer | OpenSource Contributor',
  location: 'Belihuloya, Sri Lanka',
  city: 'Belihuloya',
  timeZone: 'Asia/Colombo',
  timeZoneLabel: 'Sri Lanka',
  // Hours (local, 24h) when I'm usually around to reply.
  hours: { start: 9, end: 23 },
  email: 'bawantharathnayaka@gmail.com',
  github: 'Bawanthathilan',
  medium: 'bawantharathnayaka',
  // OpenMRS developer stage and community forum profile
  openmrsStage: '/dev/3',
  openmrsStageName: 'Skilled',
  // One line on what the stage means (OpenMRS developer stages)
  openmrsStageSummary:
    'Trusted with code review, CI, leading sprints and pushing to modules.',
  openmrsTalk: 'https://talk.openmrs.org/u/bawanthathilan/summary',
  // Which repo the open-source avatar shows for an organisation. Orgs not
  // listed fall back to the repo with the most of my recent merged PRs.
  featuredRepos: {
    openmrs: 'openmrs-esm-admin-tools'
  } as Record<string, string>,
  resume:
    'https://drive.google.com/drive/folders/191j6y4c-BGXbQJD_Lp5nZW7JnGIe2NDS?usp=sharing',
  socials: {
    github: 'https://github.com/Bawanthathilan',
    x: 'https://twitter.com/ThilanBawantha',
    linkedin: 'https://www.linkedin.com/in/bawanthathilan/',
    medium: 'https://medium.com/@bawantharathnayaka'
  }
};

// LinkedIn recommendation shown in the "kind words" section. `highlight`
// must appear in `quote` exactly as written.
export const recommendation = {
  quote:
    "I've had a fantastic time working with Bawantha on OpenMRS. He's been a real asset to our community over the years, building several key projects, most recently a metadata extraction tool. Bawantha is easy to work with and goes above and beyond what is asked of him. He is thoughtful, careful and does excellent work. Bawantha would be a real asset to any team lucky enough to have him on it.",
  highlight: 'goes above and beyond what is asked of him',
  name: 'Ian Bacher',
  role: 'Engineering Lead, OpenMRS',
  avatar: '/people/ian.jpg',
  profile: 'https://www.linkedin.com/in/ian-bacher-933598176/',
  link: 'https://www.linkedin.com/in/bawanthathilan/details/recommendations/'
};

// Each section id doubles as a dock command target.
export const sections = [
  { id: 'work', label: 'Work' },
  { id: 'kind-words', label: 'Kind words' },
  { id: 'projects', label: 'Projects' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'open-source', label: 'Open source' },
  { id: 'writing', label: 'Writing' },
  { id: 'off-the-clock', label: 'Off the clock' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'guestbook', label: 'Guestbook' }
];
