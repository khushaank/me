export interface PostContent {
  title: string;
  subtitle: string;
  collection: string;
  content: string;
  detailContent: string;
}

export interface BlogPost {
  id: number;
  year: string;
  image: string;
  fr: PostContent;
  en: PostContent;
}

export const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    year: "2024",
    image: "/images/hero-art.jpg",
    fr: {
      title: "La Pierre Silencieuse",
      subtitle: "Sur le temps, l'érosion et la mémoire",
      collection: "Notes de nature",
      content: "Je suis resté longtemps devant un morceau de calcaire blanc cassé non poli. Sa surface était parsemée de cratères comme un paysage lunaire, enregistrant les marées et les vents d'il y a des millions d'années.",
      detailContent: "Cette pierre provient d'une carrière en Toscane. Quand je l'ai vue pour la première fois, le crépuscule s'installait et le soleil couchant filtrait par la fenêtre, jetant des ombres inégales sur la surface rugueuse. Ces dépressions apparemment aléatoires cachaient un ordre sous-jacent.",
    },
    en: {
      title: "The Silent Stone",
      subtitle: "On Time, Weathering, and Memory",
      collection: "Nature Notes",
      content: "I stood for a long time before an unpolished piece of off-white limestone. Its surface was densely pocked with craters like the lunar landscape, recording the tides and winds of millions of years ago. Rock never lies — it simply and silently displays the texture of time.",
      detailContent: "This stone came from a quarry in Tuscany. When I first saw it, dusk was settling in, and the setting sun slanted through the window, casting uneven shadows across the rough surface. Those seemingly random depressions concealed an underlying order — each groove corresponded to a seasonal cycle of thermal expansion and contraction, each cavity was once the imprint left by dissolved minerals.",
    },
  },
  {
    id: 2,
    year: "2024",
    image: "/images/blog-1.jpg",
    fr: {
      title: "La forme de l'eau vive",
      subtitle: "L'écriture naturelle sous longue exposition",
      collection: "Notes de photographie",
      content: "J'ai enregistré un ruisseau de montagne avec une exposition de trois minutes. L'eau en mouvement s'est transformée sur le négatif en rubans de soie blanche.",
      detailContent: "L'automne dernier, j'ai trouvé ce ruisseau discret sur les versants sud des Alpes. Né de la fonte des glaciers, il traversait une forêt de sapins avant de rejoindre une rivière plus importante en aval.",
    },
    en: {
      title: "The Shape of Flowing Water",
      subtitle: "Long Exposure as Natural Writing",
      collection: "Photography Notes",
      content: "I recorded a mountain stream with a three-minute exposure. The flowing water transformed on the negative into silken white ribbons. The hardness of the rock and the softness of the water formed an eternal dialogue — the oldest dialectic in nature.",
      detailContent: "Last late autumn, I found this unremarkable stream on the southern slopes of the Alps. Born from glacial meltwater, it passed through a fir forest before joining a larger river downstream. The water volume was modest, but the gradient was just right, creating layer upon layer of small waterfalls between the rocks.",
    },
  },
  {
    id: 3,
    year: "2023",
    image: "/images/blog-2.jpg",
    fr: {
      title: "Les dieux dans le jardin",
      subtitle: "Sculpture classique et regard contemporain",
      collection: "Archives d'art",
      content: "Dans un jardin italien du XVIIIe siècle, plusieurs bustes gisent parmi les herbes folles. Ils incarnaient autrefois l'idéal de la forme humaine parfaite, mais ce ne sont plus que des ruines enlacées de vignes.",
      detailContent: "Ce jardin appartenait à un monastère abandonné. Selon les archives locales, ces sculptures étaient à l'origine placées dans un labyrinthe de haies méticuleusement taillées.",
    },
    en: {
      title: "The Gods in the Garden",
      subtitle: "Classical Sculpture and Contemporary Gaze",
      collection: "Art Archive",
      content: "In an eighteenth-century Italian garden, several busts lay scattered among the wild grass. They once embodied the ideal of perfect human form, but now they are ruins entwined with vines. The gap between beauty and decay is precisely what makes them most moving.",
      detailContent: "This garden belonged to an abandoned monastery. According to local archives, these sculptures were originally placed within a meticulously trimmed hedge maze, with a classical deity positioned at every turn to provide visual anchors for meditators.",
    },
  },
  {
    id: 4,
    year: "2023",
    image: "/images/blog-4.jpg",
    fr: {
      title: "Traces d'encre sur la ville",
      subtitle: "Tests de Rorschach et gratte-ciel",
      collection: "Expériences visuelles",
      content: "J'ai superposé des tests de Rorschach sur la silhouette d'une ville, créant un champ visuel suspendu entre la réalité et le subconscient.",
      detailContent: "Cette série est née d'une superposition accidentelle. À l'époque, j'organisais deux documents totalement sans rapport : un ensemble de photographies de gratte-ciel de New York des années 1950 et des cartes de taches d'encre de Rorschach.",
    },
    en: {
      title: "Ink Marks on the City",
      subtitle: "Rorschach Tests and Skyscrapers",
      collection: "Visual Experiments",
      content: "I overlaid Rorschach inkblot tests from psychology onto a city skyline, creating a visual field suspended between reality and the subconscious. Where the rational order of architecture meets the chaotic randomness of ink, unexpected narrative tension is born.",
      detailContent: "This series was born from an accidental overlay. At the time, I was organizing two entirely unrelated materials: a set of upward-looking photographs of 1950s New York skyscrapers, and Rorschach inkblot cards invented by the Swiss psychologist. Both spread out on my desk, I accidentally placed an inkblot card on top of a city photograph.",
    },
  },
  {
    id: 5,
    year: "2024",
    image: "/images/blog-5.jpg",
    fr: {
      title: "Terre et Feu",
      subtitle: "Notes sur la fabrication de deux récipients en argile",
      collection: "Notes d'artisanat",
      content: "Pendant deux semaines à Jingdezhen, j'ai étudié le tournage avec un maître artisan. Ces deux récipients en terre cuite avec des couvercles en forme de flamme sont mes pièces de diplôme.",
      detailContent: "Le matin de mon arrivée à Jingdezhen, une pluie légère tombait. L'air portait cette odeur distinctive de terre humidifiée.",
    },
    en: {
      title: "Earth and Fire",
      subtitle: "Notes on Making Two Clay Vessels",
      collection: "Craft Notes",
      content: "During two weeks in Jingdezhen, I studied wheel-throwing under a master craftsman. These two terracotta vessels with flame-shaped lids are my graduation pieces — their rough surfaces still bear the imprint of fingertips, the most direct trace of dialogue between human hands and clay.",
      detailContent: "The morning I arrived in Jingdezhen, a light rain was falling. The air carried that distinctive scent of dampened earth. I stayed at a guesthouse near the old factory, walking every morning along a stone path to the studio, passing rows of half-finished pieces awaiting their turn in the kiln.",
    },
  },
  {
    id: 6,
    year: "2023",
    image: "/images/blog-6.jpg",
    fr: {
      title: "Laissez parler les fleurs",
      subtitle: "Un journal intime des plantes",
      collection: "Notes de vie",
      content: "Une pensée cueillie dans le jardin au printemps a été soigneusement pressée dans la page de garde d'un vieux livre. Six mois plus tard, les pétales avaient séché et changé de couleur.",
      detailContent: "Ce journal a commencé un après-midi de mars l'année dernière, une journée sans rien de particulier à faire. J'étais assis dans le jardin, profitant du soleil, quand j'ai remarqué une petite pensée poussant dans la fissure entre les pierres.",
    },
    en: {
      title: "Let the Flowers Speak",
      subtitle: "A Private Journal of Plants",
      collection: "Life Notes",
      content: "A pansy picked from the garden in spring was carefully pressed into the flyleaf of an old book. Six months later, the petals had dried and changed color, yet still held their approximate shape. Beside it, I wrote about that afternoon — the sunlight, the breeze, and a robin perched on the railing.",
      detailContent: "This journal began on a March afternoon last year, a day with nothing in particular to do. I was sitting in the garden, soaking up the sun, when I noticed a tiny pansy growing in the crack between stones. Its purple petals stood out vividly against the grey-white stone, like an intruder, or perhaps a messenger.",
    },
  },
];
