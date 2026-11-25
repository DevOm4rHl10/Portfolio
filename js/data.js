/* ==========================================================================
   YOUR CONTENT LIVES HERE
   Everything on the site (name, intro, projects, books, links) is read
   from this one file. Edit it, save, refresh the page. No build step.

   Project fields
   --------------
   id        Used in the URL (project.html?id=...). Lowercase, dashes, unique.
             Don't change it once you've shared a link to the project.
   title     Project name shown on the plot sign (keep it short).
   subtitle  A few words under the title on the sign, e.g. 'UK crime hotspots'.
   tagline   One sentence: what it is / what it does.
   availability  Optional note under the buttons, e.g. 'Chrome Web Store release coming soon.'
   status    'complete'     -> fully grown plant, with its quality star
             'in-progress'  -> still growing, no star yet (quality is decided at harvest)
   stage     Only for in-progress projects: how far along it is.
               0 = seed         (just started)
               1 = sprout       (early days)
               2 = growing      (core features working)
               3 = budding      (almost done)
   quality   Size of a COMPLETE project (ignored while in progress):
               'iridium' = big project
               'gold'    = solid, well-rounded project
               'silver'  = medium-sized project
               'none'    = small but finished project (no star)
   stack     Main technologies, shown on the project page.
   built     What the project is and what you built (1-2 paragraphs).
   learned   What you learned. A list: one string per paragraph.
   skills    New skills you picked up. Short labels.
   links     live / source URLs. Leave a link as '' to hide its button.

   Order on the page is automatic: complete projects first, sorted
   iridium > gold > silver > none, then projects in progress, most advanced
   first. Projects with the same rank keep the order they have in this file.

   Text tip: an apostrophe inside 'single quotes' must be written \'
   (or wrap that text in "double quotes" instead).
   ========================================================================== */

window.PORTFOLIO = {
  profile: {
    name: 'Omar Holeihel',
    role: 'Data Science & Machine Learning | Computer Engineering, INSA Lyon (4th year)',
    intro:
      'Welcome to my little farm of projects and intellectual adventures! ' +
      "I'm Omar, a 4th-year Computer Engineering student at INSA Lyon with a BSc in Applied Mathematics. " +
      'I love working where maths meets code: data science, AI and machine learning, ' +
      "and I'm open to software engineering too. " +
      'Based in Lyon, looking for a 4-month Data Science / Machine Learning internship from 13 May 2027.',

    // Path to a square photo, e.g. 'img/me.jpg'. Leave '' to use the pixel avatar.
    photo: '',

    email: 'omarhlayhel2.10@gmail.com',
    github: 'https://github.com/DevOm4rHl10',
    linkedin: 'https://www.linkedin.com/in/omar-holeihel-a48b573b1/',

    // Your CV, next to index.html. Opens in a new tab. '' hides the buttons.
    cv: 'CV_HOLEIHEL_Eng.pdf',

    /* Quote shown under the intro.
       `default` is used in every season. Give a season its own quote to swap it
       when that season is selected; leave a season as null to use the default.
       Set default text to '' (and seasons to null) to hide the quote. */
    quote: {
      default: {
        text: 'It is good to have an end to journey toward; but it is the journey that matters, in the end.',
        author: 'Ursula K. Le Guin, The Left Hand of Darkness'
      },
      spring: null,
      summer: null,
      fall: null,
      winter: null
    },

    /* The goodbye sign at the bottom of every page. Changes with the season. */
    farewell: {
      spring: 'Thanks for stopping by the farm. I hope something good blooms for you today.',
      summer: 'Thanks for stopping by the farm. Go catch a bit of sun today.',
      fall: "Thanks for stopping by the farm. Grab something warm to drink, you've earned it.",
      winter: 'Thanks for stopping by the farm. Stay cosy out there.'
    },

    /* The pixel avatar (used when `photo` is '') changes outfit with the season:
       spring flower crown, summer straw hat, fall scarf, winter beanie.
       Set to false to keep one plain outfit all year. */
    seasonalOutfits: true,

    /* Greeting box above the avatar: visitors click it (or the arrows) to see
       the next one. Shown in this order. dir: 'rtl' for right-to-left scripts. */
    greetings: [
      { text: 'Здравствуйте', lang: 'ru', name: 'Russian' },
      { text: 'Hola', lang: 'es', name: 'Spanish' },
      { text: 'Hello', lang: 'en', name: 'English' },
      { text: 'مرحبا', lang: 'ar', dir: 'rtl', name: 'Arabic' },
      { text: 'Bonjour', lang: 'fr', name: 'French' },
      { text: '안녕하세요', lang: 'ko', name: 'Korean' },
      { text: 'Përshëndetje', lang: 'sq', name: 'Albanian' }
    ],

    about: [
      "I'm a fourth-year Computer Engineering student at INSA Lyon, with a BSc in Applied " +
        'Mathematics from Université Paris-Saclay (Mention Bien). What I enjoy most is the ' +
        'meeting point of the two: data science, AI and machine learning, and lately large language models.',
      'Outside class I practise archery, read and write a lot, and I am a member of BEST Lyon. ' +
        'I speak Arabic, English and French, I am learning Russian and Spanish, ' +
        'and I simply love learning languages.'
    ],

    // Same groups and wording as the CV
    skills: [
      { group: 'Programming', items: ['Python', 'SQL', 'C', 'C++', 'R', 'JavaScript'] },
      { group: 'ML', items: ['PyTorch', 'ONNX', 'scikit-learn', 'NumPy', 'pandas', 'SciPy'] },
      { group: 'AI & Data', items: ['LLM Evaluation', 'Prompting', 'Flink SQL', 'MySQL'] },
      { group: 'Tools', items: ['Flask', 'React', 'Docker', 'Git', 'GitHub Actions', 'Linux'] },
      {
        group: 'Languages',
        items: ['Arabic (native)', 'English (B2)', 'French (B2)', 'Spanish (A2)', 'Russian (A2)']
      }
    ]
  },

  /* Experience. Shown in this order (most recent first), wording as on the CV.
     links: optional buttons, e.g. { text: 'Read the report', url: 'docs/report.pdf' }.
            Only add documents you are allowed to share publicly. */
  experience: [
    {
      role: 'HR Team Member',
      org: 'BEST Lyon',
      orgDetail: 'Board of European Students of Technology',
      place: 'Lyon',
      dates: 'Jul 2026 – Present',
      points: [
        'Organised 2 team-building events per month and co-organised events with BEST groups across ' +
          'Europe, coordinating with the PR and Corporate teams in English.'
      ],
      links: []
    },
    {
      role: 'Research Intern – LLMs & Streaming SQL',
      org: 'LIRIS Laboratory (CNRS)',
      orgDetail: 'Database Team',
      place: 'Lyon',
      dates: 'Jun 2025 – Sep 2025',
      points: [
        'Generated a dataset of 60 Flink SQL queries across 3 abstraction levels, by applying ' +
          'chain-of-thought prompting to a local LLM (Ollama).',
        'Built a Python pipeline to parse and score LLM outputs, and tested the model for bias towards ' +
          'window types by normalising values per type.',
        'Report and oral defence rated Outstanding by the supervisor.'
      ],
      links: []
    },
    {
      role: 'Teaching Assistant – Mathematics',
      org: 'Collège François Furet',
      orgDetail: '',
      place: 'Antony (Paris area)',
      dates: 'Sep 2022 – Jul 2023',
      points: [
        'Taught and assessed 2 4e/3e maths classes, gave one-to-one support to students with special ' +
          'needs, and reported progress in class councils.'
      ],
      links: []
    }
  ],


  /* Background music (optional)
     - Off by default. Visitors turn it on with the Music button; it is never autoplayed.
     - Nothing is downloaded until someone presses the button.
     - Put your audio files in the `audio/` folder next to index.html.
     - `default` plays in every season. Add per-season tracks to change the
       music when the season changes (it crossfades). Any season left out
       falls back to `default`.
     - Set enabled: false to hide the button. */
  music: {
    enabled: true,
    volume: 0.35, // 0 to 1. Keep it low: this is background ambience.
    tracks: {
      default: 'audio/theme.mp3',
      spring: '',
      summer: '',
      fall: '',
      winter: ''
    }
  },

  /* Bookshelf. Shown in this order.
     original:  the title in its original script (optional), shown under the title.
     note:      one sentence on what you took from it (optional, '' to hide).
     favourite: true adds a "My favourite" tag (use it on one book).
     link:      a page about the book (optional, '' to hide). */
  books: [
    {
      title: 'Orientalism',
      author: 'Edward Said',
      favourite: true,
      note: 'A complete shift of perspective.',
      link: ''
    },
    {
      title: 'The Iliad and The Odyssey',
      author: 'Homer',
      note: 'A fascinating search for identity.',
      link: ''
    },
    {
      title: "Man's Search for Meaning",
      author: 'Viktor E. Frankl',
      note: 'On resilience, and on the immense capacity for evil in humans.',
      link: ''
    },
    {
      title: 'A House of Many Mansions',
      author: 'Kamal Salibi',
      note: 'An incredible journey of self-discovery through the history of my country.',
      link: ''
    },
    {
      title: 'Woman and Sex',
      original: 'المرأة والجنس',
      author: 'Nawal El Saadawi',
      note: 'On the need for feminism in the Arab world.',
      link: ''
    },
    { title: 'Nineteen Eighty-Four', author: 'George Orwell', note: '', link: '' },
    { title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', note: '', link: '' },
    {
      title: 'Kalila and Dimna',
      original: 'كليلة ودمنة',
      author: "Ibn al-Muqaffa'",
      note: 'Read in the original Arabic.',
      link: ''
    },
    { title: 'Alexander of Macedon', author: 'Harold Lamb', note: '', link: '' },
    { title: 'Notes from Underground', author: 'Fyodor Dostoevsky', note: '', link: '' },
    { title: 'Anna Karenina', author: 'Leo Tolstoy', note: '', link: '' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', note: '', link: '' }
  ],

  projects: [
    {
      id: 'meowf-investigations',
      title: 'Meowf Investigations',
      subtitle: 'Dog or cat CNN, with evidence',
      tagline: 'Dog or cat? A CNN trained from scratch that shows its evidence, and knows when a photo is neither.',
      quality: 'iridium',
      status: 'complete',
      stack: ['PyTorch', 'Grad-CAM', 'ONNX', 'Flask', 'Docker', 'NumPy', 'Render'],
      built:
        'A convolutional network built and trained from scratch in PyTorch on the Kaggle Dogs vs. Cats ' +
        'dataset, served live in a Flask app designed as a detective\'s case file. Every verdict comes with ' +
        'a Grad-CAM heatmap of the evidence behind it. A pretrained MobileNetV3 gatekeeper turns away photos ' +
        'with no dog or cat, and a results page shows the full evaluation: 81.5% accuracy, F1 0.815 and ' +
        'ROC AUC 0.894 on 4,960 held-out photos.',
      learned: [
        'A two-class model is confidently wrong outside its world: mine called a trash bag 97% "dog". ' +
          'That is why the gatekeeper exists.',
        'Check the evaluation itself. The Kaggle data contains duplicates (one photo is filed as both cat ' +
          'and dog), so I removed 42 near-duplicate test photos to rule out leakage.',
        'Deploying under constraints. PyTorch did not fit the free 512 MB server, so I exported the model ' +
          'to ONNX and rewrote the classifier head\'s backward pass in NumPy for Grad-CAM, checked against ' +
          'PyTorch autograd.',
        'Where the accuracy goes: 99% of the 16.9M parameters sit in one dense layer. Next steps are ' +
          'global average pooling, data augmentation and a fine-tuned ResNet to compare against.'
      ],
      skills: ['CNNs', 'Grad-CAM explainability', 'Model evaluation', 'ONNX deployment', 'Docker'],
      links: { live: 'https://meowf.onrender.com/', source: 'https://github.com/DevOm4rHl10/Meowf-Investigations' }
    },
    {
      id: 'overture',
      title: 'Overture',
      subtitle: 'Music discovery engine',
      tagline:
        'A Chrome extension that recommends artists you haven\'t heard yet, based on the ones you love, ' +
        'and explains every pick.',
      quality: 'iridium',
      status: 'complete',
      availability: 'Chrome Web Store release coming soon.',
      stack: ['JavaScript', 'Recommender systems', 'Last.fm API', 'Spotify API', 'Chrome extension', 'Node.js'],
      built:
        'Overture takes your top Spotify artists, or artists you type, gets similar artists from Last.fm, ' +
        'then ranks them. Each candidate is scored by how much you listen to the artists that led to it. ' +
        'Artists you already know are removed and duplicate pages merged. Scores are then re-weighted by ' +
        'how little known each artist is, so you get discoveries rather than the usual hits. Name matching ' +
        'works across Cyrillic, Greek, Arabic, Armenian and Georgian scripts.',
      learned: [
        'Measure before fixing. Before writing any name-matching code, I measured the problem on 14,690 ' +
          'artists from 57 language groups. That showed where cross-script duplicates concentrate, and ' +
          'that MusicBrainz IDs could not solve it: they confirmed 0 of 1,159 suspicious pairs.',
        'Prefer a missed match to a wrong one. One-word names merged different artists (Anastasia and ' +
          'Анастасија), so the transliteration layer never matches them. Result: 173 cross-script pairs ' +
          'merged on 32,264 names, with no false merge found.',
        'Popularity bias. Collaborative filtering favours popular artists, so I re-weighted candidates by ' +
          'listener count. With one global reference, the smallest music scene took 12 to 13 of the 20 ' +
          'places. Comparing each artist with its own scene fixed it.',
        'Turning experiments into product decisions. One setting already gave nearly all the effect ' +
          '(median listeners fell from about 17K to 6K), so the popup offers three modes instead of a slider.'
      ],
      skills: ['Recommender systems', 'Popularity-bias correction', 'Experiment design', 'Cross-script text matching'],
      links: { live: '', source: 'https://github.com/DevOm4rHl10/Overture' }
    },
    {
      id: 'gotham',
      title: 'Gotham',
      subtitle: 'UK crime harm hotspots',
      tagline:
        'Where does reported crime do the most harm across England, Wales and Northern Ireland? ' +
        'An interactive map of statistically tested hotspots, rebuilt every month.',
      quality: 'gold',
      status: 'complete',
      stack: ['Python', 'Spatial statistics', 'GitHub Actions', 'Leaflet', 'pytest'],
      built:
        'An interactive map built from 12 months of open police data. Each crime is weighted by how serious ' +
        'it is, grouped into equal-area hexagons (1.6 km nationally, 400 m at street level) and tested with ' +
        'Getis-Ord Gi* and a false discovery rate correction, so the map shows where harm is unusually ' +
        'concentrated, not just where crime counts are high. A month-by-month view answers a real question, ' +
        'do hotspots move? Mostly not: 76% of hotspot cells stayed hotspots from one month to the next, a ' +
        'typical month shared 6 of its top 10 with the 12-month top 10, and the top 1% of street-level areas ' +
        'held 18.3% of all recorded harm. The site is fully static and GitHub Actions rebuilds it every month. ' +
        'I built the first prototype (API scraper, neighbourhood centroids, HDBSCAN clustering, a Leaflet map) ' +
        'and developed the current method with the help of Claude, which also built the frontend.',
      learned: [
        'Question your first model. My prototype ran HDBSCAN on raw coordinates, but police locations are ' +
          'snapped to shared anonymous points, clustering counts every crime the same, and clusters come with ' +
          'no test of whether they are real. Hotspot statistics answered the actual question better.',
        'Get the data at the source. Querying the API around neighbourhood centroids left gaps in rural areas ' +
          'and failed silently in dense cities. The monthly bulk archive contains every crime.',
        'Testing thousands of areas at once finds hotspots by pure chance, so the results need a false ' +
          'discovery rate correction (Benjamini-Hochberg, at 1%).',
        'Turn a map into a finding. Measuring month-to-month overlap showed that the core hotspots stay put ' +
          'while the edge of the top 10 rotates, which matches what criminologists call the law of crime concentration.',
        'Show what is missing: Greater Manchester and Scotland publish no street-level data, so the site ' +
          'explains the gap instead of letting them look crime-free.'
      ],
      skills: ['Hotspot statistics (Gi*)', 'Multiple-testing correction', 'Geospatial data', 'Data pipelines', 'CI/CD'],
      links: { live: 'https://devom4rhl10.github.io/Gotham/', source: 'https://github.com/DevOm4rHl10/Gotham' }
    },
    {
      id: 'memory-manager',
      title: 'Memory manager',
      subtitle: 'Allocator in C',
      tagline: 'A memory allocator written in C, comparing allocation strategies and where each one fails.',
      status: 'in-progress',
      stage: 3,
      stack: ['C'],
      built: 'Almost finished: the full write-up arrives with its README.',
      learned: [],
      skills: [],
      links: { live: '', source: '' }
    },
    {
      id: 'my-git',
      title: 'My own Git',
      subtitle: 'Version control from scratch',
      tagline: 'A version-control system built from scratch, to understand what Git does under the hood.',
      status: 'in-progress',
      stage: 0,
      stack: [],
      built: 'Just planted: the full write-up arrives with its README.',
      learned: [],
      skills: [],
      links: { live: '', source: '' }
    }
  ]
};
