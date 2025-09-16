// File: TextFields.jsx
import React, { useState } from "react";
import "../../../../css/otherTextFileds.css";

export default function TextFields() {
  const [values, setValues] = useState({
    title: "",
    description: "",
    serviceType: "xray",
    urgent: false,
    options: {
      followUp: false,
      homeVisit: false
    },
    priority: "normal",
    quantity: 1
  });

  function handleChange(e) {
    const { name, value, type, checked, dataset } = e.target;

    if (dataset.group) {
      setValues(prev => ({
        ...prev,
        options: {
          ...prev.options,
          [dataset.group]: checked
        }
      }));
      return;
    }

    if (type === "checkbox") {
      setValues(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === "number") {
      setValues(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }

    setValues(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: send values to backend or save template
    alert("Template saved (demo) — check console for values");
    console.log("Saved template:", values);
  }

  function handleReset() {
    setValues({
      title: "",
      description: "",
      serviceType: "xray",
      urgent: false,
      options: { followUp: false, homeVisit: false },
      priority: "normal",
      quantity: 1
    });
  }

  return (
    <div className="tb-container">
      <h2 className="tb-title">Create Template</h2>

      <form className="tb-form" onSubmit={handleSubmit}>
        <label className="tb-row">
          <span className="tb-label">Title</span>
          <input
            name="title"
            value={values.title}
            onChange={handleChange}
            className="tb-input"
            placeholder="Template title"
          />
        </label>

        <label className="tb-row">
          <span className="tb-label">Description</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            className="tb-textarea"
            placeholder="Short description"
          />
        </label>

        <div className="tb-row">
          <span className="tb-label">Service Type</span>
          <div className="tb-controls">
            <label className="tb-inline">
              <input
                type="radio"
                name="serviceType"
                value="xray"
                checked={values.serviceType === "xray"}
                onChange={handleChange}
              />
              <span> X-ray</span>
            </label>
            <label className="tb-inline">
              <input
                type="radio"
                name="serviceType"
                value="physio"
                checked={values.serviceType === "physio"}
                onChange={handleChange}
              />
              <span> Physio</span>
            </label>
            <label className="tb-inline">
              <input
                type="radio"
                name="serviceType"
                value="consult"
                checked={values.serviceType === "consult"}
                onChange={handleChange}
              />
              <span> Consultation</span>
            </label>
          </div>
        </div>

        <div className="tb-row">
          <span className="tb-label">Options</span>
          <div className="tb-controls">
            <label className="tb-switch">
              <input
                type="checkbox"
                name="urgent"
                checked={values.urgent}
                onChange={handleChange}
              />
              <span className="tb-switch-slider" />
              <span className="tb-switch-label">Urgent</span>
            </label>

            <label className="tb-checkbox">
              <input
                type="checkbox"
                data-group="followUp"
                checked={values.options.followUp}
                onChange={handleChange}
              />
              <span>Follow up</span>
            </label>

            <label className="tb-checkbox">
              <input
                type="checkbox"
                data-group="homeVisit"
                checked={values.options.homeVisit}
                onChange={handleChange}
              />
              <span>Home visit</span>
            </label>
          </div>
        </div>

        <div className="tb-row">
          <span className="tb-label">Priority</span>
          <select name="priority" value={values.priority} onChange={handleChange} className="tb-select">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <label className="tb-row">
          <span className="tb-label">Quantity</span>
          <input
            type="number"
            name="quantity"
            min="1"
            value={values.quantity}
            onChange={handleChange}
            className="tb-input tb-number"
          />
        </label>

        <div className="tb-actions">
          <button type="button" className="tb-btn tb-btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="tb-btn tb-btn-primary">
            Save Template
          </button>
        </div>
      </form>

      <div className="tb-preview">
        <h3>Preview</h3>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  );
}
