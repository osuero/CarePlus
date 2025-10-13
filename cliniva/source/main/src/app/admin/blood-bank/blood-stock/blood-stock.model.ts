import { formatDate } from '@angular/common';

export class BloodStock {
  bloodProductID: string;
  bloodType: string;
  componentType: string;
  quantityInStock: number;
  expiryDate: string;
  collectionDate: string;
  storageLocation: string;
  donationStatus: string;
  batchNumber: string;
  conditionQualityStatus: string;
  temperatureRange: string;
  dateLastUpdated: string;

  constructor(bloodStock: Partial<BloodStock> = {}) {
    this.bloodProductID = bloodStock.bloodProductID || '';
    this.bloodType = bloodStock.bloodType || '';
    this.componentType = bloodStock.componentType || '';
    this.quantityInStock = bloodStock.quantityInStock || 0;
    this.expiryDate =
      bloodStock.expiryDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.collectionDate =
      bloodStock.collectionDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.storageLocation = bloodStock.storageLocation || '';
    this.donationStatus = bloodStock.donationStatus || '';
    this.batchNumber = bloodStock.batchNumber || '';
    this.conditionQualityStatus = bloodStock.conditionQualityStatus || '';
    this.temperatureRange = bloodStock.temperatureRange || '';
    this.dateLastUpdated =
      bloodStock.dateLastUpdated || formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
