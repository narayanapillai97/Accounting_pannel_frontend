import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import PageTitle from "../../../layouts/PageTitle";
import {
  BarChart,
  LineChart,
  PieChart,
  DoughnutChart,
  RadarChart,
  PolarAreaChart,
  BubbleChart,
  ScatterChart
} from "../CustomChartComponents";

function ChartChartjs() {
  return (
    <>
      <PageTitle motherMenu="Charts" activeMenu="ChartJs" />
      <div className="s-chart-container">
        <Row>
          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Vertical Bar Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <BarChart
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Sales 2023',
                      data: [12, 19, 3, 5, 2, 3],
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1
                    }]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Horizontal Bar Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <BarChart
                  horizontal={true}
                  data={{
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                      label: 'Dataset 1',
                      data: [12, 19, 3, 5, 2, 3],
                      backgroundColor: 'rgba(255, 99, 132, 0.6)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1
                    }]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Multi-Series Line Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <LineChart
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                      {
                        label: 'Sales',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.1
                      },
                      {
                        label: 'Revenue',
                        data: [5, 10, 15, 8, 12, 18],
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        tension: 0.1
                      }
                    ]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Doughnut Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <DoughnutChart
                  data={{
                    labels: ['Red', 'Blue', 'Yellow'],
                    datasets: [{
                      label: 'My First Dataset',
                      data: [300, 50, 100],
                      backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                      ],
                      hoverOffset: 4
                    }]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Radar Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <RadarChart
                  data={{
                    labels: [
                      'Eating',
                      'Drinking',
                      'Sleeping',
                      'Designing',
                      'Coding',
                      'Cycling',
                      'Running'
                    ],
                    datasets: [{
                      label: 'My First Dataset',
                      data: [65, 59, 90, 81, 56, 55, 40],
                      fill: true,
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderColor: 'rgb(255, 99, 132)',
                      pointBackgroundColor: 'rgb(255, 99, 132)',
                      pointBorderColor: '#fff',
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: 'rgb(255, 99, 132)'
                    }]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Bubble Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <BubbleChart
                  data={{
                    datasets: [{
                      label: 'First Dataset',
                      data: [
                        {x: 20, y: 30, r: 15},
                        {x: 40, y: 10, r: 10},
                        {x: 30, y: 20, r: 20},
                        {x: 50, y: 40, r: 25},
                        {x: 60, y: 35, r: 15}
                      ],
                      backgroundColor: 'rgb(255, 99, 132)'
                    }]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Polar Area Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <PolarAreaChart
                  data={{
                    labels: [
                      'Red',
                      'Green',
                      'Yellow',
                      'Grey',
                      'Blue'
                    ],
                    datasets: [{
                      label: 'My Dataset',
                      data: [11, 16, 7, 3, 14],
                      backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(75, 192, 192)',
                        'rgb(255, 205, 86)',
                        'rgb(201, 203, 207)',
                        'rgb(54, 162, 235)'
                      ]
                    }]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col xl={6} lg={6}>
            <Card className="s-chart-card">
              <Card.Header className="s-chart-header">
                <h4 className="s-card-title">Scatter Chart</h4>
              </Card.Header>
              <Card.Body className="s-chart-body">
                <ScatterChart
                  data={{
                    datasets: [{
                      label: 'Scatter Dataset',
                      data: [{
                        x: -10,
                        y: 0
                      }, {
                        x: 0,
                        y: 10
                      }, {
                        x: 10,
                        y: 5
                      }, {
                        x: 0.5,
                        y: 5.5
                      }],
                      backgroundColor: 'rgb(255, 99, 132)'
                    }]
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ChartChartjs;