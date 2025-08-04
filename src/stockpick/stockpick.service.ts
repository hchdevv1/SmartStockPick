import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BarcodeItem, ItemDetails } from '../mssql/mssql.entity';
import { Stockrequest, StrockPickTransactions } from '../postgres/postgres.entity';
import { TrakcareService } from '../trakcare/trakcare.service';

import { QueryStockRequestByReqNoBodyDto, StockRequestByReqNoDto } from './dto/query-StockRequestByReqNo.dto';
import { UpdateStrockPickTransactionDto } from './dto/update-StockRequestItem.dto';

// import { QueryBarcodeItemResultBodyDto } from './dto/query-BarcodeItemResult.dto';
import { ifaceStockRequestResponse, ifaceStockRequestItem } from './interfaces/stock-request.interface';
import { ifaceQueryStrockNAV } from './interfaces/query-stock-nav.interface';
import { ifaceResultStockRequestNumberInfo } from './interfaces/result-stockrequestnumber.interface';
import { ifaceMatchbarcodeRequestItem } from './interfaces/result-matchbarcode-requestItem';
import { FetchStockRequestDto } from './dto/fetch-stockrequest.dto';

import { MatchBarcodeToStockRequestItemDto } from './dto/fetch-matchbarcode-requestItem.dto';


//import { ResultStockRequestByReqNoInfo } from './dto/result-stockrequestItem.dto';
@Injectable()
export class StockpickService {

  constructor(
    private readonly httpService: HttpService,
    private readonly trakcareService: TrakcareService,

    @InjectRepository(BarcodeItem, 'mssqlConn')
    private readonly barcodeRepo: Repository<BarcodeItem>,
    @InjectRepository(ItemDetails, 'mssqlConn')
    private readonly itemDetailsRepo: Repository<ItemDetails>,


    @InjectRepository(Stockrequest, 'postgresConn')
    private readonly stockRequestRepo: Repository<Stockrequest>,
    @InjectRepository(StrockPickTransactions, 'postgresConn')
    private readonly stockRequestByReqNoRepo: Repository<StrockPickTransactions>,

  ) { }

  //  async findAllDepartments(): Promise<Department[]> {
  //     return this.departmentRepo.find();
  //   }

  //   async isBarcodeItemMatched(xฺBarcode13Digi: string) {
  //  const result = await this.barcodeRepo.query(`
  //     SELECT 
  //       [Barcode Text],
  //       [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972].[No_ 2]
  //     FROM 
  //       [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$d2ee3ee2-4127-4b41-8c2e-513ec083665e]
  //     INNER JOIN
  //       [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972]
  //       ON 
  //       [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$d2ee3ee2-4127-4b41-8c2e-513ec083665e].[No_] = 
  //       [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972].[No_]
  //     WHERE 
  //       [Barcode Text] = @0
  //   `, [xฺBarcode13Digi]);

  //   return result;

  // }


  /*
    async isBarcodeItemMatched2(xBarcode13Digi: string) {
      try {
        const result: BarcodeItemResult[] = await this.barcodeRepo.query(
          `SELECT 
          barcode.[Barcode Text] AS barcodeText,
          itemDetails.[No_ 2] AS itemNo2
        FROM 
          [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$d2ee3ee2-4127-4b41-8c2e-513ec083665e] AS barcode
        INNER JOIN
          [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972] AS itemDetails
          ON barcode.[No_] = itemDetails.[No_]
        WHERE 
          barcode.[Barcode Text] = @0`,
          [xBarcode13Digi],
        );
  
        if (result && result.length > 0) {
          return {
            barcodeText: result[0].barcodeText ?? null,
            itemNo2: result[0].itemNo2 ?? null,
          };
        } else {
          return {
            barcodeText: null,
            itemNo2: null,
          };
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error in getItemDetailsByBarcode:', error.message);
        } else {
          console.error('Unknown error in getItemDetailsByBarcode:', error);
        }
        return {
          barcodeText: null,
          itemNo2: null,
        };
      }
    }
    async isBarcodeItemMatched3(xINRQRowId: string, xBarcode13Digi: string) {
      try {
        const result: BarcodeItemResult[] = await this.barcodeRepo.query(
          `SELECT 
          barcode.[Barcode Text] AS barcodeText,
          itemDetails.[No_ 2] AS itemNo2
        FROM 
          [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$d2ee3ee2-4127-4b41-8c2e-513ec083665e] AS barcode
        INNER JOIN
          [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972] AS itemDetails
          ON barcode.[No_] = itemDetails.[No_]
        WHERE 
          barcode.[Barcode Text] = @0`,
          [xBarcode13Digi],
        );
  
        if (result && result.length > 0) {
          return {
            barcodeText: result[0].barcodeText ?? null,
            itemNo2: result[0].itemNo2 ?? null,
          };
        } else {
          return {
            barcodeText: null,
            itemNo2: null,
          };
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error in getItemDetailsByBarcode:', error.message);
        } else {
          console.error('Unknown error in getItemDetailsByBarcode:', error);
        }
        return {
          barcodeText: null,
          itemNo2: null,
        };
      }
    } */
  async isBarcodeItemMatched(xINRQRowId: string, xBarcode13Digi: string): Promise<UpdateStrockPickTransactionDto> {
    try {
      const result: ifaceQueryStrockNAV[] = await this.barcodeRepo.query(
        `SELECT 
              barcode.[Barcode Text] AS barcodeText,
              itemDetails.[No_ 2] AS itemNo2
           FROM 
              [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$d2ee3ee2-4127-4b41-8c2e-513ec083665e] AS barcode
           INNER JOIN
              [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972] AS itemDetails
             ON barcode.[No_] = itemDetails.[No_]
           WHERE 
              barcode.[Barcode Text] = @0`,
        [xBarcode13Digi],
      );

      if (!result?.length || !result[0].itemNo2) {
        return {
          pickstatus: 'notfound'
        };
      }

      const itemNo2 = result[0].itemNo2;
      const barcodeText = result[0].barcodeText;
      console.log('itemNo2:' + itemNo2)
      console.log('barcodeText:' + barcodeText)
      const record = await this.stockRequestByReqNoRepo.findOne({
        where: {
          inrqrowid: +xINRQRowId,
          trakcareitemcode: itemNo2,
        },
      });



      if (!record) {
        return {
          pickstatus: 'notfound',
        };
      }


      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0 ต้อง +1
      const day = String(now.getDate()).padStart(2, '0');

      record.pickdate = `${year}-${month}-${day}`;
      record.picktime = now.toTimeString().slice(0, 5);
      record.barcodestock = barcodeText || '';
      record.pickstatus = 'completed'


      await this.stockRequestByReqNoRepo.save(record);

      return {
        pickstatus: 'success',

      };
    } catch (error) {

      return {
        pickstatus: 'error'

      };
      throw error;
    }
  }
  /*
  async getStockRequestListByRequestNumber(
      dto: FetchStockRequestDto,
    ): Promise<ifaceStockRequestResponse> {
      try {
        const xRequestNumber = dto.xRequestNumber;
  
        if (!xRequestNumber) {
          throw new Error('RequestNumber is required');
        }
  
        const rawData: ifaceStockRequestResponse =
          await this.trakcareService.getStockRequestListByRequestNumber(xRequestNumber);
  
        return rawData;
      } catch (error) {
        throw error;
      }
    }
    */

  async getStockRequestList(dto: FetchStockRequestDto): Promise<ifaceStockRequestResponse> {

    try {
      const xDateFrom = dto.xDateFrom ?? '';
      const xDateTo = dto.xDateTo ?? '';
      const xLocationCode = dto.xLocationCode ?? '';
      const rawData: ifaceStockRequestResponse = await this.trakcareService.getStockRequestList(
        xDateFrom,
        xDateTo,
        xLocationCode,
      );
      //console.log(rawData)

      for (const item of rawData.StockRequestInfo) {
        if (!item.INRQRowId) continue;
        const inrqrowidNum = parseInt(item.INRQRowId);
        if (isNaN(inrqrowidNum)) continue;

        const existing = await this.stockRequestRepo.findOne({
          where: { inrqrowid: inrqrowidNum },
        });
        if (!existing) {
          const newRecord = this.stockRequestRepo.create({
            inrqrowid: inrqrowidNum,
            inrqno: item.INRQNo,
            reqloccode: item.RequestingLocationCode,
            reqlocdesc: item.RequestingLocationDesc,
            supplyloccode: item.SupplyingLocationCode,
            supplylocdesc: item.SupplyingLocationDesc,
            inrqdate: item.INRQDate,
          });
          await this.stockRequestRepo.save(newRecord);
        }
      }
      const inrqrowids = rawData.StockRequestInfo
        .map((item) => parseInt(item.INRQRowId ?? '0'))
        .filter((id) => !isNaN(id));

      const stockRequestList = await this.stockRequestRepo.find({
        where: { inrqrowid: In(inrqrowids) },
      });

      const result: ifaceStockRequestResponse = {
        StockRequestInfo: stockRequestList.map((item) => ({
          INRQRowId: item.inrqrowid?.toString(),
          INRQNo: item.inrqno,
          RequestingLocationCode: item.reqloccode,
          RequestingLocationDesc: item.reqlocdesc,
          SupplyingLocationCode: item.supplyloccode,
          SupplyingLocationDesc: item.supplylocdesc,
          INRQDate: item.inrqdate,
          PickStatusID: item.pickstatusid,
          PickStatus: item.pickstatus,
          PickCompleted: item.pickcompleted,
        })),
      };
      if (!result.StockRequestInfo.length) {
        return {
          StockRequestInfo: [
            {
              INRQRowId: "",
              INRQNo: "",
              RequestingLocationCode: "",
              RequestingLocationDesc: "",
              SupplyingLocationCode: "",
              SupplyingLocationDesc: "",
              INRQDate: "",
              PickStatusID: "",
              PickStatus: "",
              PickCompleted: false
            }
          ]
        };
      } else { return result; }

    } catch {
      return {
        StockRequestInfo: [
          {
            INRQRowId: "",
            INRQNo: "",
            RequestingLocationCode: "",
            RequestingLocationDesc: "",
            SupplyingLocationCode: "",
            SupplyingLocationDesc: "",
            INRQDate: "",
            PickStatusID: "",
            PickStatus: "",
            PickCompleted: false
          }
        ]
      };
    }
  }
  async getStockRequestListByRequestNumber(dto: FetchStockRequestDto): Promise<ifaceStockRequestResponse> {
    try {
      const xRequestNumber = dto.xRequestNumber;
      const rawData: ifaceStockRequestResponse =
        await this.trakcareService.getStockRequestListByRequestNumber(xRequestNumber!);
      for (const item of rawData.StockRequestInfo) {
        if (!item.INRQRowId) continue; const inrqrowidNum = parseInt(item.INRQRowId);
        if (isNaN(inrqrowidNum)) continue;
        const existing = await this.stockRequestRepo.findOne({
          where: { inrqrowid: inrqrowidNum },
        });
        if (!existing) {
          const newRecord = this.stockRequestRepo.create({
            inrqrowid: parseInt(item.INRQRowId),
            inrqno: item.INRQNo,
            reqloccode: item.RequestingLocationCode,
            reqlocdesc: item.RequestingLocationDesc,
            supplyloccode: item.SupplyingLocationCode,
            supplylocdesc: item.SupplyingLocationDesc,
            inrqdate: item.INRQDate,
          });
          await this.stockRequestRepo.save(newRecord);
          //const saved = await this.stockRequestRepo.save(newRecord);
          //if (saved?.id) {console.log('✅ บันทึกสำเร็จ ID:', saved.id);}
        }
      }
      const inrqnoFilter = rawData.StockRequestInfo[0]?.INRQNo ?? '';
      const stockRequestList = await this.stockRequestRepo.find({
        where: { inrqno: inrqnoFilter },
      });
      /*
      
          const mappedList = stockRequestList.map((item) => ({
            INRQRowId: item.inrqrowid?.toString(),
            INRQNo: item.inrqno,
            RequestingLocationCode: item.reqloccode,
            RequestingLocationDesc: item.reqlocdesc,
            SupplyingLocationCode: item.supplyloccode,
            SupplyingLocationDesc: item.supplylocdesc,
            INRQDate: item.inrqdate,
            PickStatusID: item.pickstatusid,
            PickStatus: item.pickstatus,
            PickCompleted: item.pickcompleted,
          }));
      
          return {
            StockRequestInfo: mappedList.length > 0 ? mappedList : [this.emptyStockRequest()],
          };
      
            */


      const result: ifaceStockRequestResponse = {
        StockRequestInfo: stockRequestList.map((item) => ({
          INRQRowId: item.inrqrowid?.toString(),
          INRQNo: item.inrqno,
          RequestingLocationCode: item.reqloccode,
          RequestingLocationDesc: item.reqlocdesc,
          SupplyingLocationCode: item.supplyloccode,
          SupplyingLocationDesc: item.supplylocdesc,
          INRQDate: item.inrqdate,
          PickStatusID: item.pickstatusid,
          PickStatus: item.pickstatus,
          PickCompleted: item.pickcompleted,
        })),
      };

      if (!result.StockRequestInfo.length) {
        return {
          StockRequestInfo: [
            {
              INRQRowId: "",
              INRQNo: "",
              RequestingLocationCode: "",
              RequestingLocationDesc: "",
              SupplyingLocationCode: "",
              SupplyingLocationDesc: "",
              INRQDate: "",
              PickStatusID: "",
              PickStatus: "",
              PickCompleted: false
            }
          ]
        };
      } else { return result; }

    } catch {
      return {
        StockRequestInfo: [
          {
            INRQRowId: "",
            INRQNo: "",
            RequestingLocationCode: "",
            RequestingLocationDesc: "",
            SupplyingLocationCode: "",
            SupplyingLocationDesc: "",
            INRQDate: "",
            PickStatusID: "",
            PickStatus: "",
            PickCompleted: false
          }
        ]
      };
    }
  }
  async getStockRequestByReqNo(xINRQRowId: string): Promise<ifaceResultStockRequestNumberInfo> {
    try {

      const existingStockRequest = await this.stockRequestRepo.findOne({
        where: { inrqrowid: parseInt(xINRQRowId) },
      });

      const existingStockRequestByReqNo = await this.stockRequestByReqNoRepo.find({
        where: { inrqrowid: parseInt(xINRQRowId) },
      });

      if (existingStockRequestByReqNo.length > 0) {
        const Result: StockRequestByReqNoDto[] = existingStockRequestByReqNo.map((item) => ({
          INRQRowId: item.inrqrowid?.toString() ?? '',
          INRQIRowId: item.inrqirowid ?? '',
          INRQNo: item.inrqno ?? '',
          RequestingLocationCode: item.reqloccode ?? '',
          RequestingLocationDesc: item.reqlocdesc ?? '',
          SupplyingLocationCode: item.supplyloccode ?? '',
          SupplyingLocationDesc: item.supplylocdesc ?? '',
          INRQDate: item.inrqdate ?? '',
          INRQTime: item.inrqtime ?? '',
          ItemCode: item.trakcareitemcode ?? '',
          ItemDesc: item.trakcareitemdesc ?? '',
          UOM: item.uom ?? '',
          ReqQty: item.qty ?? '',
          BarCodeStock: item.barcodestock ?? '',
          PickByCode: item.pickbycode ?? '',
          PickByName: item.pickbyname ?? '',
          PickStatusId: item.pickstatusid,
          PickStatus: item.pickstatus ?? '',
          isMedicine: item.ismedicine ?? '',
          BINNo :''
        }));

        return {
          StockRequestNumberStatus: {
            statusCode: parseInt(existingStockRequest?.pickstatusid ?? '0'),
            statusDesc: existingStockRequest?.pickstatus ?? 'Pendings.',
          },
          StockRequestByReqNoInfo: Result,
        };
      }
      const rawData: QueryStockRequestByReqNoBodyDto = await this.trakcareService.getStockRequestByReqNo(xINRQRowId);
      const items = rawData.StockRequestByReqNoInfo ?? [];
      const validItems = items.filter((item) => !!item.INRQIRowId);
      const newEntities = validItems.map((dto) =>
        this.stockRequestByReqNoRepo.create({
          inrqrowid: dto.INRQRowId ? parseInt(dto.INRQRowId) : undefined,
          inrqirowid: dto.INRQIRowId,
          inrqno: dto.INRQNo,
          reqloccode: dto.RequestingLocationCode,
          reqlocdesc: dto.RequestingLocationDesc,
          supplyloccode: dto.SupplyingLocationCode,
          supplylocdesc: dto.SupplyingLocationDesc,
          inrqdate: dto.INRQDate,
          inrqtime: dto.INRQTime,
          trakcareitemcode: dto.ItemCode,
          trakcareitemdesc: dto.ItemDesc,
          uom: dto.UOM,
          qty: dto.ReqQty,
          ismedicine: dto.isMedicine,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      );
      const savedEntities = await this.stockRequestByReqNoRepo.save(newEntities);
      const Result: StockRequestByReqNoDto[] = savedEntities.map((item) => ({
        INRQRowId: item.inrqrowid?.toString() ?? '',
        INRQIRowId: item.inrqirowid ?? '',
        INRQNo: item.inrqno ?? '',
        RequestingLocationCode: item.reqloccode ?? '',
        RequestingLocationDesc: item.reqlocdesc ?? '',
        SupplyingLocationCode: item.supplyloccode ?? '',
        SupplyingLocationDesc: item.supplylocdesc ?? '',
        INRQDate: item.inrqdate ?? '',
        INRQTime: item.inrqtime ?? '',
        ItemCode: item.trakcareitemcode ?? '',
        ItemDesc: item.trakcareitemdesc ?? '',
        UOM: item.uom ?? '',
        ReqQty: item.qty ?? '',
        BarCodeStock: item.barcodestock ?? '',
        PickByCode: item.pickbycode ?? '',
        PickByName: item.pickbyname ?? '',
        PickStatusId: item.pickstatusid,
        PickStatus: item.pickstatus ?? '',
        isMedicine: item.ismedicine ?? '',
      }));
      return {
        StockRequestNumberStatus: {
          statusCode: parseInt(existingStockRequest?.pickstatusid ?? '0'),
          statusDesc: existingStockRequest?.pickstatus ?? 'Pendings',
        },
        StockRequestByReqNoInfo: Result,
      };

    } catch {
      return {
        StockRequestNumberStatus: {
          statusCode: 0,
          statusDesc: 'Pending',
        },
        StockRequestByReqNoInfo: [
          {
            INRQRowId: '',
            INRQIRowId: '',
            INRQNo: '',
            RequestingLocationCode: '',
            RequestingLocationDesc: '',
            SupplyingLocationCode: '',
            SupplyingLocationDesc: '',
            INRQDate: '',
            INRQTime: '',
            ItemCode: '',
            ItemDesc: '',
            UOM: '',
            ReqQty: '',
            BarCodeStock: '',
            PickByCode: '',
            PickByName: '',
            PickStatusId: 0,
            PickStatus: '',
            isMedicine: '',
            BINNo:''
          }
        ],
      };

    }
  }
  async matchBarcodeToStockRequestItem(dto: MatchBarcodeToStockRequestItemDto): Promise<ifaceMatchbarcodeRequestItem> {
    try {

      console.log('step 1 found item NAV')
      if (dto.xBarcodeText) {

        const result: ifaceQueryStrockNAV[] = await this.barcodeRepo.query(
          `SELECT 
              barcode.[Barcode Text] AS barcodeText,
              itemDetails.[No_ 2] AS itemNo2
           FROM 
              [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$d2ee3ee2-4127-4b41-8c2e-513ec083665e] AS barcode
           INNER JOIN
              [HCH_BC220TEST_20250121].[dbo].[HCH-PRODGolive$Item$437dbf0e-84ff-417a-965d-ed2bb9650972] AS itemDetails
             ON barcode.[No_] = itemDetails.[No_]
           WHERE 
              barcode.[Barcode Text] = @0`,
          [dto.xBarcodeText],
        );

        if (!result?.length || !result[0].itemNo2) {
          console.log('2. item NAV not found')
          return {
            INRQRowId: parseInt(dto.xINRQRowId || ''),
            barcodeText: '',
            itemNo2: '',
            status: 'not found',
          };
        } else {
          console.log('2. next step find item in transaction')
          const xinrqRowId = dto.xINRQRowId ?? '0'
           await this.stockRequestByReqNoRepo.find({
            where: {
              inrqrowid: parseInt(xinrqRowId),//parseInt(dto.xINRQRowId || '0'),
              trakcareitemcode: result[0].itemNo2,
            },
          });
          console.log('3. next step update status in transaction')
          await this.stockRequestByReqNoRepo
            .createQueryBuilder()
            .update()
            .set({
              pickstatusid: 3,
              pickstatus: 'Completed',
              pickbycode: dto.xPickbyCode,
              pickbyname: dto.xPickbyName,
            })
            .where("inrqrowid = :inrqrowid", { inrqrowid: parseInt(dto.xINRQRowId ?? '0') })
            .andWhere("trakcareitemcode = :itemcode", { itemcode: result[0].itemNo2 })
            .execute();
          console.log('4. next step count ismedicine transaction')
          const countIsMedicine = await this.stockRequestByReqNoRepo
            .createQueryBuilder("spt")
            .where("spt.inrqrowid = :inrqrowid", { inrqrowid: parseInt(xinrqRowId) })
            .andWhere("spt.ismedicine = :ismedicine", { ismedicine: 'Y' })
            .andWhere("spt.pickstatusid <> :completed", { completed: 3 })
            .getCount();
          console.log(countIsMedicine)
          if (countIsMedicine === 0) {
            const nonMedicineUnpickedCount = await this.stockRequestByReqNoRepo
              .createQueryBuilder("spt")
              .where("spt.inrqrowid = :inrqrowid", { inrqrowid: parseInt(xinrqRowId) })
              .andWhere("spt.ismedicine <> :ismedicine", { ismedicine: 'Y' })
              .andWhere("spt.pickstatusid <> :completed", { completed: 3 })
              .getCount();
            if (!nonMedicineUnpickedCount || nonMedicineUnpickedCount === 0) {
              await this.stockRequestRepo
                .createQueryBuilder()
                .update()
                .set({
                  pickstatusid: 3,
                  pickstatus: 'Completed',
                })
                .where("inrqrowid = :inrqrowid", { inrqrowid: parseInt(dto.xINRQRowId ?? '0') })
                .execute();

            }else{
               await this.stockRequestRepo
                .createQueryBuilder()
                .update()
                .set({
                  pickstatusid: 1,
                  pickstatus: 'Pending',
                })
                .where("inrqrowid = :inrqrowid", { inrqrowid: parseInt(dto.xINRQRowId ?? '0') })
                .execute();
            }
          } else { 
                 await this.stockRequestRepo
                .createQueryBuilder()
                .update()
                .set({
                  pickstatusid: 2,
                  pickstatus: 'In Progess',
                })
                .where("inrqrowid = :inrqrowid", { inrqrowid: parseInt(dto.xINRQRowId ?? '0') })
                .execute();

          }
        }
       
        return {
          // สมมุติค่าที่ได้จาก logic
          INRQRowId: parseInt(dto.xINRQRowId ?? '0'),

          barcodeText: result[0].barcodeText||'',
          itemNo2: result[0].itemNo2,
          status: 'Completed',
        };
      } else {
        return {
          INRQRowId: 0,
          barcodeText: '',
          itemNo2: '',
          status: '',
        };
      }


    } catch  {
      return {
        INRQRowId: 0,
        barcodeText: '',
        itemNo2: '',
        status: '',
      };
    }
  }

  private emptyStockRequest(): ifaceStockRequestItem {
    return {
      INRQRowId: '',
      INRQNo: '',
      RequestingLocationCode: '',
      RequestingLocationDesc: '',
      SupplyingLocationCode: '',
      SupplyingLocationDesc: '',
      INRQDate: '',
      PickStatusID: '',
      PickStatus: '',
      PickCompleted: false,
    };
  }
}
