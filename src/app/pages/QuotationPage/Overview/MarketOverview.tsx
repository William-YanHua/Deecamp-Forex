import React from "react";
import { Line } from '@antv/g2plot';
import moment from 'moment';
import { Inject, Injectable } from "react.di";
import { Slider, message } from "antd";
import {QuotationService} from '../../../api/QuotationService';
import _ from 'lodash';
import {DatePicker} from 'antd';
const {RangePicker} = DatePicker; 
const dateFormat = 'YYYY-MM-DD';
export default class MarketOverview extends React.Component {
  @Inject quotationService: QuotationService;

  state = {
    data: null,
    lookingYear: 2001,
    lookingTime: [moment('2001-01-01', dateFormat), moment('2001-03-01', dateFormat)],
    linePlot: null,
  }
  constructor(props) {
    super(props);
  }
  async componentWillMount() {
  }
  filterData = (data) => {
    const temp_data = [];
    const {lookingTime} = this.state;
    if (!lookingTime) {
      return data;
    }
    // console.log(lookingTime);
    // const {startTime, endTime} = lookingTime;
    const startTime = lookingTime[0];
    const endTime = lookingTime[1];
    let max_value = -10, min_value = 100;
    data.forEach(item => {
      if (startTime <= moment(item.time) && moment(item.time) <= endTime) {
        temp_data.push(item);
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
  showLine = () => {
    const {data} = this.state;
    const filterResult = this.filterData(data);
    const temp_data = filterResult[0];
    const max_value = filterResult[1];
    const min_value = filterResult[2];
    
    const config = {
      title: {
        visible: true,
        text:'预测与实际趋势图'
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
      seriesField: 'type',
      responsive: true,
      animation: {
        appear: {
          animation: 'clipingWithData',
        },
      },
      smooth: true,
    };
    const linePlot = new Line(document.getElementById('graph-container'), config);
    this.setState({linePlot});
    linePlot.render();
  }
  async componentDidMount() {
    console.log(this.state.data === null ? 1 : this.state.data)
    if (!this.state.data) {
      let data = await this.quotationService.getData(2001, null);
      data = data.data;
      const length = data.length;
      let endTime = moment(data[length - 1]['time']).format('YYYY-MM-DD');
      let startTime = moment(endTime).subtract(100, 'days').format('YYYY-MM-DD');
      console.log(endTime, startTime);
      this.setState({data: data, startTime: startTime, endTime: endTime});
    }
    this.showLine()
  }

  onAfterChange (value) {
    const startPoint = value[0];
    const endPoint = value[1];
    this.setState({startPoint, endPoint});
    const {data, linePlot} = this.state;
    const temp_data = this.filterData(data);
    linePlot.changeData(temp_data);
  }
  async sliderChange(value, quotationService) {
    value = 2001 + value * 19 /100;
    let data = await quotationService.getData(value);
    const lookingTime = [moment(`${value}-01-01`, dateFormat), moment(`${value}-03-01`, dateFormat)]
    await this.setState({data: data.data, lookingTime});
    const filterResult = this.filterData(data.data);
    const temp_data = filterResult[0];
    const max_value = filterResult[1];
    const min_value = filterResult[2];
    const {linePlot} = this.state;
    linePlot.updateConfig({
      data: temp_data,
      yAxis: {
        min: min_value,
        max: max_value
      }
    });
    linePlot.render();
  }
  getData = async (year) => {
    if (year !== this.state.lookingYear) {
      const responce = await this.quotationService.getData(year, year+1);
      await this.setState({data: responce.data, lookingYear: year});
    } 
    return this.state.data;
  }
  onRangeChange = async (v) => {
    await this.setState({lookingTime: [v[0], v[1]]})
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
    const filterResult = this.filterData(data)
    const temp_data = filterResult[0];
    const max_value = filterResult[1];
    const min_value = filterResult[2];
    linePlot.updateConfig({
      data: temp_data,
      yAxis: {
        min: min_value,
        max: max_value
      }});
    linePlot.render();
    return;
  }

  render() {
    const marks = {
      0: 2001,
      100: 2020
    };
    return (
    <div>
    {/* <div><strong>选择查看的年份</strong></div>
    <Slider
      defaultValue={0}
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
    <div id='graph-container' />
    </div>
  ); 
  }
}

