import type { Hotel, Destination } from '../types';

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    hotelCount: 142,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    startingPrice: 420
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    hotelCount: 215,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    startingPrice: 380
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Indian Ocean',
    hotelCount: 68,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 3.2028, lng: 73.2207 },
    startingPrice: 650
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    hotelCount: 180,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    startingPrice: 310
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'United States',
    hotelCount: 195,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    startingPrice: 450
  },
  {
    id: 'istanbul',
    name: 'Istanbul',
    country: 'Turkey',
    hotelCount: 134,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    coordinates: { lat: 41.0082, lng: 28.9784 },
    startingPrice: 290
  }
];

export const HOTELS_DATA: Hotel[] = [
  {
    id: 'burj-al-arab',
    name: 'Burj Al Arab Jumeirah',
    tagline: 'The world’s most iconic sail-shaped ultra-luxury landmark',
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Umm Suqeim 3, Jumeirah Beach Road, Dubai',
    stars: 5,
    guestRating: 4.95,
    reviewCount: 1420,
    pricePerNight: 1250,
    originalPrice: 1550,
    category: 'Ultra-Luxury',
    featuredImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Standing on its own private man-made island, Burj Al Arab Jumeirah sets the global benchmark for legendary hospitality. Featuring duplex suites with 24-carat gold accents, private butler service, Michelin-starred fine dining, and an infinity pool terrace suspended over the Arabian Gulf.',
    amenities: [
      'Private Island Access',
      'Helipad Arrival Service',
      'Rolls-Royce Chauffeur',
      'Infinity Beach Club',
      'Talise Spa Sanctuary',
      '9 Signature Restaurants',
      '24/7 Personal Butler',
      'Private Beachfront'
    ],
    highlights: ['Iconic 321m Sail Architecture', 'Duplex Suites Only', 'Suspended Skyview Bar'],
    coordinates: { lat: 25.1412, lng: 55.1852 },
    rooms: [
      {
        id: 'deluxe-marina-suite',
        name: 'Deluxe Marina Duplex Suite',
        type: 'Duplex Suite',
        capacity: 2,
        pricePerNight: 1250,
        size: '170 m²',
        bedType: '1 King Size Bed',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
        amenities: ['Arabian Gulf View', 'Hermès Toiletries', 'Jacuzzi with View', 'Interactive Butler'],
        description: 'Immaculately appointed two-story suite offering floor-to-ceiling glass panoramic views across the Arabian Sea.',
        availableRooms: 4
      },
      {
        id: 'panoramic-suite',
        name: 'Panoramic Sky View Suite',
        type: 'Royal Duplex',
        capacity: 4,
        pricePerNight: 2100,
        size: '225 m²',
        bedType: '2 King Beds',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        amenities: ['180° Panoramic View', 'Private Dining Room', 'Luxury Bar Lounge', 'Spa Bathroom'],
        description: 'Sprawling master suite perched high in the clouds with expansive 180-degree sunset ocean vistas.',
        availableRooms: 2
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Lord Sebastian H.',
        country: 'United Kingdom',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'Unrivaled in every dimension. The private butler and the helicopter transfer made our anniversary unforgettable.'
      },
      {
        id: 'rev-2',
        author: 'Elena Rostova',
        country: 'Monaco',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'The terrace pool hovering over the gulf is pure architectural brilliance. Service is beyond perfection.'
      }
    ]
  },
  {
    id: 'soneva-jani',
    name: 'Soneva Jani Resort & Water Villas',
    tagline: 'Overwater lagoon sanctuaries with retractable roofs for stargazing',
    city: 'Noonu Atoll',
    country: 'Maldives',
    address: 'Medhufaru Island, Noonu Atoll, Maldives',
    stars: 5,
    guestRating: 4.98,
    reviewCount: 890,
    pricePerNight: 1680,
    originalPrice: 1950,
    category: 'Resort',
    featuredImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Encircled by 5.6 kilometers of crystal-clear turquoise private lagoon, Soneva Jani represents the pinnacle of barefoot sustainable luxury. Famous for its overwater villas with water slides directly into the ocean and retractable master bedroom roofs.',
    amenities: [
      'Private Lagoon Access',
      'Seaplane Transfer',
      'Overwater Cinema Paradiso',
      'Observatory Stargazing Lounge',
      'Private Water Slide into Ocean',
      'Ayurvedic Wellness Spa',
      'Organic Garden Dining'
    ],
    highlights: ['Retractable Roof Stargazing', 'Private Ocean Water Slide', 'Eco-Luxury Design'],
    coordinates: { lat: 5.8672, lng: 73.3444 },
    rooms: [
      {
        id: 'water-retreat-slide',
        name: 'One-Bedroom Water Retreat with Slide',
        type: 'Overwater Villa',
        capacity: 2,
        pricePerNight: 1680,
        size: '411 m²',
        bedType: '1 King Bed',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
        amenities: ['Curved Water Slide', 'Private Pool', 'Retractable Roof', 'Catamaran Net Daybeds'],
        description: 'Exquisite overwater villa with private freshwater pool and curved slide descending into the turquoise lagoon.',
        availableRooms: 3
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Christian Weber',
        country: 'Switzerland',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'November 2026',
        comment: 'Sleeping beneath the open stars with the gentle ocean breeze was a transcendent experience.'
      }
    ]
  },
  {
    id: 'ritz-paris',
    name: 'Ritz Paris',
    tagline: 'Timeless Parisian elegance on Place Vendôme since 1898',
    city: 'Paris',
    country: 'France',
    address: '15 Place Vendôme, 75001 Paris, France',
    stars: 5,
    guestRating: 4.92,
    reviewCount: 1670,
    pricePerNight: 980,
    originalPrice: 1200,
    category: 'Palace',
    featuredImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Steeped in French art de vivre, the Ritz Paris on prestigious Place Vendôme has played host to royalty, writers, and luminaries including Coco Chanel and Ernest Hemingway. Boasting grand neoclassical interiors, gilded woodwork, and the famed Bar Hemingway.',
    amenities: [
      'Bar Hemingway',
      'Chanel Spa Retreat',
      'Subterranean Mosaic Pool',
      'Grand French Garden',
      'Michelin-Starred Dining',
      'Boutique Arcade',
      'VIP Airport Meet & Greet'
    ],
    highlights: ['Place Vendôme Landmark', 'Chanel Wellness Sanctuary', 'Historic Suite Collection'],
    coordinates: { lat: 48.8681, lng: 2.3292 },
    rooms: [
      {
        id: 'deluxe-room-vendome',
        name: 'Grand Deluxe Room Vendôme',
        type: 'Deluxe Room',
        capacity: 2,
        pricePerNight: 980,
        size: '55 m²',
        bedType: '1 King Bed',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
        amenities: ['Garden View', 'Marble Fireplace', 'Swan Gilt Faucets', 'Ritz Sound System'],
        description: 'Authentic 18th-century French luxury with antique furnishings and a sumptuous Carrara marble bathroom.',
        availableRooms: 5
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Marie de Guise',
        country: 'France',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'Nowhere in Paris equals the legendary grace and warm grandeur of the Ritz.'
      }
    ]
  },
  {
    id: 'aman-tokyo',
    name: 'Aman Tokyo',
    tagline: 'An urban sanctuary hovering in the clouds above the Otemachi financial district',
    city: 'Tokyo',
    country: 'Japan',
    address: 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo',
    stars: 5,
    guestRating: 4.96,
    reviewCount: 920,
    pricePerNight: 890,
    category: 'Ultra-Luxury',
    featuredImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Occupying the top six floors of the Otemachi Tower, Aman Tokyo seamlessly blends classic Japanese aesthetic architecture—washi paper screens, camphor wood, and granite—with monumental urban luxury and breathtaking views of Mount Fuji.',
    amenities: [
      '30-Meter Basalt Sky Pool',
      'Traditional Japanese Onsen',
      'Panoramic Mount Fuji Vistas',
      'Engawa Lounge & Cigar Room',
      'Signature Aman Spa',
      'World-Class Edomae Sushi Bar'
    ],
    highlights: ['30m Heated Sky Pool', 'Mount Fuji Horizons', 'Architectural Washi Lantern Lobby'],
    coordinates: { lat: 35.6865, lng: 139.7645 },
    rooms: [
      {
        id: 'premier-room-fuji',
        name: 'Premier Room (Mount Fuji View)',
        type: 'Premier Suite',
        capacity: 2,
        pricePerNight: 890,
        size: '80 m²',
        bedType: '1 King Bed',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
        amenities: ['Furo Soaking Tub', 'Floor-to-Ceiling Windows', 'Washi Sliding Doors', 'Tea Ceremony Set'],
        description: 'Serene minimalist sanctuary featuring an authentic deep basalt soaking tub facing the Tokyo skyline.',
        availableRooms: 3
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Kenji Takahashi',
        country: 'Japan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'August 2026',
        comment: 'The silence and architectural harmony 38 floors above Tokyo is soothing for the soul.'
      }
    ]
  },
  {
    id: 'the-plaza-ny',
    name: 'The Plaza Hotel',
    tagline: 'Fifth Avenue landmark of timeless Gilded Age splendor overlooking Central Park',
    city: 'New York',
    country: 'United States',
    address: '768 5th Ave, New York, NY 10019',
    stars: 5,
    guestRating: 4.88,
    reviewCount: 2400,
    pricePerNight: 920,
    originalPrice: 1100,
    category: 'Palace',
    featuredImage: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Since 1907, The Plaza has defined New York luxury hospitality at the prestigious corner of Fifth Avenue and Central Park South. Featuring the iconic Palm Court for high tea, the Champagne Bar, and Guerlain Spa.',
    amenities: [
      'Central Park Views',
      'The Palm Court Afternoon Tea',
      'Guerlain Spa Wellness',
      'White-Glove Butler Staff',
      'Limousine Town Car Service',
      'Historic Grand Ballroom'
    ],
    highlights: ['Corner of 5th Ave & Central Park', 'Iconic Palm Court', '24-Carat Gold-Plated Fixtures'],
    coordinates: { lat: 40.7645, lng: -73.9744 },
    rooms: [
      {
        id: 'park-view-suite',
        name: 'Edwardian Park View Suite',
        type: 'Park Suite',
        capacity: 2,
        pricePerNight: 920,
        size: '95 m²',
        bedType: '1 King Bed',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
        amenities: ['Direct Central Park View', 'Separate Parlor Room', 'Gold-plated Sherle Wagner Fixtures'],
        description: 'Spectacular suite with soaring 14-foot ceilings framing unobstructed views of Central Park.',
        availableRooms: 2
      }
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Sarah Jenkins',
        country: 'Canada',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'October 2026',
        comment: 'Pure New York magic. The history, the location, and the service make you feel like royalty.'
      }
    ]
  },
  {
    id: 'ciragan-palace',
    name: 'Çırağan Palace Kempinski',
    tagline: 'An authentic 19th-century Ottoman imperial palace resting on the shores of the Bosphorus',
    city: 'Istanbul',
    country: 'Turkey',
    address: 'Çırağan Cd. No:32, 34349 Beşiktaş, Istanbul',
    stars: 5,
    guestRating: 4.93,
    reviewCount: 1350,
    pricePerNight: 780,
    originalPrice: 950,
    category: 'Palace',
    featuredImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The only Ottoman Imperial Palace and Hotel on the Bosphorus strait. Offering a resort ambiance in the heart of Istanbul with an iconic heated infinity pool that kisses the strait waters, historic Sultan suites, and world-renowned Turkish hospitality.',
    amenities: [
      'Bosphorus Waterfront Terrace',
      'Heated Infinity Pool on the Strait',
      'Historic Ottoman Palace Suites',
      'Luxury Yacht Transfer',
      'Authentic Turkish Hammam & Spa',
      'Sultan Dining Experiences'
    ],
    highlights: ['Real 19th Century Ottoman Palace', 'Bosphorus Edge Infinity Pool', 'Private Yacht Docking'],
    coordinates: { lat: 41.0439, lng: 29.0165 },
    rooms: [
      {
        id: 'palace-bosphorus-suite',
        name: 'Palace Bosphorus Suite',
        type: 'Palace Suite',
        capacity: 2,
        pricePerNight: 780,
        size: '88 m²',
        bedType: '1 King Bed',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        amenities: ['Private Bosphorus Balcony', 'Handmade Turkish Carpets', 'Ottoman Architecture', '24h Butler'],
        description: 'Lavish suite directly facing the waters where continents meet, complete with private balcony and palace privileges.',
        availableRooms: 3
      }
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Tariq Al-Mansoor',
        country: 'Kuwait',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'Dining by the Bosphorus watching the yachts glide past while staying in a genuine imperial palace is breathtaking.'
      }
    ]
  }
];
