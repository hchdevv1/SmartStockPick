import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { BarcodeItem, ItemDetails } from '../mssql/mssql.entity';
import { Stockrequest, StrockPickTransactions, StockTransferEntity, StockTransferPickEntity } from '../postgres/postgres.entity';
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

import { StockTransferQueryDto } from './dto/stock-transfer-query.dto';
import { ApiStockTransferResponse, ApiStockTransfer } from './interfaces/stock-transfer.interface';
import { ApiStockTransferPickResponse } from './interfaces/stock-transfer-pick.interface';
import { BarcodestockMatchedDto } from './dto/barcodestock-matched.dto';
import { BarcodestockUpdateDto } from './dto/barcodestock-update.dto';
import { LocationListResponse } from './interfaces/location-interface';
import { UserLogonQueryDto } from './dto/user-logon.dto';
import { ApiUserLogonResponse } from './interfaces/user-logon.interface';
import axios from 'axios';
import { AxiosResponse } from 'axios';
//import { ResultStockRequestByReqNoInfo } from './dto/result-stockrequestItem.dto';
@Injectable()
export class StockpickService {
  private readonly trakcareApiUrl: string;

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

    @InjectRepository(StockTransferEntity, 'postgresConn')
    private readonly repo: Repository<StockTransferEntity>,
    @InjectRepository(StockTransferPickEntity, 'postgresConn')
    private readonly stocktransferPickRepo: Repository<StockTransferPickEntity>,

    private readonly configService: ConfigService
  ) { this.trakcareApiUrl = this.configService.get<string>('TRAKCARE_APIURL')!; }
  //#region stocktransfer
  async processStockTransfers(query: StockTransferQueryDto) {
    const apiResponse = await this.callApi(query);
    await Promise.all(apiResponse.StockTransferInfo.map(item => this.saveToDatabase(item) ));
    const transferNumbers = apiResponse.StockTransferInfo.map(x => x.INITNo);
    const entityRows = await this.repo.find({
      where: { initno: In(transferNumbers) }
    });
    const pickMap = new Map<string, StockTransferEntity>();
    for (const row of entityRows) {
      if (row.initno) {
        pickMap.set(row.initno, row);
      }
    }
    const list = apiResponse.StockTransferInfo;
    const mergedList = list.map(item => {
    const matched = pickMap.get(item.INITNo);
      return {
        Index: item.Index,
        INITRowId: item.INITRowId,
        INITNo: item.INITNo,
        INRQRowId: item.INRQRowId,
        INRQNo: item.INRQNo,
        RequestingLocationCode: item.RequestingLocationCode,
        RequestingLocationDesc: item.RequestingLocationDesc,
        SupplyingLocationCode: item.SupplyingLocationCode,
        SupplyingLocationDesc: item.SupplyingLocationDesc,
        INITDate: item.INITDate,
        TransferComplete: item.TransferComplete,
        pickstatusid: matched?.pickstatusid ?? '',
        pickstatus: matched?.pickstatus ?? ''
      };
    });

    return { StockTransferInfo: mergedList};
  }
  private async callApi(query: StockTransferQueryDto): Promise<ApiStockTransferResponse> {

    let url = '';

    if (query.transferNo) {
      url = `${this.trakcareApiUrl}/StockTransferListByTransferNumber/${query.transferNo}`;

    } else if (query.locationCode) {
      url = `${this.trakcareApiUrl}/StockTransferListByLocation/${query.dateFrom}/${query.dateTo}/${query.locationCode}`;

    } else {
      url = `${this.trakcareApiUrl}/StockTransferListAllLocation/${query.dateFrom}/${query.dateTo}`;

    }
    const { data } = await axios.get<ApiStockTransferResponse>(url);
    return data;
  }
  private async saveToDatabase(apiItem: ApiStockTransfer) {
    const existed = await this.repo.findOne({
      where: { initrowid: apiItem.INITRowId },
    });

    if (existed) return;

    const entity = this.repo.create({
      initrowid: apiItem.INITRowId,
      initno: apiItem.INITNo,
      inrqrowid: apiItem.INRQRowId,
      inrqno: apiItem.INRQNo,
      reqloccode: apiItem.RequestingLocationCode,
      reqlocdesc: apiItem.RequestingLocationDesc,
      supplyloccode: apiItem.SupplyingLocationCode,
      supplylocdesc: apiItem.SupplyingLocationDesc,
      initdate: apiItem.INITDate,
      pickcompleted: apiItem.TransferComplete,
      pickstatusid: 1,
      pickstatus: 'Pending'


    });

    await this.repo.save(entity);
  }
  async processStockTransferPick(TransferNumber: string) {
    const url = `${this.trakcareApiUrl}/StockTransferOrder/${TransferNumber}`;

    const response$ = this.httpService.get<ApiStockTransferPickResponse>(url);
    const { data } = await firstValueFrom(response$);

    const result = [];
    for (const item of data.StockTransferInfo) {
      const barcodeText = await this.findBarcodeByStockItemCode(item.StockItemCode);
      const existing = await this.stocktransferPickRepo.findOne({
        where: { transfernumber: item.TransferNumber, initirowid: item.INITIRowId },
      });
      if (!existing) {
        const entity = this.stocktransferPickRepo.create({
          initrowid: item.INITRowId,
          transfernumber: item.TransferNumber,
          inrqrowid: item.INRQRowId,
          requestnumber: item.RequestNumber,
          initirowid: item.INITIRowId,
          initiinclbdr: item.INITIINCLBDR,
          stockitemcode: item.StockItemCode,
          stockitemdesc: item.StockItemDesc,
          bin: item.BIN,
          uom: item.UOM,
          batchqty: item.BatchQty,
          transferqty: item.TransferQty,
          requestqty: item.RequestQty,
          batch: item.Batch,
          batchexpirydate: item.BatchExpiryDate,
          transfercomplete: item.TransferComplete,
          ismedicine: item.IsMedicine,
          barcodestock: `${barcodeText}`


        });
        if (item.INITRowId) {
          await this.stocktransferPickRepo.save(entity);
        }

        result.push(entity);
      } else {
        result.push(existing);
      }
    }

    return { StockTransferInfo: result };
  }
  private async findBarcodeByStockItemCode(stockItemCode: string): Promise<string | null> {
    if (!stockItemCode) return null;

    // ใช้ raw query builder เพื่อ join ชื่อ column ที่มี space ได้สะดวก
    // Entity mapping มี column names ดังเดิม (เช่น "No_" และ "Barcode Text", "No_ 2")
    const qb = this.itemDetailsRepo.createQueryBuilder('item')
      .innerJoin(BarcodeItem, 'barcode', `barcode."No_" = item."No_"`)
      .where(`item."No_ 2" = :code`, { code: stockItemCode })
      .select(`barcode."Barcode Text"`, 'barcodeText')
      .limit(1);

    const raw = await qb.getRawOne<{ barcodeText?: string }>();
    return raw?.barcodeText ?? null;
  }

  async getMissingBarcodeByTransferNumber(transferNumber: string) {
    const items = await this.stocktransferPickRepo.find({
      select: ['stockitemcode', 'stockitemdesc', 'barcodestock'],
      where: {
        transfernumber: transferNumber,
        barcodestock: In(['', null]),  // รวม empty string และ null
      },
    });

    return { StockTransferInfo: items };
  }

  async processBarcodeMatched(dto: BarcodestockMatchedDto) {

    const { transferNo, barcodestock, pickbycode, pickbyname, pickdate, picktime } = dto;

    let statusmatch = ''

    const existing = await this.stocktransferPickRepo.findOne({
      where: { transfernumber: transferNo, barcodestock: barcodestock }

    });
    console.log(dto)
    if (existing) {
      statusmatch = 'Completed'
      // 2️⃣ Update record ที่ match
      await this.stocktransferPickRepo.update(
        { transfernumber: transferNo, barcodestock: barcodestock },
        {
          pickbycode: pickbycode,
          pickbyname: pickbyname,
          pickdate: pickdate,
          picktime: picktime,
          pickstatusid: '3',
          pickstatus: 'Done',
          updated_at: () => 'NOW()',
        },
      );

    } else {
      statusmatch = 'Not found'
    }

    const { count } = await this.stocktransferPickRepo
      .createQueryBuilder('p')
      .where('p.transfernumber = :transferNo', { transferNo })
      .andWhere('p.ismedicine = :isMed', { isMed: 'Y' })
      .andWhere('(p.pickstatusid IS NULL OR p.pickstatusid = \'\')')
      .select('COUNT(p.initrowid)', 'count')
      .getRawOne();

    const remainingCount = Number(count);

    if (remainingCount === 0) {
      await this.stocktransferPickRepo.update(
        { transfernumber: transferNo },
        {
          pickstatusid: '3',
          pickstatus: 'Done',
          updated_at: () => 'NOW()',
        },
      );
      await this.repo.update(
        { initno: transferNo },
        {
          pickstatusid: '3',
          pickstatus: 'Done',
          updated_at: () => 'NOW()',
        },
      );
    } else {
      await this.repo.update(
        { initno: transferNo },
        {
          pickstatusid: '2',
          pickstatus: 'In Progess',

        },
      );
    }

    const items = await this.stocktransferPickRepo.find({
      where: { transfernumber: transferNo },
      select: [
        'initrowid',
        'transfernumber',
        'inrqrowid',
        'requestnumber',
        'initirowid',
        'initiinclbdr',
        'stockitemcode',
        'stockitemdesc',
        'bin',
        'uom',
        'batchqty',
        'transferqty',
        'requestqty',
        'batch',
        'batchexpirydate',
        'transfercomplete',
        'barcodestock',
        'pickbycode',
        'pickbyname',
        'pickstatusid',
        'pickstatus',
        'pickdate',
        'picktime',
        'ismedicine',
      ],
    });

    /*
    // 1️⃣ Update record ที่ match transfernumber + barcodestock
    await this.stocktransferPickRepo.update(
      { transfernumber, barcodestock },
      {
        pickbycode,
        pickbyname,
        pickdate,
        picktime,
        pickstatusid: '3',
        pickstatus: 'Done',
        updated_at: () => 'NOW()',
      },
    );

    // 2️⃣ ตรวจสอบว่ายา (ismedicine='Y') ที่ยัง pickstatusid=1 ยังมีอยู่ไหม
    const remainingCount = await this.stocktransferPickRepo.count({
      where: { transfernumber, ismedicine: 'Y', pickstatusid: '1' },
    });

    // 3️⃣ ถ้าไม่มีเหลือ → update pickstatus ของ transfer ทั้งหมด
    if (remainingCount === 0) {
      await this.stocktransferPickRepo.update(
        { transfernumber },
        { pickstatusid: '3', pickstatus: 'Done', updated_at: () => 'NOW()' },
      );
    }

    // 4️⃣ query item ทั้งหมดของ transfer เพื่อ return
    const items = await this.stocktransferPickRepo.find({
      where: { transfernumber },
      select: [
        'initrowid',
        'transfernumber',
        'inrqrowid',
        'requestnumber',
        'initirowid',
        'initiinclbdr',
        'stockitemcode',
        'stockitemdesc',
        'bin',
        'uom',
        'batchqty',
        'transferqty',
        'requestqty',
        'batch',
        'batchexpirydate',
        'transfercomplete',
        'barcodestock',
        'pickbycode',
        'pickbyname',
        'pickstatusid',
        'pickstatus',
        'pickdate',
        'picktime',
        'ismedicine',
      ],
    });
    */

    return { Status: statusmatch, StockTransferInfo: items };
  }

  async updateBarcodestock(dto: BarcodestockUpdateDto) {
    const { transfernumber, stockitemcode, barcodestock, pickbycode, pickbyname, pickdate, picktime } = dto;
    console.log(dto)
    const itemDetail = await this.itemDetailsRepo.findOne({
      where: { no2: stockitemcode }
    });

    let updateStatus = '';
    let navNo = '';
    let navNo2 = '';


    if (itemDetail?.no) {
      navNo = itemDetail.no;     // Nav field
      navNo2 = itemDetail.no2 ?? '';   // Nav2 field

      await this.barcodeRepo.update(
        { no: itemDetail.no },
        { barcodeText: barcodestock }
      );

      updateStatus = 'SUCCESS';
      await this.stocktransferPickRepo.update(
        { transfernumber: transfernumber, stockitemcode: stockitemcode },
        {
          barcodestock: barcodestock,
          pickbycode: pickbycode,
          pickbyname: pickbyname,
          pickdate: pickdate,
          picktime: picktime,
          pickstatusid: '3',
          pickstatus: 'Done',
          updated_at: () => 'NOW()',
        },
      );

    } else {
      updateStatus = 'NOT_FOUND';
    }

    return {
      UpdateStatus: {
        stockitemcode,
        barcodestock,
        NavNo: navNo ?? '',
        NavNo2: navNo2 ?? '',
        status: updateStatus
      }
    };
  }

  async getLocation(): Promise<LocationListResponse> {
    const url = `${this.trakcareApiUrl}/LocationList/`;
    try {
      const response: AxiosResponse<LocationListResponse> = await firstValueFrom(
        this.httpService.get<LocationListResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
  async getStockLocation(): Promise<LocationListResponse> {
    const url = `${this.trakcareApiUrl}/StockLocationList/`;
    try {
      const response: AxiosResponse<LocationListResponse> = await firstValueFrom(
        this.httpService.get<LocationListResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
  async getUserLogon(query: UserLogonQueryDto): Promise<ApiUserLogonResponse> {

    let url = '';

    if (query.userid) {
      url = `${this.trakcareApiUrl}/LogonByTrakcare/${query.userid}/${query.password}`;

    }
    const { data } = await axios.get<ApiUserLogonResponse>(url);
    return data;
  }
  //#endregion



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
          BINNo: ''
        }));

        return {
          StockRequestNumberStatus: {
            statusCode: parseInt(existingStockRequest?.pickstatusid ?? '0'),
            statusDesc: existingStockRequest?.pickstatus ?? 'Pendingkk',
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
          statusCode: parseFloat((10.0).toFixed(5)),//parseFloat(existingStockRequest?.pickstatusid ?? '3.0').toFixed(1),
          statusDesc: existingStockRequest?.pickstatus ?? 'Pendingdds',
        },
        StockRequestByReqNoInfo: Result,
      };

    } catch {
      return {
        StockRequestNumberStatus: {
          statusCode: 0,
          statusDesc: 'Pendingff',
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
            BINNo: ''
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

            } else {
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

          barcodeText: result[0].barcodeText || '',
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


    } catch {
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
