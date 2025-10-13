export class BillList {
  id: string;
  img: string;
  patientName: string;
  admissionID: string;
  doctorName: string;
  status: string;
  tax: string;
  date: string;
  discount: string;
  total: string;

  constructor(billList: Partial<BillList> = {}) {
    this.id = billList.id || this.getRandomID();
    this.img = billList.img || 'assets/images/user/new.jpg';
    this.patientName = billList.patientName || '';
    this.admissionID = billList.admissionID || '';
    this.doctorName = billList.doctorName || '';
    this.status = billList.status || '';
    this.tax = billList.tax || '';
    this.date = billList.date || '';
    this.discount = billList.discount || '';
    this.total = billList.total || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
