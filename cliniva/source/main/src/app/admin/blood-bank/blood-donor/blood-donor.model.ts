import { formatDate } from '@angular/common';

export class BloodDonor {
  donorId: string;
  donorName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  address: string;
  phoneNumber: string;
  email: string;
  donorStatus: string;
  lastDonationDate: string;
  nextEligibleDonationDate: string;
  donationFrequency: string;
  healthStatus: string;
  donationHistory: number;
  donorCategory: string;
  donorIdentificationNumber: string;
  medicalHistory: string;
  emergencyContactPhone: string;
  registrationDate: string;
  donorLocation: string;
  donorNotes: string;

  constructor(donorData: Partial<BloodDonor> = {}) {
    this.donorId = donorData.donorId || this.getRandomID();
    this.donorName = donorData.donorName || '';
    this.dateOfBirth =
      donorData.dateOfBirth || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.gender = donorData.gender || '';
    this.bloodType = donorData.bloodType || '';
    this.address = donorData.address || '';
    this.phoneNumber = donorData.phoneNumber || '';
    this.email = donorData.email || '';
    this.donorStatus = donorData.donorStatus || '';
    this.lastDonationDate =
      donorData.lastDonationDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.nextEligibleDonationDate =
      donorData.nextEligibleDonationDate ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.donationFrequency = donorData.donationFrequency || '';
    this.healthStatus = donorData.healthStatus || '';
    this.donationHistory = donorData.donationHistory || 0;
    this.donorCategory = donorData.donorCategory || '';
    this.donorIdentificationNumber = donorData.donorIdentificationNumber || '';
    this.medicalHistory = donorData.medicalHistory || '';
    this.emergencyContactPhone = donorData.emergencyContactPhone || '';
    this.registrationDate =
      donorData.registrationDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.donorLocation = donorData.donorLocation || '';
    this.donorNotes = donorData.donorNotes || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
