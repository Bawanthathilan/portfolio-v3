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

// Each section id doubles as a dock command target.
export const sections = [
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'open-source', label: 'Open source' },
  { id: 'writing', label: 'Writing' },
  { id: 'off-the-clock', label: 'Off the clock' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'guestbook', label: 'Guestbook' }
];
