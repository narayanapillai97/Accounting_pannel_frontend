import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import DropFile from "./DropFile";
import PageTitle from "../../../../layouts/PageTitle";

// ✅ import the CSS AFTER your theme/bootstrap so it overrides them
import "../../../../../../src/css/email.css";

const Compose = () => {
  return (
    <Fragment>
      <PageTitle activeMenu="Compose" motherMenu="Email" pageContent="Email" />

      <div className="row">
        <div className="col-lg-12">
          <div className="s-card">
            <div className="s-card-body">
              <div className="row">
                {/* ========== Left Sidebar ========== */}
                <div className="col-xl-3 col-lg-4">
                  <div className="s-email-left-box">
                    <div className="s-p-0">
                      <Link to="/email-compose" className="s-btn s-btn-primary s-btn-block s-btn-lg">
                        Compose
                      </Link>
                    </div>

                    <div className="s-mail-list s-rounded mt-4">
                      <Link to="/email-inbox" className="s-list-group-item s-active">
                        <i className="fa fa-inbox s-icon-18 align-middle me-2"></i>
                        Inbox
                        <span className="s-badge s-badge-primary s-badge-sm float-end">198</span>
                      </Link>
                      <Link to="/email-compose" className="s-list-group-item">
                        <i className="fa fa-paper-plane s-icon-18 align-middle me-2"></i>
                        Sent
                      </Link>
                      <Link to="/email-compose" className="s-list-group-item">
                        <i className="fas fa-star s-icon-18 align-middle me-2"></i>
                        Important
                        <span className="s-badge s-badge-primary s-badge-sm float-end">47</span>
                      </Link>
                      <Link to="/email-compose" className="s-list-group-item">
                        <i className="mdi mdi-file-document-box s-icon-18 align-middle me-2"></i>
                        Draft
                      </Link>
                      <Link to="/email-compose" className="s-list-group-item">
                        <i className="fa fa-trash s-icon-18 align-middle me-2"></i>
                        Trash
                      </Link>
                    </div>

                    <div className="s-mail-list s-rounded overflow-hidden mt-4">
                      <div className="s-intro-title d-flex justify-content-between my-0">
                        <h5>Categories</h5>
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>
                      </div>
                      <Link to="/email-inbox" className="s-list-group-item">
                        <span className="s-icon-warning">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Work
                      </Link>
                      <Link to="/email-inbox" className="s-list-group-item">
                        <span className="s-icon-primary">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Private
                      </Link>
                      <Link to="/email-inbox" className="s-list-group-item">
                        <span className="s-icon-success">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Support
                      </Link>
                      <Link to="/email-inbox" className="s-list-group-item">
                        <span className="s-icon-dpink">
                          <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                        Social
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ========== Right Content ========== */}
                <div className="col-xl-9 col-lg-8">
                  <div className="s-email-right-box ms-0 ms-sm-4 ms-sm-0">
                    {/* Toolbar */}
                    <div className="s-toolbar mb-4" role="toolbar">
                      <div className="s-btn-group mb-1">
                        <button type="button" className="s-btn s-btn-primary s-btn-icon">
                          <i className="fa fa-archive"></i>
                        </button>
                        <button type="button" className="s-btn s-btn-primary s-btn-icon">
                          <i className="fa fa-exclamation-circle"></i>
                        </button>
                        <button type="button" className="s-btn s-btn-primary s-btn-icon">
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>

                      <Dropdown className="s-btn-group mb-1">
                        <Dropdown.Toggle className="s-btn s-btn-primary s-btn-icon dropdown-toggle">
                          <i className="fa fa-folder"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as="a">Social</Dropdown.Item>
                          <Dropdown.Item as="a">Promotions</Dropdown.Item>
                          <Dropdown.Item as="a">Updates</Dropdown.Item>
                          <Dropdown.Item as="a">Forums</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      <Dropdown className="s-btn-group mb-1">
                        <Dropdown.Toggle className="s-btn s-btn-primary s-btn-icon dropdown-toggle">
                          <i className="fa fa-tag"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as="a">Updates</Dropdown.Item>
                          <Dropdown.Item as="a">Social</Dropdown.Item>
                          <Dropdown.Item as="a">Promotions</Dropdown.Item>
                          <Dropdown.Item as="a">Forums</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      <Dropdown className="s-btn-group mb-1">
                        <Dropdown.Toggle className="s-btn s-btn-primary dropdown-toggle s-btn-pill">
                          More <span className="caret m-l-5"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Mark as Unread</Dropdown.Item>
                          <Dropdown.Item>Add to Tasks</Dropdown.Item>
                          <Dropdown.Item>Add Star</Dropdown.Item>
                          <Dropdown.Item>Mute</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    {/* Compose form */}
                    <div className="s-compose-content">
                      <form action="#">
                        <div className="s-form-group mb-3">
                          <input
                            type="text"
                            className="s-form-control s-bg-transparent"
                            placeholder=" To:"
                          />
                        </div>
                        <div className="s-form-group mb-3">
                          <input
                            type="text"
                            className="s-form-control s-bg-transparent"
                            placeholder=" Subject:"
                          />
                        </div>
                        <div className="s-form-group mb-3">
                          <textarea
                            id="s-email-compose-editor"
                            className="s-textarea-editor s-form-control s-bg-transparent"
                            rows="8"
                            placeholder="Enter text ..."
                          ></textarea>
                        </div>
                      </form>

                      <h5 className="mb-4">
                        <i className="fa fa-paperclip"></i> Attachment
                      </h5>
                      <DropFile />
                    </div>

                    {/* Actions */}
                    <div className="text-left mt-4 mb-5">
                      <button className="s-btn s-btn-primary me-2" type="button">
                        <span className="me-2">
                          <i className="fa fa-paper-plane"></i>
                        </span>
                        Send
                      </button>
                      <button className="s-btn s-btn-ghost-danger" type="button">
                        <span className="me-2">
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                        Discard
                      </button>
                    </div>
                  </div>
                </div>
                {/* ========== /Right Content ========== */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Compose;
