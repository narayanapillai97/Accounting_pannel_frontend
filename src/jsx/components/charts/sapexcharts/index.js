import React from "react";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import PageTitle from "../../../layouts/PageTitle";
import '../../../../../src/css/ApexChart.css';

// Lazy-loaded chart components
const ApexBar2 = loadable(() => pMinDelay(import("./Bar2"), 1000));
const ApexBar3 = loadable(() => pMinDelay(import("./Bar3"), 1000));
const ApexRedialBar = loadable(() => pMinDelay(import("./RadialBar"), 1000));
const ApexLine = loadable(() => pMinDelay(import("./Line5"), 1000));
const ApexLine3 = loadable(() => pMinDelay(import("./Line3"), 1000));
const ApexLine4 = loadable(() => pMinDelay(import("./Line4"), 1000));
const ApexPie = loadable(() => pMinDelay(import("./Pie4"), 1000));
const ApexPie5 = loadable(() => pMinDelay(import("./Pie5"), 1000));

function ApexChart() {
  return (
    <div className="apex-chart-container">
      <PageTitle motherMenu="Charts" activeMenu="ApexChart" />
      <div className="chart-grid">
        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Bar Chart</h4>
            </div>
            <div className="chart-body">
              <ApexBar2 />
            </div>
          </div>
        </div>
        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Bar Chart</h4>
            </div>
            <div className="chart-body">
              <ApexBar3 />
            </div>
          </div>
        </div>

        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Line Chart</h4>
            </div>
            <div className="chart-body">
              <ApexLine />
            </div>
          </div>
        </div>
        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header"> 
              <h4 className="chart-title">Line Chart</h4>
            </div>
            <div className="chart-body">
              <ApexLine3 />
            </div>
          </div>
        </div>
        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Line Chart</h4>
            </div>
            <div className="chart-body">
              <ApexLine4 />
            </div>
          </div>
        </div>
        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Pie Chart</h4>
            </div>
            <div className="chart-body mt-5">
              <ApexPie />
            </div>
          </div>
        </div>
        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Pie Chart</h4>
            </div>
            <div className="chart-body">
              <ApexPie5 />
            </div>
          </div>
        </div>
        <div className="chart-col">
          <div className="chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Radial Bar</h4>
            </div>
            <div className="chart-body">
              <ApexRedialBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApexChart;