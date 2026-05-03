# Portfolio Website — Claude Guidelines

## Purpose

This is a personal portfolio website for an individual contractor. Its goal is to showcase skills, experience, and personality to attract potential clients. Design quality, polish, and professionalism are top priorities.

## Frontend Development

**Always invoke the `frontend-design` skill before making any changes to website code** (HTML, CSS, or JavaScript). This ensures every change maintains high design quality and avoids generic aesthetics.

This applies to:
- Layout or structural changes (`index.html`)
- Styling updates (`style.css`)
- Interactivity or behavior changes (`script.js`)
- Any new components or sections added to the site

## Design Principles

- The site represents a contractor's brand — every detail should feel intentional and professional
- Prefer distinctive, polished UI over safe or generic patterns
- Animations and interactions should feel smooth and purposeful, not decorative noise
- Typography, spacing, and color should reinforce credibility and expertise

## Available Skills

| Skill | Command | When to use |
|-------|---------|-------------|
| `frontend-design` | `/frontend-design` | Any changes to HTML, CSS, or JS — auto-invoked per the rule above |
| `video-to-website` | `/video-to-website` | Convert a video file into a scroll-driven animated website with GSAP and canvas frame rendering |
| `skill-builder` | `/skill-builder` | Create, optimize, or audit skills in this project; see `.claude/skills/skill-builder/reference.md` for full field reference |
