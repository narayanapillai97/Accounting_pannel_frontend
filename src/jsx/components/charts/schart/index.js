import React from "react";
import { Row, Col, Card } from "react-bootstrap";

import PageTitle from "../../../layouts/PageTitle";

import BarChartNoPadding from "./BarChartNoPadding";
import PositiveNegativeChart from "./PositiveNagative2";
import TinyLineChart from "./TinyLineChart";
import LegendEffectOpacity from "./LegendEffectOpacity";

import "../../../../../src/css/rechartStyles.css"; // Make sure to create this file

function SchartJs() {
  return (
    <>
      <PageTitle motherMenu="Charts" activeMenu="ReChartJs" />
      <Row>
        <Col xl={6} lg={6}>
          <Card className="sChartCard elevated-chart-card">
            <Card.Header>
              <h4 className="card-title">Basic Bar Chart</h4>
            </Card.Header>
            <Card.Body>
              <BarChartNoPadding />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} lg={6}>
          <Card className="sChartCard elevated-chart-card">
            <Card.Header>
              <h4 className="card-title">Positive & Negative Bar Chart</h4>
            </Card.Header>
            <Card.Body>
              <PositiveNegativeChart />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} lg={6}>
          <Card className="sChartCard elevated-chart-card">
            <Card.Header>
              <h4 className="card-title">Tiny Line Chart</h4>
            </Card.Header>
            <Card.Body>
              <TinyLineChart />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} lg={6}>
          <Card className="sChartCard elevated-chart-card">
            <Card.Header>
              <h4 className="card-title">Line Chart with Legend Effect</h4>
            </Card.Header>
            <Card.Body>
              <LegendEffectOpacity />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default SchartJs;
