export interface Pool {
  id: string;
  name: string;
  address: string;
  city: string;
  governorate?: string;
  latitude?: number;
  longitude?: number;
  length: '25m' | '50m';
  laneCount: number;
  coverType: 'indoor' | 'outdoor';
  isOlympicCertified: boolean;
  status: 'open' | 'closed' | 'maintenance';
  phone?: string;
  email?: string;
  imageUrl?: string;
}
