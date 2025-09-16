import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../../layouts/PageTitle";
import { Formik } from "formik";
import * as Yup from "yup";

// Validation Schemas
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Your username must consist of at least 3 characters")
    .max(50, "Your username must be less than 50 characters")
    .required("Please enter a username"),
  password: Yup.string()
    .min(5, "Your password must be at least 5 characters long")
    .max(50, "Your password must be less than 50 characters")
    .required("Please provide a password"),
});

const FormValidation = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Fragment>
      <PageTitle
        activeMenu="Validation"
        motherMenu="Form"
        pageContent="Validation"
      />

      <div className="row">
        <MainForm />
        <VerticalFormWithIcon 
          loginSchema={loginSchema}
          onSubmit={handleLoginSubmit}
          showPassword={showPassword}
          togglePassword={togglePasswordVisibility}
        />
      </div>
    </Fragment>
  );
};

// Main Form Component
const MainForm = () => (
  <div className="col-lg-12">
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Form Validation</h4>
      </div>
      <div className="card-body">
        <div className="form-validation">
          <form className="form-valide" action="#" method="post" onSubmit={(e) => e.preventDefault()}>
            <div className="row">
              <LeftFormSection />
              <RightFormSection />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

// Left Section of Main Form
const LeftFormSection = () => (
  <div className="col-xl-6">
    <FormField 
      label="Username" 
      id="val-username" 
      type="text" 
      placeholder="Enter a username.." 
      required 
    />
    <FormField 
      label="Email" 
      id="val-email" 
      type="text" 
      placeholder="Your valid email.." 
      required 
    />
    <FormField 
      label="Password" 
      id="val-password" 
      type="password" 
      placeholder="Choose a safe one.." 
      required 
    />
    <FormField 
      label="Confirm Password" 
      id="val-confirm-password" 
      type="password" 
      placeholder="..and confirm it!" 
      required 
    />
    <div className="form-group mb-3 row">
      <label className="col-lg-4 col-form-label" htmlFor="val-suggestions">
        Suggestions <span className="text-danger">*</span>
      </label>
      <div className="col-lg-6">
        <textarea
          className="form-control"
          id="val-suggestions"
          name="val-suggestions"
          rows="5"
          placeholder="What would you like to see?"
        ></textarea>
      </div>
    </div>
  </div>
);

// Right Section of Main Form
const RightFormSection = () => (
  <div className="col-xl-6">
    <SelectField 
      label="Best Skill" 
      id="val-skill" 
      options={[
        {value: "", label: "Please select"},
        {value: "html", label: "HTML"},
        {value: "css", label: "CSS"},
        {value: "javascript", label: "JavaScript"},
        {value: "angular", label: "Angular"},
        {value: "react", label: "React"},
        {value: "vuejs", label: "Vue.js"},
        {value: "ruby", label: "Ruby"},
        {value: "php", label: "PHP"},
        {value: "asp", label: "ASP.NET"},
        {value: "python", label: "Python"},
        {value: "mysql", label: "MySQL"}
      ]} 
      required 
    />
    <FormField 
      label="Currency" 
      id="val-currency" 
      type="text" 
      placeholder="$21.60" 
      required 
    />
    <FormField 
      label="Website" 
      id="val-website" 
      type="text" 
      placeholder="http://example.com" 
      required 
    />
    <FormField 
      label="Phone (US)" 
      id="val-phoneus" 
      type="text" 
      placeholder="212-999-0000" 
      required 
    />
    <FormField 
      label="Digits" 
      id="val-digits" 
      type="text" 
      placeholder="5" 
      required 
    />
    <FormField 
      label="Number" 
      id="val-number" 
      type="text" 
      placeholder="5.0" 
      required 
    />
    <FormField 
      label="Range [1, 5]" 
      id="val-range" 
      type="text" 
      placeholder="4" 
      required 
    />
    <TermsAndConditions />
    <SubmitButton />
  </div>
);

// Vertical Form with Icon Component
const VerticalFormWithIcon = ({ loginSchema, onSubmit, showPassword, togglePassword }) => (
  <div className="col-lg-12">
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Vertical Forms with icon</h4>
      </div>
      <div className="card-body">
        <div className="basic-form">
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <UsernameField 
                  values={values} 
                  errors={errors} 
                  handleChange={handleChange} 
                  handleBlur={handleBlur} 
                />
                <PasswordField 
                  values={values} 
                  errors={errors} 
                  handleChange={handleChange} 
                  handleBlur={handleBlur} 
                  showPassword={showPassword} 
                  togglePassword={togglePassword} 
                />
                <CheckboxField id="checkbox1" label="Check me out" />
                <FormActions isSubmitting={isSubmitting} />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  </div>
);

// Reusable Components
const FormField = ({ label, id, type, placeholder, required }) => (
  <div className="form-group mb-3 row">
    <label className="col-lg-4 col-form-label" htmlFor={id}>
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <div className="col-lg-6">
      <input
        type={type}
        className="form-control"
        id={id}
        name={id}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const SelectField = ({ label, id, options, required }) => (
  <div className="form-group mb-3 row">
    <label className="col-lg-4 col-form-label" htmlFor={id}>
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <div className="col-lg-6">
      <select className="form-control" id={id} name={id}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const TermsAndConditions = () => (
  <div className="form-group mb-3 row">
    <label className="col-lg-4 col-form-label">
      <Link to="form-validation">Terms &amp; Conditions</Link>{" "}
      <span className="text-danger">*</span>
    </label>
    <div className="col-lg-8">
      <label className="form-check css-control-primary css-checkbox" htmlFor="val-terms">
        <input
          type="checkbox"
          className="form-check-input me-2 mt-0"
          id="val-terms"
          name="val-terms"
          value="1"
        />
        <span className="css-control-indicator"></span> Agree to terms and conditions
      </label>
    </div>
  </div>
);

const SubmitButton = () => (
  <div className="form-group mb-3 row">
    <div className="col-lg-8 ms-auto">
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </div>
  </div>
);

const UsernameField = ({ values, errors, handleChange, handleBlur }) => (
  <div className={`form-group mb-3 ${values.username ? errors.username ? "is-invalid" : "is-valid" : ""}`}>
    <label className="text-label">Username</label>
    <div className="input-group">
      <span className="input-group-text">
        <i className="fa fa-user" />
      </span>
      <input
        type="text"
        className="form-control"
        id="val-username1"
        placeholder="Enter a username.."
        name="username"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.username}
      />
      {errors.username && (
        <div id="val-username1-error" className="invalid-feedback animated fadeInUp" style={{ display: "block" }}>
          {errors.username}
        </div>
      )}
    </div>
  </div>
);

const PasswordField = ({ values, errors, handleChange, handleBlur, showPassword, togglePassword }) => (
  <div className={`form-group mb-3 ${values.password ? errors.password ? "is-invalid" : "is-valid" : ""}`}>
    <label className="text-label">Password *</label>
    <div className="input-group transparent-append mb-2">
      <span className="input-group-text">
        <i className="fa fa-lock" />
      </span>
      <input
        type={showPassword ? "text" : "password"}
        className="form-control"
        id="val-password1"
        name="password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
        placeholder="Choose a safe one.."
      />
      <div className="input-group-text show-validate" onClick={togglePassword}>
        {showPassword ? <i className="fa fa-eye" /> : <i className="fa fa-eye-slash" />}
      </div>
      {errors.password && (
        <div id="val-password1-error" className="invalid-feedback animated fadeInUp" style={{ display: "block" }}>
          {errors.password}
        </div>
      )}
    </div>
  </div>
);

const CheckboxField = ({ id, label }) => (
  <div className="form-group mb-3">
    <div className="form-check">
      <input id={id} className="form-check-input" type="checkbox" />
      <label htmlFor={id} className="form-check-label">
        {label}
      </label>
    </div>
  </div>
);

const FormActions = ({ isSubmitting }) => (
  <>
    <button type="submit" className="btn me-2 btn-primary" disabled={isSubmitting}>
      Submit
    </button>
    <button className="btn btn-danger light">
      Cancel
    </button>
  </>
);

export default FormValidation;