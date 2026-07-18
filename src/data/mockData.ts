// VitaLink Mock Data - Indian Blood Donation Platform

export interface Donor {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  city: string;
  state: string;
  contactNumber: string;
  isAvailable: boolean;
  donationCount: number;
  lastDonation?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  contactNumber: string;
  isSubscribed: boolean;
  subscriptionExpiry?: string;
  availableBloodTypes: string[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  hospitalId: string;
  donorId?: string;
  status: 'pending' | 'matched' | 'completed' | 'cancelled';
  requestedAt: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Transaction {
  id: string;
  type: 'subscription' | 'maintenance';
  hospitalId: string;
  amount: number;
  timestamp: string;
  description: string;
}

// Sample Donors with Telugu and Indian Names
export const mockDonors: Donor[] = [
  {
    id: 'donor-1',
    name: 'Ravi Teja Reddy',
    age: 28,
    bloodGroup: 'O+',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543210',
    isAvailable: true,
    donationCount: 3,
    lastDonation: '2024-01-15',
    location: { lat: 16.2973, lng: 80.4367 }
  },
  {
    id: 'donor-2',
    name: 'Lakshmi Priya Devi',
    age: 25,
    bloodGroup: 'A+',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543211',
    isAvailable: true,
    donationCount: 2,
    lastDonation: '2024-02-20',
    location: { lat: 16.5062, lng: 80.6480 }
  },
  {
    id: 'donor-3',
    name: 'Anil Kumar Sharma',
    age: 32,
    bloodGroup: 'B+',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543212',
    isAvailable: false,
    donationCount: 5,
    lastDonation: '2024-08-10',
    location: { lat: 17.6868, lng: 83.2185 }
  },
  {
    id: 'donor-4',
    name: 'Swapna Reddy Goud',
    age: 29,
    bloodGroup: 'AB+',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543213',
    isAvailable: true,
    donationCount: 1,
    lastDonation: '2024-07-05',
    location: { lat: 13.6288, lng: 79.4192 }
  },
  {
    id: 'donor-5',
    name: 'Suresh Babu Naidu',
    age: 35,
    bloodGroup: 'O-',
    city: 'Kurnool',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543214',
    isAvailable: true,
    donationCount: 8,
    lastDonation: '2024-06-12',
    location: { lat: 15.8281, lng: 78.0373 }
  },
  {
    id: 'donor-6',
    name: 'Divya Sree Venkat',
    age: 26,
    bloodGroup: 'A-',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543215',
    isAvailable: true,
    donationCount: 2,
    lastDonation: '2024-05-18',
    location: { lat: 14.4426, lng: 79.9865 }
  },
  {
    id: 'donor-7',
    name: 'Manohar Chandra Patel',
    age: 31,
    bloodGroup: 'B-',
    city: 'Kadapa',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543216',
    isAvailable: false,
    donationCount: 4,
    lastDonation: '2024-08-25',
    location: { lat: 14.4673, lng: 78.8242 }
  },
  {
    id: 'donor-8',
    name: 'Jameela Begum Khan',
    age: 27,
    bloodGroup: 'AB-',
    city: 'Anantapur',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543217',
    isAvailable: true,
    donationCount: 1,
    lastDonation: '2024-04-22',
    location: { lat: 14.6819, lng: 77.6006 }
  },
  {
    id: 'donor-9',
    name: 'Akshitha Mehra Singh',
    age: 24,
    bloodGroup: 'O+',
    city: 'Chittoor',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543218',
    isAvailable: true,
    donationCount: 0,
    location: { lat: 13.2172, lng: 79.1003 }
  },
  {
    id: 'donor-10',
    name: 'Venkat Ramana Rao',
    age: 33,
    bloodGroup: 'A+',
    city: 'Rajahmundry',
    state: 'Andhra Pradesh',
    contactNumber: '+91 9876543219',
    isAvailable: true,
    donationCount: 6,
    lastDonation: '2024-03-15',
    location: { lat: 17.0005, lng: 81.8040 }
  }
];

// Sample Hospitals in Andhra Pradesh
export const mockHospitals: Hospital[] = [
  {
    id: 'hospital-1',
    name: 'Apollo Hospitals Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    address: 'Arilova, Visakhapatnam, Andhra Pradesh 530040',
    contactNumber: '+91 891 672 3000',
    isSubscribed: true,
    subscriptionExpiry: '2024-12-31',
    availableBloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'AB+'],
    location: { lat: 17.7231, lng: 83.3316 }
  },
  {
    id: 'hospital-2',
    name: 'KIMS Hospital Secunderabad',
    city: 'Secunderabad',
    state: 'Telangana',
    address: '1-8-31/1, Minister Rd, Krishna Nagar Colony, Begumpet, Secunderabad, Telangana 500003',
    contactNumber: '+91 40 4020 5000',
    isSubscribed: true,
    subscriptionExpiry: '2025-01-15',
    availableBloodTypes: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'],
    location: { lat: 17.4399, lng: 78.4983 }
  },
  {
    id: 'hospital-3',
    name: 'NRI Hospital Guntur',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Lakshmipuram, Guntur, Andhra Pradesh 522007',
    contactNumber: '+91 863 235 2222',
    isSubscribed: false,
    availableBloodTypes: ['O+', 'A+', 'B+'],
    location: { lat: 16.3067, lng: 80.4365 }
  },
  {
    id: 'hospital-4',
    name: 'Ramesh Hospital Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    address: 'Governorpet, Vijayawada, Andhra Pradesh 520002',
    contactNumber: '+91 866 257 3333',
    isSubscribed: true,
    subscriptionExpiry: '2024-11-30',
    availableBloodTypes: ['O+', 'A+', 'B+', 'AB+', 'O-'],
    location: { lat: 16.5062, lng: 80.6480 }
  },
  {
    id: 'hospital-5',
    name: 'SVIMS Hospital Tirupati',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    address: 'Alipiri Rd, Tirupati, Andhra Pradesh 517507',
    contactNumber: '+91 877 228 7777',
    isSubscribed: true,
    subscriptionExpiry: '2025-03-20',
    availableBloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    location: { lat: 13.6288, lng: 79.4192 }
  },
  {
    id: 'hospital-6',
    name: 'Government General Hospital Kurnool',
    city: 'Kurnool',
    state: 'Andhra Pradesh',
    address: 'Medical College Rd, Kurnool, Andhra Pradesh 518002',
    contactNumber: '+91 8518 274 444',
    isSubscribed: false,
    availableBloodTypes: ['O+', 'A+', 'B+', 'AB+'],
    location: { lat: 15.8281, lng: 78.0373 }
  },
  {
    id: 'hospital-7',
    name: 'Narayana Medical College Hospital Nellore',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    address: 'Chinthareddypalem, Nellore, Andhra Pradesh 524003',
    contactNumber: '+91 861 249 8888',
    isSubscribed: true,
    subscriptionExpiry: '2024-10-15',
    availableBloodTypes: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-'],
    location: { lat: 14.4426, lng: 79.9865 }
  },
  {
    id: 'hospital-8',
    name: 'Kadapa Institute of Medical Sciences',
    city: 'Kadapa',
    state: 'Andhra Pradesh',
    address: 'Rajiv Gandhi Institute of Medical Sciences, Kadapa, Andhra Pradesh 516002',
    contactNumber: '+91 8562 228 500',
    isSubscribed: true,
    subscriptionExpiry: '2025-02-28',
    availableBloodTypes: ['O+', 'A+', 'B+', 'AB+', 'O-'],
    location: { lat: 14.4673, lng: 78.8242 }
  }
];

// Sample Blood Requests
export const mockBloodRequests: BloodRequest[] = [
  {
    id: 'request-1',
    patientName: 'Krishna Murthy',
    bloodGroup: 'O+',
    urgency: 'emergency',
    hospitalId: 'hospital-1',
    status: 'pending',
    requestedAt: '2024-09-04T10:30:00Z',
    location: { lat: 17.7231, lng: 83.3316 }
  },
  {
    id: 'request-2',
    patientName: 'Sita Devi',
    bloodGroup: 'A+',
    urgency: 'high',
    hospitalId: 'hospital-2',
    donorId: 'donor-2',
    status: 'matched',
    requestedAt: '2024-09-04T09:15:00Z',
    location: { lat: 17.4399, lng: 78.4983 }
  }
];

// Sample Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    type: 'subscription',
    hospitalId: 'hospital-1',
    amount: 999,
    timestamp: '2024-01-01T00:00:00Z',
    description: 'Monthly subscription fee for Apollo Hospitals Visakhapatnam'
  },
  {
    id: 'txn-2',
    type: 'maintenance',
    hospitalId: 'hospital-2',
    amount: 50,
    timestamp: '2024-09-04T09:30:00Z',
    description: 'Per-transaction maintenance fee for blood request'
  }
];

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const indianStates = [
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Maharashtra',
  'Gujarat',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Uttar Pradesh',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Jharkhand',
  'Chhattisgarh',
  'Madhya Pradesh',
  'Assam',
  'Meghalaya',
  'Manipur',
  'Mizoram',
  'Nagaland',
  'Tripura',
  'Arunachal Pradesh',
  'Sikkim',
  'Himachal Pradesh',
  'Uttarakhand',
  'Delhi',
  'Goa',
  'Jammu and Kashmir',
  'Ladakh'
];