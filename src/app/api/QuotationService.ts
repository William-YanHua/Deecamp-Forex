import { Inject, Injectable } from "react.di";
import {HttpService} from "./HttpService";
import {StockQuotation} from "../models/quotation/stock/StockQuotation";
import { StockDetailQuotation } from "../models/quotation/stock/StockDetailQuotation";
import { BondQuotation } from "../models/quotation/bond/BondQuotation";
import { GoodsQuotation } from "../models/quotation/goods/GoodsQuotation";
import { News } from "../models/quotation/news/News";
// import { utils } from "mocha";
// import { tomorrowNightEighties } from "react-syntax-highlighter/styles/hljs";im
import {HttpMethod} from './utils';
@Injectable
export class QuotationService {

  constructor(@Inject private httpService: HttpService) { }

  async getNews(): Promise<News[]> {
    const res = await this.httpService.fetch({
      path: `quotation/news`,
    });
    console.log(res);
    return res.response;
  }

  /**
   * 得到一支股票标的信息
   * @param {string} quotaId 标的id
   * @returns {Promise<StockQuotation>} 标的信息
   */
  async getDetailStockQuotation(quotaId: string): Promise<StockDetailQuotation> {
    const data = await this.httpService.fetch({
      path: `quotation/stock/${quotaId}`,
    });

    return data.response;
  }

  async getStockQuotationData(): Promise<StockQuotation[]> {
    const data = await this.httpService.fetch({
      path: `quotation/stock`,
    });
    return data.response;
  }

  async getBondQuotationData(): Promise<BondQuotation[]> {
    const data = await this.httpService.fetch({
      path: `quotation/bond`,
    });
    return data.response;
  }

  async getGoodsQuotationData(): Promise<GoodsQuotation[]> {
    const data = await this.httpService.fetch({
      path: `quotation/goods`,
    });
    return data.response;
  }
  
  async getData(fromYear, toYear){
    if (!toYear) {
      toYear = fromYear + 1;
    }
    const data = await this.httpService.fetch({
      path: `/getData`,
      queryParams: {fromYear, toYear},
      method: HttpMethod.POST
    });
    return data.response;
  }

  async getProfit() {
    const data = await this.httpService.fetch({
      path: '/profits',
      method: HttpMethod.GET
    });
    return data.response;
  }
}
