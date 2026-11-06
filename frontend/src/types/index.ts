export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  size: string;
  bedType: string;
  image: string;
  amenities: string[];
  description: string;
  availableRooms: number;
}

export interface Review {
  id: string;
  author: string;
  country: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  city: string;
  country: string;
  address: string;
  stars: number;
  guestRating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPrice?: number;
  featuredImage: string;
  images: string[];
  description: string;
  amenities: string[];
  rooms: Room[];
  reviews: Review[];
  coordinates: {
    lat: number;
    lng: number;
  };
  highlights: string[];
  category: 'Resort' | 'Boutique' | 'Palace' | 'Ultra-Luxury';
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  hotelCount: number;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  startingPrice: number;
}

export interface SearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}
