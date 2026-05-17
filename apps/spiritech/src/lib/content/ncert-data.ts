export interface ModelData {
  title: string
  modelUrl: string
  posterUrl: string
  attribution?: string
}

export interface VideoData {
  title: string
  youtubeId: string
  language: 'hi' | 'en'
  duration?: string
}

export interface PYQuestion {
  year: number
  question: string
  answer?: string
  marks?: number
  type: 'mcq' | 'short' | 'long'
}

export interface ChapterData {
  subjectSlug: string
  classNumber: number
  chapterNumber: number
  title: string
  slug: string
  description: string
  models: ModelData[]
  videos: VideoData[]
  pyQuestions: PYQuestion[]
}

export const NCERT_CHAPTERS: ChapterData[] = [
  // ── Science Class 6 ─────────────────────────────────────────────
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 1,
    title: 'Food: Where Does It Come From?',
    slug: 'class-6-science-ch1',
    description: 'Learn about food sources, plant parts we eat, and food chains.',
    models: [
      {
        title: 'Parts of a Plant',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/plant-parts.webp',
        attribution: 'Sketchfab CC0',
      },
    ],
    videos: [
      {
        title: 'Food: Where Does It Come From? - Full Chapter',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '14:22',
      },
    ],
    pyQuestions: [
      {
        year: 2024,
        question: 'Name two ingredients in your food that come from animals.',
        answer: 'Milk and eggs are two common food ingredients that come from animals.',
        marks: 2,
        type: 'short',
      },
      {
        year: 2024,
        question: 'What are herbivores? Give two examples.',
        answer: 'Animals that eat only plants are called herbivores. Examples: cow, deer.',
        marks: 2,
        type: 'short',
      },
      {
        year: 2023,
        question: 'Name the parts of a plant that we eat.',
        answer: 'We eat roots (carrot), stems (potato), leaves (spinach), flowers (broccoli), fruits (mango), and seeds (wheat).',
        marks: 3,
        type: 'short',
      },
    ],
  },
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 2,
    title: 'Components of Food',
    slug: 'class-6-science-ch2',
    description: 'Understand nutrients, balanced diet, and deficiency diseases.',
    models: [
      {
        title: 'Food Pyramid',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/food-pyramid.webp',
      },
    ],
    videos: [
      {
        title: 'Components of Food - Nutrients Explained',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '18:45',
      },
    ],
    pyQuestions: [
      {
        year: 2024,
        question: 'What is a balanced diet?',
        answer: 'A diet that contains all nutrients like carbohydrates, proteins, fats, vitamins, minerals, and water in adequate amounts.',
        marks: 2,
        type: 'short',
      },
    ],
  },
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 3,
    title: 'Fibre to Fabric',
    slug: 'class-6-science-ch3',
    description: 'Learn about natural and synthetic fibres and how fabrics are made.',
    models: [],
    videos: [
      {
        title: 'Fibre to Fabric - Complete Chapter',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '12:30',
      },
    ],
    pyQuestions: [],
  },
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 4,
    title: 'Sorting Materials into Groups',
    slug: 'class-6-science-ch4',
    description: 'Classify materials based on their properties like transparency, hardness, and solubility.',
    models: [],
    videos: [
      {
        title: 'Sorting Materials - Properties of Materials',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '15:10',
      },
    ],
    pyQuestions: [],
  },
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 5,
    title: 'Separation of Substances',
    slug: 'class-6-science-ch5',
    description: 'Methods of separating mixtures — filtration, evaporation, sedimentation.',
    models: [
      {
        title: 'Lab Apparatus - Filtration Setup',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/filtration.webp',
      },
    ],
    videos: [
      {
        title: 'Separation of Substances - All Methods',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '20:15',
      },
    ],
    pyQuestions: [
      {
        year: 2024,
        question: 'How can you separate a mixture of salt and sand?',
        answer: 'Add water to dissolve salt, filter to remove sand, then evaporate water to get salt back.',
        marks: 3,
        type: 'short',
      },
    ],
  },
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 6,
    title: 'Changes Around Us',
    slug: 'class-6-science-ch6',
    description: 'Reversible and irreversible changes in everyday life.',
    models: [],
    videos: [
      {
        title: 'Changes Around Us - Reversible & Irreversible',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '13:40',
      },
    ],
    pyQuestions: [],
  },
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 7,
    title: 'Getting to Know Plants',
    slug: 'class-6-science-ch7',
    description: 'Parts of plants — roots, stems, leaves, flowers, and their functions.',
    models: [
      {
        title: 'Flower Cross-Section',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/flower.webp',
        attribution: 'Sketchfab CC-BY',
      },
    ],
    videos: [
      {
        title: 'Getting to Know Plants - All Parts Explained',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '22:00',
      },
    ],
    pyQuestions: [
      {
        year: 2023,
        question: 'Draw and label the parts of a flower.',
        marks: 5,
        type: 'long',
      },
    ],
  },
  {
    subjectSlug: 'science',
    classNumber: 6,
    chapterNumber: 8,
    title: 'Body Movements',
    slug: 'class-6-science-ch8',
    description: 'Human skeleton, joints, and how animals move.',
    models: [
      {
        title: 'Human Skeleton',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/skeleton.webp',
        attribution: 'Sketchfab CC-BY',
      },
    ],
    videos: [
      {
        title: 'Body Movements - Skeleton and Joints',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '19:30',
      },
    ],
    pyQuestions: [
      {
        year: 2024,
        question: 'What are the different types of joints in the human body? Give examples.',
        answer: 'Ball and socket joint (shoulder), hinge joint (knee), pivot joint (neck), fixed joint (skull).',
        marks: 4,
        type: 'long',
      },
    ],
  },

  // ── Science Class 7 ─────────────────────────────────────────────
  {
    subjectSlug: 'science',
    classNumber: 7,
    chapterNumber: 1,
    title: 'Nutrition in Plants',
    slug: 'class-7-science-ch1',
    description: 'Photosynthesis, modes of nutrition in plants.',
    models: [
      {
        title: 'Photosynthesis Process',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/photosynthesis.webp',
      },
    ],
    videos: [
      {
        title: 'Nutrition in Plants - Photosynthesis',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '16:20',
      },
    ],
    pyQuestions: [],
  },
  {
    subjectSlug: 'science',
    classNumber: 7,
    chapterNumber: 2,
    title: 'Nutrition in Animals',
    slug: 'class-7-science-ch2',
    description: 'Human digestive system and nutrition in different animals.',
    models: [
      {
        title: 'Human Digestive System',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/digestive.webp',
        attribution: 'Sketchfab CC-BY',
      },
    ],
    videos: [
      {
        title: 'Nutrition in Animals - Digestive System',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '21:00',
      },
    ],
    pyQuestions: [],
  },

  // ── Science Class 8 ─────────────────────────────────────────────
  {
    subjectSlug: 'science',
    classNumber: 8,
    chapterNumber: 1,
    title: 'Crop Production and Management',
    slug: 'class-8-science-ch1',
    description: 'Agricultural practices, irrigation, and crop protection.',
    models: [],
    videos: [
      {
        title: 'Crop Production - Complete Chapter',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '17:45',
      },
    ],
    pyQuestions: [],
  },
  {
    subjectSlug: 'science',
    classNumber: 8,
    chapterNumber: 2,
    title: 'Microorganisms: Friend and Foe',
    slug: 'class-8-science-ch2',
    description: 'Types of microorganisms, their uses, and diseases they cause.',
    models: [
      {
        title: 'Bacteria Cell Structure',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/bacteria.webp',
      },
    ],
    videos: [
      {
        title: 'Microorganisms - Friend and Foe',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '19:10',
      },
    ],
    pyQuestions: [],
  },
  {
    subjectSlug: 'science',
    classNumber: 8,
    chapterNumber: 3,
    title: 'Cell — Structure and Functions',
    slug: 'class-8-science-ch3',
    description: 'Plant cell, animal cell, and cell organelles.',
    models: [
      {
        title: 'Animal Cell',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/animal-cell.webp',
        attribution: 'Sketchfab CC0',
      },
      {
        title: 'Plant Cell',
        modelUrl: '/models/placeholder.glb',
        posterUrl: '/posters/plant-cell.webp',
        attribution: 'Sketchfab CC0',
      },
    ],
    videos: [
      {
        title: 'Cell Structure - Plant vs Animal Cell',
        youtubeId: 'kFq5FGA_jnU',
        language: 'hi',
        duration: '23:30',
      },
    ],
    pyQuestions: [
      {
        year: 2024,
        question: 'Differentiate between plant cell and animal cell.',
        answer: 'Plant cell has cell wall, chloroplasts, and large vacuole. Animal cell lacks these but has centrioles.',
        marks: 5,
        type: 'long',
      },
    ],
  },
]

export function getChaptersBySubject(subjectSlug: string): ChapterData[] {
  return NCERT_CHAPTERS.filter((ch) => ch.subjectSlug === subjectSlug)
}

export function getChaptersBySubjectAndClass(subjectSlug: string, classNumber: number): ChapterData[] {
  return NCERT_CHAPTERS.filter((ch) => ch.subjectSlug === subjectSlug && ch.classNumber === classNumber)
}

export function getChapterBySlug(slug: string): ChapterData | undefined {
  return NCERT_CHAPTERS.find((ch) => ch.slug === slug)
}

export function getAvailableClasses(subjectSlug: string): number[] {
  const classes = new Set(NCERT_CHAPTERS.filter((ch) => ch.subjectSlug === subjectSlug).map((ch) => ch.classNumber))
  return Array.from(classes).sort()
}
