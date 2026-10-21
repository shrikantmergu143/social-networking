import type { FeedPost } from '../types';

export const MOCK_POSTS: FeedPost[] = [
  {
    id: 'post_1',
    userId: 'usr_1',
    author: {
      id: 'usr_1',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Mission Clay Studio, SF'
    },
    caption: 'Fired the first series of matte terracotta vessels this morning. Embracing the slight imperfections in glaze cooling — that’s where the character breathes.',
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 284,
    commentsCount: 18,
    sharesCount: 14,
    createdAt: '25m ago',
    isLiked: false,
    isSaved: true,
    tags: ['Ceramics', 'Handmade', 'Craft', 'Terracotta'],
    visibility: 'public',
    comments: [
      {
        id: 'c_101',
        postId: 'post_1',
        userId: 'usr_me',
        userName: 'Alex Morgan',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        userVerified: true,
        text: 'The proportion on that second vase is remarkable Elena! Did you throw it off the hump?',
        createdAt: '18m ago',
        likesCount: 5,
        isLiked: true,
        replies: [
          {
            id: 'c_102',
            postId: 'post_1',
            userId: 'usr_1',
            userName: 'Elena Rostova',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            userVerified: true,
            text: 'Thank you Alex! Yes, centered about 3kg and pulled up slowly with rib tools.',
            createdAt: '12m ago',
            likesCount: 3
          }
        ]
      },
      {
        id: 'c_103',
        postId: 'post_1',
        userId: 'usr_6',
        userName: 'Chloe Dupont',
        userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
        userVerified: true,
        text: 'I need one of these for the gallery opening next month! Gorgeous textures.',
        createdAt: '15m ago',
        likesCount: 2
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'usr_2',
    author: {
      id: 'usr_2',
      name: 'Maya Lin',
      username: 'mayalin',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Hayes Valley Rooftop'
    },
    caption: 'Sunset sound check before tonight’s ambient synth showcase. The Golden Gate fog rolled right across the skyline right on beat.',
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 412,
    commentsCount: 24,
    sharesCount: 31,
    createdAt: '1h ago',
    isLiked: true,
    isSaved: false,
    tags: ['Synths', 'Ambient', 'SoundDesign', 'SanFrancisco'],
    visibility: 'public',
    comments: [
      {
        id: 'c_201',
        postId: 'post_2',
        userId: 'usr_9',
        userName: 'Kenji Sato',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        userVerified: true,
        text: 'Are you running the Prophet-6 through that analog tape delay setup?',
        createdAt: '45m ago',
        likesCount: 4
      }
    ]
  },
  {
    id: 'post_3',
    userId: 'usr_3',
    author: {
      id: 'usr_3',
      name: 'Lucas Vance',
      username: 'lucas_vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Marin Headlands'
    },
    caption: '100km coastal loop before breakfast. Cold pacific mist on Hawk Hill never gets old.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 195,
    commentsCount: 9,
    sharesCount: 6,
    createdAt: '2h ago',
    isLiked: false,
    isSaved: false,
    tags: ['Cycling', 'Marin', 'MorningRide'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_4',
    userId: 'usr_me',
    author: {
      id: 'usr_me',
      name: 'Alex Morgan',
      username: 'alexmorgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Design Quarter Studio'
    },
    caption: 'Finalizing typographic spacing rules for our upcoming design system release. Obsessing over 4px vertical grid cadence and optical rhythm.',
    images: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 167,
    commentsCount: 12,
    sharesCount: 8,
    createdAt: '3h ago',
    isLiked: true,
    isSaved: false,
    tags: ['DesignSystems', 'Typography', 'UIUX'],
    visibility: 'public',
    comments: [
      {
        id: 'c_401',
        postId: 'post_4',
        userId: 'usr_1',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        userVerified: true,
        text: 'The font pairings here are so clean. Love the tabular figure alignment!',
        createdAt: '2h ago',
        likesCount: 3
      }
    ]
  },
  {
    id: 'post_5',
    userId: 'usr_4',
    author: {
      id: 'usr_4',
      name: 'Sophia Chen',
      username: 'sophia_chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Castro Theatre'
    },
    caption: '35mm frame captures from our documentary shoot on San Francisco independent print houses. The smells of ink and vintage offset rollers are unforgettable.',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 520,
    commentsCount: 33,
    sharesCount: 42,
    createdAt: '4h ago',
    isLiked: false,
    isSaved: true,
    tags: ['Film', '35mm', 'Documentary', 'Print'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_6',
    userId: 'usr_5',
    author: {
      id: 'usr_5',
      name: 'Julian Reid',
      username: 'julian_reid',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      isVerified: false,
      location: 'Tartine Workshop'
    },
    caption: '36-hour cold fermented heritage sourdough loaves straight out of the hearth. High hydration, open crumb, deep blistered crust.',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 340,
    commentsCount: 22,
    sharesCount: 19,
    createdAt: '5h ago',
    isLiked: true,
    isSaved: true,
    tags: ['Sourdough', 'Baking', 'Fermentation', 'ArtisanBread'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_7',
    userId: 'usr_6',
    author: {
      id: 'usr_6',
      name: 'Chloe Dupont',
      username: 'chloe_dupont',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Vermentino Natural Wine Bar'
    },
    caption: 'Skin-contact orange wine from Mount Etna volcanic slopes paired with fresh grilled artichokes. Proof that nature does the best alchemy.',
    images: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 278,
    commentsCount: 16,
    sharesCount: 11,
    createdAt: '6h ago',
    isLiked: false,
    isSaved: false,
    tags: ['NaturalWine', 'Sommelier', 'Etna'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_8',
    userId: 'usr_7',
    author: {
      id: 'usr_7',
      name: 'Marcus Kane',
      username: 'marcus_kane',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Dogpatch Woodworks'
    },
    caption: 'Hand-shaped Japanese joinery on a solid walnut console table. No screws or metal fasteners, just friction, precision, and walnut dowels.',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 395,
    commentsCount: 27,
    sharesCount: 23,
    createdAt: '8h ago',
    isLiked: true,
    isSaved: true,
    tags: ['Woodworking', 'Joinery', 'Craftsmanship'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_9',
    userId: 'usr_8',
    author: {
      id: 'usr_8',
      name: 'Zara Alvarez',
      username: 'zara_alvarez',
      avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed280b8b?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'SF Conservatory of Flowers'
    },
    caption: 'Rare flowering epiphytic orchid in full bloom. The fragrance is a mix of vanilla and damp cedarwood.',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 460,
    commentsCount: 31,
    sharesCount: 18,
    createdAt: '9h ago',
    isLiked: false,
    isSaved: false,
    tags: ['Botany', 'Orchids', 'Greenhouse'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_10',
    userId: 'usr_10',
    author: {
      id: 'usr_10',
      name: 'Isabella Moretti',
      username: 'isabella_moretti',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Alemany Flea Market'
    },
    caption: 'Found an original 1974 tailored trench coat and silk foulard scarf this morning. Vintage hunting is pure mindfulness.',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 610,
    commentsCount: 48,
    sharesCount: 35,
    createdAt: '11h ago',
    isLiked: true,
    isSaved: true,
    tags: ['VintageStyle', 'Thrifting', 'FashionDesign'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_11',
    userId: 'usr_11',
    author: {
      id: 'usr_11',
      name: 'Noah Sterling',
      username: 'noah_sterling',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Yosemite Valley'
    },
    caption: 'First light breaking over El Capitan wall. Pitch 12 wake-up views with coffee in the portaledge.',
    images: [
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 840,
    commentsCount: 62,
    sharesCount: 77,
    createdAt: '14h ago',
    isLiked: true,
    isSaved: false,
    tags: ['Climbing', 'Yosemite', 'Adventure'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_12',
    userId: 'usr_12',
    author: {
      id: 'usr_12',
      name: 'Talia Almond',
      username: 'talia_almond',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
      isVerified: false,
      location: 'City Lights Bookstore'
    },
    caption: '“To love is to recognize yourself in another.” Poetry reading tonight in the basement poetry room at 7pm.',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 310,
    commentsCount: 19,
    sharesCount: 22,
    createdAt: '16h ago',
    isLiked: false,
    isSaved: true,
    tags: ['Poetry', 'CityLights', 'Books'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_13',
    userId: 'usr_13',
    author: {
      id: 'usr_13',
      name: 'Dante Silva',
      username: 'dante_silva',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Pop-up Table 24'
    },
    caption: 'Hand-rolled buckwheat tajarin pasta with wild foraged morel mushrooms and aged mountain butter.',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 512,
    commentsCount: 37,
    sharesCount: 28,
    createdAt: '18h ago',
    isLiked: true,
    isSaved: false,
    tags: ['Pasta', 'ChefLife', 'Foraging'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_14',
    userId: 'usr_14',
    author: {
      id: 'usr_14',
      name: 'Ananya Sen',
      username: 'ananya_sen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Davies Symphony Hall'
    },
    caption: 'Brahms Violin Concerto rehearsal. The tension in the second movement adagio is sheer heartbreak.',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 290,
    commentsCount: 15,
    sharesCount: 10,
    createdAt: '20h ago',
    isLiked: false,
    isSaved: false,
    tags: ['Violin', 'Symphony', 'ClassicalMusic'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_15',
    userId: 'usr_15',
    author: {
      id: 'usr_15',
      name: 'Liam Gallagher',
      username: 'liam_gallagher',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Ocean Beach VFW'
    },
    caption: 'Clean 6-foot offshore waves this morning. Stoked to share the lineup with dolphins.',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 388,
    commentsCount: 21,
    sharesCount: 14,
    createdAt: '1d ago',
    isLiked: true,
    isSaved: false,
    tags: ['Surfing', 'OceanBeach', 'MorningWaves'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_16',
    userId: 'usr_16',
    author: {
      id: 'usr_16',
      name: 'Zoe Thorne',
      username: 'zoe_kravitz_fan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Inner Sunset Studio'
    },
    caption: 'Natural indigo dye batch fresh from oxidation. That electric green-to-deep-navy shift is pure magic every time.',
    images: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 260,
    commentsCount: 14,
    sharesCount: 9,
    createdAt: '1d ago',
    isLiked: false,
    isSaved: true,
    tags: ['Indigo', 'NaturalDyes', 'Textiles'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_17',
    userId: 'usr_17',
    author: {
      id: 'usr_17',
      name: 'Felix Bauer',
      username: 'felix_bauer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Presidio Tunnel Tops'
    },
    caption: 'Native California bunchgrasses planted 2 years ago are thriving and humming with native bees.',
    images: [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 315,
    commentsCount: 18,
    sharesCount: 13,
    createdAt: '1d ago',
    isLiked: false,
    isSaved: false,
    tags: ['LandscapeArchitecture', 'Ecology', 'NativePlants'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_18',
    userId: 'usr_18',
    author: {
      id: 'usr_18',
      name: 'Camille Laurent',
      username: 'camille_laurent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Pastry Lab'
    },
    caption: 'Laminated croissant dough with French Isigny butter. 27 layers of flaky, golden perfection.',
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 670,
    commentsCount: 54,
    sharesCount: 39,
    createdAt: '2d ago',
    isLiked: true,
    isSaved: true,
    tags: ['Croissant', 'Pastry', 'Viennoiserie'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_19',
    userId: 'usr_19',
    author: {
      id: 'usr_19',
      name: 'Oscar Vance',
      username: 'oscar_wild',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Castro Print House'
    },
    caption: 'Issue No. 4 of “Quiet Spaces” magazine is off the presses. Letterpress printed on handmade mulberry paper.',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 420,
    commentsCount: 29,
    sharesCount: 26,
    createdAt: '2d ago',
    isLiked: false,
    isSaved: true,
    tags: ['Letterpress', 'PrintMagazine', 'Editorial'],
    visibility: 'public',
    comments: []
  },
  {
    id: 'post_20',
    userId: 'usr_20',
    author: {
      id: 'usr_20',
      name: 'Nadia Kassem',
      username: 'nadia_kassem',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
      location: 'Chabot Space & Science Center'
    },
    caption: 'Stargazing session with the 36-inch refractor telescope. Saturn’s rings were razor sharp tonight.',
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'
    ],
    likesCount: 790,
    commentsCount: 67,
    sharesCount: 52,
    createdAt: '2d ago',
    isLiked: true,
    isSaved: true,
    tags: ['Astronomy', 'Saturn', 'Telescope', 'SpaceScience'],
    visibility: 'public',
    comments: []
  }
];
