import '../src/index.css'
import 'goey-toast/styles.css'
import Providers from './providers'
import ThemeFavicon from './theme-favicon'
import Scripts from './scripts'

const SITE_URL = 'https://www.manishshrestha012.com.np'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'StudyMate — Computer Engineering Notes Pokhara University',
  description:
    'Pokhara University BE Computer Engineering notes — free semester-wise PDFs for ML, DBMS, DSA, OS, CN, AI, Java, C Programming and all subjects. Download topper notes for PEC, NCIT, NEC and other PU colleges.',
  keywords: [
    'Pokhara University notes', 'BE Computer Engineering', 'StudyMate', 'PU engineering notes',
    'PU topper notes', 'Machine Learning notes PU', 'ML notes PU', 'DBMS notes PU', 'DSA notes PU',
    'OS notes PU', 'CN notes PU', 'Compiler Design notes PU', 'AI notes PU', 'Java notes PU',
    'C Programming notes PU', 'Computer Graphics notes PU', 'free PU notes download',
    'PU semester wise notes', 'Pokhara University BE Computer Engineering notes', 'PEC notes',
    'NCIT notes', 'NEC notes', 'PU notes free download', 'BE Computer study materials',
  ],
  authors: [{ name: 'Manish Shrestha' }],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_SITE_VERIFICATION || '464a14ed2069c072',
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION,
      'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION,
      'naver-site-verification': process.env.NAVER_SITE_VERIFICATION,
      'seznam-wmt': process.env.SEZNAM_SITE_VERIFICATION,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/white.svg', type: 'image/svg+xml', id: 'dynamic-favicon' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: ['/favicon-48.png'],
    apple: [{ url: '/logo-512.png', sizes: '192x192', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StudyMate',
  },
  applicationName: 'StudyMate',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'StudyMate',
    locale: 'en_US',
    title: 'PU Notes - Pokhara University Computer Engineering Notes',
    description:
      'Free PU notes for BE Computer Engineering. Download Pokhara University notes — ML, DBMS, DSA, OS, Compiler Design, AI, Java, C Programming, and all semester materials.',
    images: [
      {
        url: `${SITE_URL}/logo-512.png`,
        width: 512,
        height: 512,
        alt: 'StudyMate logo — Pokhara University Computer Engineering Notes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PU Notes - Pokhara University Computer Engineering Notes',
    description:
      'Free PU notes for BE Computer Engineering. Download Pokhara University notes — ML, DBMS, DSA, OS, Compiler Design, AI, Java, C Programming, and all semester materials.',
  },
  alternates: { canonical: SITE_URL },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

const orgGraphJson = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'StudyMate',
      alternateName: 'Manish Shrestha StudyMate',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-512.png` },
      sameAs: ['https://github.com/manishshrestha01'],
      description: 'PU notes for BE Computer Engineering students.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'StudyMate',
      alternateName: 'Manish Shrestha StudyMate',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${SITE_URL}/#sitenav`,
      name: 'Main navigation',
      url: [
        `${SITE_URL}/dashboard`,
        `${SITE_URL}/colleges`,
        `${SITE_URL}/blog`,
        `${SITE_URL}/login`,
        `${SITE_URL}/about`,
        `${SITE_URL}/contact`,
        `${SITE_URL}/privacy-policy`,
        `${SITE_URL}/terms`,
        `${SITE_URL}/disclaimer`,
      ],
    },
  ],
}

const personJson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#author`,
  name: 'Manish Shrestha',
  url: `${SITE_URL}/about`,
  sameAs: ['https://github.com/manishshrestha01'],
  jobTitle: 'Developer & Content Curator',
  knowsAbout: [
    'Pokhara University BE Computer Engineering',
    'Nepal Engineering Education',
    'Computer Science',
    'Software Engineering',
    'Data Structures and Algorithms',
  ],
  worksFor: { '@id': `${SITE_URL}/#organization` },
}

const faqPageJson = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can I find Pokhara University BE Computer Engineering notes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'StudyMate (manishshrestha012.com.np) provides free semester-wise notes and PDFs for Pokhara University BE Computer Engineering students. It covers all 8 semesters of the 2022 PU curriculum and includes resources for colleges like PEC, NCIT, NEC, GCES, Cosmos, Oxford, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'What subjects are covered in PU BE Computer Engineering Semester 1?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pokhara University BE Computer Engineering Semester 1 (2022 curriculum) covers: Calculus I, Digital Logic, Programming in C, Basic Electrical Engineering, Computer Workshop, Communication Technique, and Electronics Devices and Circuits.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which colleges are affiliated with Pokhara University for BE Computer Engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pokhara University (PU) affiliated colleges for BE Computer Engineering in Nepal include: Pokhara Engineering College (PEC), Nepal College of Information Technology (NCIT), National Engineering College (NEC), Global College of Engineering and Technology (GCES), Cosmos College, Oxford College of Engineering, Emerging Engineer\'s College (EEC), Lumbini Engineering College (LEC), Manmohan Bhatta College of Engineering (MBCE), NAST, Rapti Engineering College (REC), Universal Engineering and Science College (UESC), and United Technical College (UTC).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is StudyMate free to use for PU notes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, StudyMate is completely free for all Pokhara University BE Computer Engineering students. You can access semester-wise PDFs, subject notes, and study materials at manishshrestha012.com.np without any payment.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many semesters are there in PU BE Computer Engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pokhara University BE Computer Engineering is a 4-year program with 8 semesters. StudyMate provides notes and study materials for all 8 semesters of the 2022 PU curriculum.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find PEC notes for BE Computer Engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Notes for Pokhara Engineering College (PEC) BE Computer Engineering are available at StudyMate: manishshrestha012.com.np/college/pec. The page includes semester-wise PDFs and study materials for all PEC students.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find NCIT notes for BE Computer Engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Notes for Nepal College of Information Technology (NCIT) BE Computer Engineering are available at StudyMate: manishshrestha012.com.np/college/ncit. It covers all semesters of the Pokhara University curriculum.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find ML, DBMS, DSA, BEE, OS notes for PU BE Computer Engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'StudyMate provides free notes for all PU BE Computer Engineering subjects including Machine Learning (ML), Database Management System (DBMS), Data Structure and Algorithm (DSA), Basic Electrical Engineering (BEE), Operating Systems (OS), Computer Networks (CN), Compiler Design (CD), Artificial Intelligence (AI), Software Engineering (SE), and more. Each subject page includes PDF notes, syllabus breakdown, important topics, and practice questions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there free topper notes available for PU BE Computer Engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, StudyMate provides free topper notes and study materials for all Pokhara University BE Computer Engineering subjects. Access semester-wise notes, practice questions, and exam preparation materials at manishshrestha012.com.np/blog completely free.',
      },
    },
  ],
}

const speakableJson = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.speakable-intro', "meta[name='description']"] },
  url: SITE_URL,
}

const schemaScripts = [orgGraphJson, personJson, faqPageJson, speakableJson]

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="geo.region" content="NP" />
        <meta name="geo.placename" content="Nepal" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/logo-512.png" />
        {schemaScripts.map((schemaJson, index) => (
          <script
            key={`site-schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
          />
        ))}
      </head>
      <body>
        <Scripts />

        <ThemeFavicon />

        {/* <a href="#main" className="skip-to-content">Skip to main content</a> */}

        <noscript>
          <section aria-label="StudyMate Overview (no-JS)">
            <h1>StudyMate - Pokhara University Computer Engineering Notes</h1>
            <p>
              StudyMate provides semester-wise notes, subject guides, and study resources for
              Pokhara University BE Computer Engineering students.
            </p>
          </section>
          <nav aria-label="Main (no-JS)">
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/colleges">Colleges</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/disclaimer">Disclaimer</a></li>
            </ul>
          </nav>
        </noscript>

        <main id="main" role="main" tabIndex={-1}>
          <div id="root">
            <Providers>{children}</Providers>
          </div>
        </main>
      </body>
    </html>
  )
}