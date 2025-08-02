import { Entity,PrimaryColumn, Column } from 'typeorm';

@Entity('HCH-PRODGolive$Item$d2ee3ee2-4127-4b41-8c2e-513ec083665e')
export class BarcodeItem {
  @PrimaryColumn({ name: 'No_' })
  no?: string;

  @Column({ name: 'Barcode Text' })
  barcodeText?: string;
}
@Entity('HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972')
export class ItemDetails {
  @PrimaryColumn({ name: 'No_' })
  no?: string;

  @Column({ name: 'No_ 2' })
  no2?: string;
}