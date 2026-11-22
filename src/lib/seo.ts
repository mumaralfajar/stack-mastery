// schema.org JSON-LD builders for static pages (Course on landing/track pages, LearningResource on lessons).
import { SITE, absoluteUrl, routePath } from './routes.ts';
import type { Lang } from './types.ts';

const PROVIDER = { '@type': 'Organization', name: 'Stack Mastery', url: SITE + routePath('en', '/') };

export interface CourseInput {
  lang: Lang;
  path: string;
  name: string;
  description: string;
  parts?: { name: string; description: string; path: string }[];
}

export function courseLd({ lang, path, name, description, parts }: CourseInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: absoluteUrl(lang, path),
    inLanguage: lang,
    isAccessibleForFree: true,
    provider: PROVIDER,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT30M' },
    ...(parts?.length
      ? {
          hasPart: parts.map((p) => ({
            '@type': 'Course',
            name: p.name,
            description: p.description,
            url: absoluteUrl(lang, p.path),
            provider: PROVIDER,
          })),
        }
      : {}),
  };
}

export interface LessonInput {
  lang: Lang;
  path: string;
  name: string;
  description: string;
  level: string;
  minutes: number;
  trackName: string;
  trackPath: string;
  keywords: string[];
}

export function learningResourceLd(x: LessonInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: x.name,
    description: x.description,
    url: absoluteUrl(x.lang, x.path),
    inLanguage: x.lang,
    learningResourceType: 'Lesson',
    educationalLevel: x.level,
    timeRequired: `PT${x.minutes}M`,
    isAccessibleForFree: true,
    keywords: x.keywords.join(', '),
    provider: PROVIDER,
    isPartOf: { '@type': 'Course', name: x.trackName, url: absoluteUrl(x.lang, x.trackPath), provider: PROVIDER },
  };
}

// Plain-text description from inline-markdown prose, trimmed for <meta name="description">.
export function plainDescription(s: string, max = 158): string {
  const text = s.replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).replace(/[,.;:\s]+$/, '') + '…';
}
