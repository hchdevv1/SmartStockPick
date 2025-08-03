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