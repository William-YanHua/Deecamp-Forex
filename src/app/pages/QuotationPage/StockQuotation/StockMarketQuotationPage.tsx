import React from "react";
// import { Row, Col, Card } from "antd";
// import { QuotationChart } from "../QuotationChart";
import styled from "styled-components";
// import {PriceChangeRatioForm} from "../PriceChangeRatioForm";
// import { AsyncComponent } from "../../../routing/AsyncComponent";
import { Inject } from "react.di";
import { QuotationService } from "../../../api/QuotationService";
import moment from 'moment';
import {Line} from '@antv/g2plot';
import { Slider, Card, DatePicker, message, Icon, Tag} from "antd";
import Position from "../../InvReqPage/InvReqDetailPage/Bought/Position";
// import { StockQuotation } from "../../../models/quotation/stock/StockQuotation";
import _ from 'lodash';
const dateFormat = 'YYYY-MM-DD';
const {RangePicker} = DatePicker;

const Prompt = styled.p`
  color: #FFFFFF;
`;

interface Props {
  // chartData: StockQuotation[];
}
export default class StockMarketQuotationPage extends React.Component<Props, {}> {
  @Inject quotationService: QuotationService;

  state = {
    data: null,
    linePlot: null,
    lookingYear: 2001,
    lookingTime: [moment('2001-01-01', dateFormat), moment('2001-01-08', dateFormat)],
    profitRate: {2001: 1}
  }
  constructor(props) {
    super(props);
  }
  async componentWillMount() {
  }
  
  async componentDidMount() {
    // console.log(this.state.data === null ? 1 : this.state.data)
    if (!this.state.data) {
      let data = await this.quotationService.getData(2001, null);
      await this.setState({data: data.data});
    }
    let profitRate = await this.quotationService.getProfit();
    await this.setState({profitRate});
    
    this.showLine()
  }


  filterData = (data) => {
    const temp_data = [];
    const {lookingTime} = this.state;
    const start_time = lookingTime[0];
    const end_time = lookingTime[1];
    let max_value = -10, min_value = 100;
    let count=0;
    data.forEach(item => {
      if (start_time <= moment(item.time) && moment(item.time) <= end_time) {
        if (!item.hasOwnProperty('strategy')) {
          temp_data.push(item);
        }
        else {
          if (item.strategy === 1) {
            item.strategy = '买入';
          } else if (item.strategy === 0) {
            item.strategy = '持有';
          } else if (item.strategy === -1){
            item.strategy = '卖出';
          }
          temp_data.push(item);
        }
        if (item.bid > max_value) {
          max_value = item.bid;
        }
        if (item.bid < min_value) {
          min_value = item.bid;
        }
      }
    });
    return [temp_data, max_value, min_value];
  }
  getInOutData = (temp_data) => {
    let inData = [], outData = [];
    temp_data.forEach(item => {
      if (item.hasOwnProperty('strategy')) {
        if (item.strategy === '买入') {
          inData.push(item);
        } else if (item.strategy === '卖出') {
          outData.push(item);
        }
      }
    });
    return [inData, outData];
  }
  showLine = () => {
    const {data} = this.state;
    const filter_result = this.filterData(data);
    let temp_data = filter_result[0];
    const max_value = filter_result[1];
    const min_value = filter_result[2];
    const markData = this.getInOutData(temp_data);
    // console.log(markData);
    const config = {
      title: {
        visible: true,
        text:'买卖策略图'
      },
      label: {
        visible: false,
        type: 'point',
      },
      point: {
        visible: true,
        size: 2,
        shape: 'diamond',
        style: {
          fill: 'white',
          stroke: '#2593fc',
          lineWidth: 2,
        },
      },
      padding: 'auto',
      forceFit: true,
      data: temp_data,
      xField: 'time',
      yField: 'bid',
      yAxis: {
        min: min_value,
        max: max_value
      },
      legend: {
        position: 'right-top',
      },
      responsive: true,
      tooltip: {
        custom: {
          onChange: (containerDom, cfg) => {
            const { items } = cfg;
            const data = _.filter(items, {name: 'strategy'});
            if (data.length !== 0) {
              return;
            }
            const {strategy} = items[0].data;
            const new_item = {
              ...items[0],
              name: 'strategy',
              value: strategy
            };
            items.push(new_item);
          },
        },
      },
      animation: {
        appear: {
          animation: 'clipingWithData',
        },
      },
      smooth: true,
      markerPoints: [
        {
          visible: true,
          data: markData[0],
          symbol: '',
          label: {
            visible: true,
            field: 'strategy',
            offsetY: -8
          },
          style: {
            big: {stroke: 'rgba(255, 0, 255, 0.7)', lineWidth: 3}
          },
        },
        {
          visible: true,
          data: markData[1],
          symbol: 'cross',
          label: {
            visible: true,
            field: 'strategy',
            offsetY: 24
          },
          style: {
            normal: { stroke: 'rgba(255, 0, 0, 0.65)', lineWidth: 3},
          },
        }
      ],
      seriesField: 'type',
    };
    const linePlot = new Line(document.getElementById('graph-container'), config);
    this.setState({linePlot});
    linePlot.render();
  }
  async sliderChange(value, quotationService) {
    value = 2001 + value * 19 /100;
    let data = await quotationService.getData(value);
    const lookingTime = [moment(`${value}-01-01`, dateFormat), moment(`${value}-01-06 `, dateFormat)]
    await this.setState({data: data.data, lookingTime, lookingYear: value});
    // const temp_data = this.filterData(data.data);
    const filter_result = this.filterData(data.data);
    let temp_data = filter_result[0];
    const max_value = filter_result[1];
    const min_value = filter_result[2];
    const {linePlot} = this.state;
    const markData = this.getInOutData(temp_data);
    linePlot.updateConfig({
      data: temp_data,
      yAxis: {
        min: min_value,
        max: max_value
      },
      markerPoints: [
        {
          visible: true,
          data: markData[0],
          symbol: '',
          label: {
            visible: true,
            field: 'strategy',
            offsetY: -8
          },
          style: {
            big: {stroke: 'rgba(255, 0, 255, 0.7)', lineWidth: 3}
          },
        },
        {
          visible: true,
          data: markData[1],
          symbol: 'cross',
          label: {
            visible: true,
            field: 'strategy',
            offsetY: 24
          },
          style: {
            normal: { stroke: 'rgba(255, 0, 0, 0.65)', lineWidth: 3},
          },
        }
      ],
    });
    linePlot.render();
  }
  getData = async (year) => {
    if (year !== this.state.lookingYear) {
      // await this.setState({lookingYear: year});
      const responce = await this.quotationService.getData(year, year+1);
      await this.setState({data: responce.data, lookingYear: year});
      // return this.state.data;
    }
    return this.state.data;
  }

  onRangeChange = async (v) => {
    await this.setState({lookingTime: [v[0], v[1]]});
    let data = null;
    if (v[1].year() - v[0].year() > 1) {
      return (message.warning('对不起，您选择的时间范围过长！请选择较短的预测时间查看。', 5));
    } else if (v[1].year() === v[0].year() ) {
      data = await this.getData(v[1].year());
    } 
    else if (v[1].year() - v[0].year() === 1) {
      const responce = await this.quotationService.getData(v[0].year(), v[1].year() + 1);
      await this.setState({data: responce.data});
      data = this.state.data;
    }
    const {linePlot} = this.state;
    const filterResult = this.filterData(data);
    const temp_data = filterResult[0];
    const max_value = filterResult[1];
    const min_value = filterResult[2];
    const markData = this.getInOutData(temp_data);
    linePlot.updateConfig({
      data: temp_data,
      yAxis: {
        min: min_value,
        max: max_value
      },
      markerPoints: [
        {
          visible: true,
          data: markData[0],
          symbol: '',
          label: {
            visible: true,
            field: 'strategy',
            offsetY: -8
          },
          style: {
            big: {stroke: 'rgba(255, 0, 255, 0.7)', lineWidth: 3}
          },
        },
        {
          visible: true,
          data: markData[1],
          symbol: 'cross',
          label: {
            visible: true,
            field: 'strategy',
            offsetY: 24
          },
          style: {
            normal: { stroke: 'rgba(255, 0, 0, 0.65)', lineWidth: 3},
          },
        }
      ],
    });
    linePlot.render();
    return;
  }

  render() {  
    // const marks = {
    //   0: {
    //     label: <strong>2001</strong>
    //   },
    //   100:{
    //     label: <strong>2020</strong>,
    //   }
    // }
    const {profitRate, lookingYear} = this.state;
    const profits = profitRate[lookingYear];
    const color = profits > 0 ? "green" : "red";
    // console.log(profits);
    return (
    <Card>
      {/* <Icon type='warning' /> 
      查看年份
      <div>
      <Slider
        marks={marks} 
        step={100/19} 
        tipFormatter= {(v) => `${2001 + v * 19 / 100}`} 
        onAfterChange={(v) => this.sliderChange(v, this.quotationService)}
      /> */}
      <div><strong>选择查看的时间段</strong></div>
      <RangePicker 
        defaultValue={this.state.lookingTime}
        onChange={this.onRangeChange}
        renderExtraFooter={() => '请选择最长半年的时间查看！'}
      />
      {/* </div> */}
      <br />
      <br />
      <div>
        <Tag color={color}>{this.state.lookingYear}的年收益率：{profits}</Tag>
      </div>
      <div id='graph-container' />
    </Card>
  ); 
  }
}
