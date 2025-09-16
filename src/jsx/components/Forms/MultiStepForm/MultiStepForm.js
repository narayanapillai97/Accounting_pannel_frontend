import React, { Fragment, useState } from "react";
import { Stepper, Step } from 'react-form-stepper';
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import PageTitle from "../../../layouts/PageTitle";

const Wizard = () => {
  const [goSteps, setGoSteps] = useState(0);
   
  return (
    <Fragment>
      <PageTitle activeMenu="Components" motherMenu="Home" />

      <div className="s-row">
        <div className="s-col-xl-12 s-col-xxl-12">
          <div className="s-card">
            <div className="s-card-header">
              <h4 className="s-card-title">Form step</h4>
            </div>
            <div className="s-card-body">
              <div className="s-form-wizard">
                <Stepper className="s-nav-wizard" activeStep={goSteps} label={false}>
                  <Step className="s-nav-link" onClick={() => setGoSteps(0)} />
                  <Step className="s-nav-link" onClick={() => setGoSteps(1)} />
                  <Step className="s-nav-link" onClick={() => setGoSteps(2)} />
                  <Step className="s-nav-link" onClick={() => setGoSteps(3)} />
                </Stepper>
              {goSteps === 0 && (
                <>
                  <StepOne />  
                  <div className="s-text-end s-toolbar s-toolbar-bottom s-p-2">
                    <button className="s-btn s-btn-primary s-sw-btn-next" onClick={() => setGoSteps(1)}>Next</button>
                  </div>  
                </>
              )}
              {goSteps === 1 && (
                <>
                  <StepTwo />
                  <div className="s-text-end s-toolbar s-toolbar-bottom s-p-2">
                    <button className="s-btn s-btn-secondary s-sw-btn-prev s-me-1" onClick={() => setGoSteps(0)}>Prev</button>
                    <button className="s-btn s-btn-primary s-sw-btn-next s-ms-1" onClick={() => setGoSteps(2)}>Next</button>
                  </div>  
                </>
              )}
              {goSteps === 2 && (
                <>
                  <StepThree />
                  <div className="s-text-end s-toolbar s-toolbar-bottom s-p-2">
                    <button className="s-btn s-btn-secondary s-sw-btn-prev s-me-1" onClick={() => setGoSteps(1)}>Prev</button>
                    <button className="s-btn s-btn-primary s-sw-btn-next s-ms-1" onClick={() => setGoSteps(3)}>Next</button>
                  </div>  
                </>
              )}
              {goSteps === 3 && (
                <>  
                  <StepFour />
                  <div className="s-text-end s-toolbar s-toolbar-bottom s-p-2">
                    <button className="s-btn s-btn-secondary s-sw-btn-prev s-me-1" onClick={() => setGoSteps(2)}>Prev</button>
                    <button className="s-btn s-btn-primary s-sw-btn-next s-ms-1" onClick={() => setGoSteps(4)}>Submit</button>
                  </div>  
                </>  
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Wizard;