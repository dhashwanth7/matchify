\# Matchify



\### Build the right team, not just a team.



Matchify is a project-first student team formation platform designed to help students find suitable teammates based on project requirements, skills, skill levels, experience, interests, and availability.



\## Problem



Students often struggle to identify the right teammates for academic projects, hackathons, and competitions.



Existing platforms help people discover and connect with others, but they do not focus specifically on matching people to project requirements.



\## Solution



Matchify changes the workflow from:



\*\*Person → Profile → Connect\*\*



to:



\*\*Project → Requirements → Match → Connect → Build Team\*\*



\## Key Features



\- Project-based candidate matching

\- Skill levels and skill assessment

\- Match percentage

\- "Why Match?" explanations

\- Candidate search and profiles

\- Messaging

\- Team invitations

\- Team skill-gap identification

\- Project requirements



\## Matching Factors



Matchify considers:



\- Required skills

\- Skill level

\- Experience

\- Availability

\- Project requirements

\- Complementary team skills



\## Technology



\- React

\- TypeScript

\- Vite

\- Tailwind CSS

\- Node.js

\- Express

\- Gemini API

\- GitHub

\- Vercel



\## Architecture



\*\*Frontend:\*\* React + TypeScript + Vite



\*\*Backend:\*\* Node.js + Express



\*\*AI:\*\* Gemini API through the backend



The application also supports an intelligent fallback mode when the AI API is unavailable.



\## Live Demo



https://matchify-blush.vercel.app/



\## Project Goal



The goal of Matchify is to make student team formation more effective by helping users find teammates based on what a project actually needs, rather than simply browsing profiles.

\## Architecture



```text

Student

&#x20;  ↓

React + TypeScript Frontend

&#x20;  ↓

Express API Server

&#x20;  ↓

Matching \& AI Services

&#x20;  ↓

Candidate / Project Results

## Security

- Sensitive API configuration is stored using environment variables.
- API credentials are kept on the server side.
- Environment files are excluded from version control.
- The frontend does not directly expose private API credentials.
- The application supports an intelligent fallback when AI services are unavailable.
## Testing & Validation

The application was validated through:

- Production build verification using Vite.
- Candidate matching flow testing.
- Project and team interaction testing.
- Profile and messaging flow testing.
- Skill assessment flow testing.
- Navigation and responsive UI checks.
- Verification of the deployed production build.

The production build was successfully generated before deployment.
## Accessibility

Matchify considers accessibility through:

- Descriptive alternative text for profile images.
- Accessible labels for important interactive controls.
- Visible keyboard focus states.
- Improved text and background contrast.
- Clear visual hierarchy.
- Responsive layouts for different screen sizes.
- Readable typography and interactive elements.

