import type { UserStory } from '../types';

export const MOCK_STORIES: UserStory[] = [
  {
    id: 'story_me',
    userId: 'usr_me',
    userName: 'Your Story',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: false,
    stories: [
      {
        id: 'st_me_1',
        mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Morning typography sketching ✨',
        timestamp: '4h ago'
      }
    ]
  },
  {
    id: 'story_1',
    userId: 'usr_1',
    userName: 'Elena',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: true,
    stories: [
      {
        id: 'st_1_1',
        mediaUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Clay studio vibes today 🏺',
        timestamp: '1h ago'
      },
      {
        id: 'st_1_2',
        mediaUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'New glaze palette testing!',
        timestamp: '45m ago'
      }
    ]
  },
  {
    id: 'story_2',
    userId: 'usr_2',
    userName: 'Maya',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: true,
    stories: [
      {
        id: 'st_2_1',
        mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Sound check live from Hayes Valley 🎧',
        timestamp: '2h ago'
      }
    ]
  },
  {
    id: 'story_3',
    userId: 'usr_3',
    userName: 'Lucas',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: true,
    stories: [
      {
        id: 'st_3_1',
        mediaUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Marin Headlands hill repeats 🚴',
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: 'story_4',
    userId: 'usr_4',
    userName: 'Sophia',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: true,
    stories: [
      {
        id: 'st_4_1',
        mediaUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Vintage press machine running smoothly 📽️',
        timestamp: '5h ago'
      }
    ]
  },
  {
    id: 'story_5',
    userId: 'usr_6',
    userName: 'Chloe',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: false,
    stories: [
      {
        id: 'st_5_1',
        mediaUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Tasting note: wild herbs and citrus zest 🍷',
        timestamp: '6h ago'
      }
    ]
  },
  {
    id: 'story_6',
    userId: 'usr_10',
    userName: 'Isabella',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: true,
    stories: [
      {
        id: 'st_6_1',
        mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Flea market treasure finds today! 🧥',
        timestamp: '8h ago'
      }
    ]
  },
  {
    id: 'story_7',
    userId: 'usr_11',
    userName: 'Noah',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: false,
    stories: [
      {
        id: 'st_7_1',
        mediaUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Yosemite golden hour 🧗‍♂️',
        timestamp: '12h ago'
      }
    ]
  },
  {
    id: 'story_8',
    userId: 'usr_13',
    userName: 'Dante',
    userAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: true,
    stories: [
      {
        id: 'st_8_1',
        mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Fresh pasta extruded for tonight’s dinner 🍝',
        timestamp: '15h ago'
      }
    ]
  },
  {
    id: 'story_9',
    userId: 'usr_18',
    userName: 'Camille',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: true,
    stories: [
      {
        id: 'st_9_1',
        mediaUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Morning croissants hot from the deck oven 🥐',
        timestamp: '18h ago'
      }
    ]
  },
  {
    id: 'story_10',
    userId: 'usr_20',
    userName: 'Nadia',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    hasUnseenStories: false,
    stories: [
      {
        id: 'st_10_1',
        mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
        mediaType: 'image',
        durationSeconds: 5,
        caption: 'Checking telemetry feeds before observatory run 🔭',
        timestamp: '1d ago'
      }
    ]
  }
];
