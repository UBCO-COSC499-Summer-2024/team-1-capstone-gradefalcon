import React from "react";
import App from "../../App";
// import { ByClickingContinueYouAgreeToOurTermsOfServiceAndPrivacyPolicy } from "./ByClickingContinueYouAgreeToOurTermsOfServiceAndPrivacyPolicy";
// import { Google } from "./Google";
import '../../css/Signup.css';

export const InstructorSignup = () => {
  return (
    <div className="instructor-signup">
      <div className="div">
        <div className="text-wrapper">App</div>
        <div className="overlap-group">
          <div className="content">
            <div className="copy">
              <div className="text-wrapper-2">Create an account</div>
              <p className="p">Enter your email to sign up for this app</p>
            </div>
            <div className="input-and-button">
              <input className="field" id="input-1" placeholder="CoolProf@thebest.com" type="email" />
              <button className="button">
                <label className="label" htmlFor="input-1">
                  Sign up with email
                </label>
              </button>
            </div>
            <div className="divider">
              <div className="rectangle" />
              <div className="text-wrapper-3">or continue with</div>
              <div className="rectangle" />
            </div>
            <div className="button-2">
              <div className="text-wrapper-4">Google</div>
              {/* <Google className="google-instance" /> */}
            </div>
            {/* <ByClickingContinueYouAgreeToOurTermsOfServiceAndPrivacyPolicy className="by-clicking-continue" /> */}
          </div>
          <App />
        </div>
      </div>
    </div>
  );
};

export default InstructorSignup;
