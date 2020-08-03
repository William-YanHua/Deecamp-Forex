import React from "react";
import { Line } from '@antv/g2plot';
import moment from 'moment';

export default class MarketOverview extends React.Component {
  state = {
    data: [
      {
        date: '2018/8/1 10:00',
        type: 'predict',
        value: 4623,
        strategy: '买入'
      },
      {
        date: '2018/8/1 10:00',
        type: 'groundTruth',
        value: 2208,
      },
      {
        date: '2018/8/1 11:00',
        type: 'predict',
        value: 1824,
      },
      {
        date: '2018/8/1 11:00',
        type: 'groundTruth',
        value: 6145,
      },
      {
        date: '2018/8/1 12:00',
        type: 'predict',
        value: 2016,
      },
      {
        date: '2018/8/1 12:00',
        type: 'groundTruth',
        value: 2570,
      },
      {
        date: '2018/8/1 13:00',
        type: 'predict',
        value: 5080,
        strategy: '卖出'
      },
      {
        date: '2018/8/1 13:00',
        type: 'groundTruth',
        value: 2916,
      },
      {
        date: '2018/8/1 14:00',
        type: 'predict',
        value: 2890,
        strategy: '买入'
      },
      {
        date: '2018/8/1 14:00',
        type: 'groundTruth',
        value: 6268,
      },
      {
        date: '2018/8/1 15:00',
        type: 'predict',
        value: 4512,
      },
      {
        date: '2018/8/1 15:00',
        type: 'groundTruth',
        value: 4280,
      },
      {
        date: '2018/8/1 16:00',
        type: 'predict',
        value: 6411,
      },
      {
        date: '2018/8/1 16:00',
        type: 'groundTruth',
        value: 8281,
      },
      {
        date: '2018/8/1 17:00',
        type: 'predict',
        value: 6190,
      },
      {
        date: '2018/8/1 17:00',
        type: 'groundTruth',
        value: 1890,
      }
    ]
  }
  componentDidMount() {
    const data = this.state.data;
    let inData = [];
    let outData = [];
    data.forEach(item => {
      if (item.strategy) {
        if (item.strategy === '买入') {
          inData.push(item);
        } else {
          outData.push(item);
        }
      }
    })
    const config = {
      title: {
        visible: true,
        text:'预测与实际趋势图'
      },
      padding: 'auto',
      forceFit: true,
      data,
      xField: 'date',
      yField: 'value',
      legend: {
        position: 'right-top',
      },
      seriesField: 'type',
      responsive: true,
      markerPoints: [
        {
          visible: true,
          data: inData,
          label: {
            visible: true,
            field: 'strategy',
          },
          style: {
            big: {stroke: 'rgba(255, 0, 255, 0.7)', lineWidth: 4}
          }
        },
        {
          visible: true,
          data: outData,
          symbol: 'cross',
          label: {
            visible: true,
            field: 'strategy'
          },
          style: {
            normal: { stroke: 'rgba(255, 0, 0, 0.65)', lineWidth: 4 },
          },
        }
      ],
    };
    const linePlot = new Line(document.getElementById('graph-container'), config);
    linePlot.render();
  }
  render() {
    
    return (
    <div>
      <div id='graph-container' />
    </div>
  ); 
  }
}
