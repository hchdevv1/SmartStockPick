import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stock_request')
export class Stockrequest {
    @PrimaryGeneratedColumn({ name: 'id' })
    id?: number;

    @Column({ name: 'inrqrowid', type: 'int' })
    inrqrowid?: number;

    @Column({ name: 'inrqno', type: 'text' })
    inrqno?: string;

    @Column({ name: 'reqloccode', type: 'text' })
    reqloccode?: string;

    @Column({ name: 'reqlocdesc', type: 'text' })
    reqlocdesc?: string;

    @Column({ name: 'supplyloccode', type: 'text' })
    supplyloccode?: string;

    @Column({ name: 'supplylocdesc', type: 'text' })
    supplylocdesc?: string;

    @Column({ name: 'inrqdate', type: 'text' })
    inrqdate?: string;

    @Column({ name: 'pickcompleted', type: 'boolean' })
    pickcompleted?: boolean;

    @Column({ name: 'created_at', type: 'timestamptz' })
    created_at?: Date;

    @Column({ name: 'updated_at', type: 'timestamptz' })
    updated_at?: Date;

    @Column({ name: 'pickstatus', type: 'text' })
    pickstatus?: string;
    
     @Column({ name: 'pickstatusid', type: 'text' })
    pickstatusid?: string;
    
}
@Entity('stock_transfer')
export class StockTransferEntity{
     @PrimaryGeneratedColumn({ name: 'id' })
    id?: number;
 
    @Column({ name: 'initrowid', type: 'text' })
    initrowid?: string;

  @Column({ name: 'initno', type: 'text',nullable: true })
  initno?: string;

  @Column({ name: 'inrqrowid', type: 'text',nullable: true })
  inrqrowid?: string;

  @Column({ name: 'inrqno', type: 'text',nullable: true })
  inrqno?: string;

  @Column({ name: 'reqloccode', type: 'text',nullable: true })
  reqloccode?: string;

  @Column({ name: 'reqlocdesc', type: 'text',nullable: true })
  reqlocdesc?: string;

  @Column({ name: 'supplyloccode', type: 'text',nullable: true })
  supplyloccode?: string;

  @Column({ name: 'supplylocdesc', type: 'text',nullable: true })
  supplylocdesc?: string;

  @Column({ name: 'pickcompleted', type: 'text',nullable: true })
  pickcompleted?: string;

  @Column({ name: 'initdate', type: 'text', nullable: true })
  initdate?: string;

  @Column({name: 'pickstatusid', type: 'text', nullable: true })
  pickstatusid?: number;

  @Column({name: 'pickstatus', type: 'text', nullable: true })
  pickstatus?: string;

  @Column({ name: 'created_at',type: 'timestamptz', default: () => 'NOW()' })
  created_at?: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updated_at?: Date;
}
@Entity('strock_transfer_pick')
export class StockTransferPickEntity{
     @PrimaryGeneratedColumn({ name: 'id' })
    id?: number;
      @Column({ name: 'initrowid', type: 'text' })
    initrowid?: string; 
     @Column({ name: 'transfernumber', type: 'text' })
    transfernumber?: string; 
     @Column({ name: 'inrqrowid', type: 'text' })
    inrqrowid?: string; 
     @Column({ name: 'requestnumber', type: 'text' })
    requestnumber?: string; 
     @Column({ name: 'initirowid', type: 'text' })
    initirowid?: string; 
     @Column({ name: 'initiinclbdr', type: 'text' })
    initiinclbdr?: string; 
     @Column({ name: 'stockitemcode', type: 'text' })
    stockitemcode?: string; 
     @Column({ name: 'stockitemdesc', type: 'text' })
    stockitemdesc?: string; 
     @Column({ name: 'bin', type: 'text' })
    bin?: string; 
     @Column({ name: 'uom', type: 'text' })
    uom?: string; 
     @Column({ name: 'batchqty', type: 'text' })
    batchqty?: string; 
     @Column({ name: 'transferqty', type: 'text' })
    transferqty?: string; 
    @Column({ name: 'requestqty', type: 'text' })
    requestqty?: string; 
  @Column({ name: 'pickqty', type: 'text' })
    pickqty?: string; 
    @Column({ name: 'batch', type: 'text' })
    batch?: string; 
    @Column({ name: 'batchexpirydate', type: 'text' })
    batchexpirydate?: string; 
    @Column({ name: 'transfercomplete', type: 'text' })
    transfercomplete?: string; 
       @Column({ name: 'barcodestock', type: 'text' })
    barcodestock?: string; 
       @Column({ name: 'pickbycode', type: 'text' })
    pickbycode?: string; 
       @Column({ name: 'pickbyname', type: 'text' })
    pickbyname?: string; 
       @Column({ name: 'pickstatusid', type: 'text' })
    pickstatusid?: string; 
       @Column({ name: 'pickstatus', type: 'text' })
    pickstatus?: string; 
       @Column({ name: 'pickdate', type: 'text' })
    pickdate?: string; 
       @Column({ name: 'picktime', type: 'text' })
    picktime?: string; 
       @Column({ name: 'ismedicine', type: 'text' })
    ismedicine?: string; 

     @Column({ name: 'created_at',type: 'timestamptz', default: () => 'NOW()' })
  created_at?: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updated_at?: Date;
}
@Entity('strock_pick_transactions')
export class StrockPickTransactions {


    @PrimaryGeneratedColumn({ name: 'id' })
    id?: number;
    @Column({ name: 'inrqrowid', type: 'int' })
    inrqrowid?: number;
    @Column({ name: 'inrqirowid', type: 'text' })
    inrqirowid?: string;
    @Column({ name: 'inrqno', type: 'text' })
    inrqno?: string;
    @Column({ name: 'reqloccode', type: 'text' })
    reqloccode?: string;
    @Column({ name: 'reqlocdesc', type: 'text' })
    reqlocdesc?: string;
    @Column({ name: 'supplyloccode', type: 'text' })
    supplyloccode?: string;
    @Column({ name: 'supplylocdesc', type: 'text' })
    supplylocdesc?: string;
    @Column({ name: 'inrqdate', type: 'text' })
    inrqdate?: string;
    @Column({ name: 'inrqtime', type: 'text' })
    inrqtime?: string;
    @Column({ name: 'trakcareitemcode', type: 'text' })
    trakcareitemcode?: string;
    @Column({ name: 'trakcareitemdesc', type: 'text' })
    trakcareitemdesc?: string;
    @Column({ name: 'uom', type: 'text' })
    uom?: string;
    @Column({ name: 'qty', type: 'text' })
    qty?: string;
    @Column({ name: 'barcodestock', type: 'text' })
    barcodestock?: string;
    @Column({ name: 'pickbycode', type: 'text' })
    pickbycode?: string;
    @Column({ name: 'pickbyname', type: 'text' })
    pickbyname?: string;
    
    @Column({ name: 'pickstatusid', type: 'int' })
    pickstatusid?: number;
    @Column({ name: 'pickstatus', type: 'text' })
    pickstatus?: string;
    @Column({ name: 'pickdate', type: 'text' })
    pickdate?: string;
    @Column({ name: 'picktime', type: 'text' })
    picktime?: string;
    @Column({ name: 'created_at', type: 'timestamptz' })
    created_at?: Date;
    @Column({ name: 'updated_at', type: 'timestamptz' })
    updated_at?: Date;
    @Column({ name: 'ismedicine', type: 'text' })
    ismedicine?: string;

}