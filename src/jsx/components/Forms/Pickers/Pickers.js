import React, { useState, Fragment } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import TimePicker from './TimePicker';
import Gradient from "./LinearGradientPicker";
import PageTitle from "../../../layouts/PageTitle";

const Pickers = () => {
  const [colorChange, setColorChange] = useState(null);

  // Date Range Pickers
  const dateRangePickers = [
    {
      title: "Date Range Pick",
      settings: { startDate: '10/5/2022', endDate: '3/6/2022' }
    },
    {
      title: "Date Range With Time"
    }
  ];

  // Time Pickers
  const timePickers = [
    { title: "Complex mode", className: "" },
    { title: "Auto close Clock Picker", className: "style-1" },
    { title: "Now time", className: "" },
    { title: "Left Placement", className: "style-1" }
  ];

  return (
    <Fragment>
      <PageTitle activeMenu="Pickers" motherMenu="Form" pageContent="Pickers" />

      <div className="row">
        {/* Date Range Pickers Section */}
        <div className="col-xl-9 col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Date Picker</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {dateRangePickers.map((picker, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div className="example rangeDatePicker">
                      <p className="mb-1">{picker.title}</p>
                      <DateRangePicker {...(picker.settings ? { initialSettings: picker.settings } : {})}>
                        <input type="text" className="form-control input-daterange-timepicker" />
                      </DateRangePicker>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Single Date Picker */}
        <div className="col-xl-3 col-lg-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Pick-Date picker</h4>
            </div>
            <div className="card-body">
              <p className="mb-1">Default picker</p>
              <DatePicker className="form-control"/> 
            </div>
          </div>
        </div>

        {/* Time Pickers Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Date picker</h4>
            </div>
            <div className="card-body">
              <div className="row picker-data">
                {timePickers.map((picker, index) => (
                  <div key={index} className="col-md-6 col-xl-3 col-xxl-6 mb-3">
                    <div className={`color-time-picker ${picker.className}`}>
                      <p className="mb-1">{picker.title}</p>
                      <TimePicker />			
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Color Picker Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Color Picker</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-xl-4 col-lg-6 mb-3">
                  <div className="example">
                    <p className="mb-1">Default Clock Picker</p>
                    <input
                      type="color"
                      className="as_colorpicker form-control"
                      value={colorChange}
                      onChange={(e) => setColorChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Pickers;