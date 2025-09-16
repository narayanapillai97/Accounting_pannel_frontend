import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import avatar3 from "../../../images/avatar/3.jpg";
import { Link } from "react-router-dom";
import '../../../../src/css/bootstraptable.css';

const BootstrapTable = () => {
  const chackbox = document.querySelectorAll(".s-exam-topper input");
  const motherChackBox = document.querySelector(".s-exam-topper-all input");
  
  const chackboxFun = (type) => {
    for (let i = 0; i < chackbox.length; i++) {
      const element = chackbox[i];
      if (type === "all") {
        if (motherChackBox.checked) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      } else {
        if (!element.checked) {
          motherChackBox.checked = false;
          break;
        } else {
          motherChackBox.checked = true;
        }
      }
    }
  };

  const svg1 = (
    <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect x="0" y="0" width="24" height="24"></rect>
        <circle fill="#000000" cx="5" cy="12" r="2"></circle>
        <circle fill="#000000" cx="12" cy="12" r="2"></circle>
        <circle fill="#000000" cx="19" cy="12" r="2"></circle>
      </g>
    </svg>
  );

  return (
    <Fragment>
      <PageTitle activeMenu="Table" motherMenu="Bootstrap" />
      <Row className="s-table-container">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Recent Payments Queue</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="s-width80"><strong>#</strong></th>
                    <th><strong>PATIENT</strong></th>
                    <th><strong>DR NAME</strong></th>
                    <th><strong>DATE</strong></th>
                    <th><strong>STATUS</strong></th>
                    <th><strong>PRICE</strong></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>01</strong></td>
                    <td>Mr. Bobby</td>
                    <td>Dr. Jackson</td>
                    <td>01 August 2022</td>
                    <td><Badge variant="success light">Successful</Badge></td>
                    <td>$21.56</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" className="s-light s-sharp s-false">
                          {svg1}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Edit</Dropdown.Item>
                          <Dropdown.Item>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>02</strong></td>
                    <td>Mr. Bobby</td>
                    <td>Dr. Jackson</td>
                    <td>01 August 2022</td>
                    <td><Badge variant="danger light">Canceled</Badge></td>
                    <td>$21.56</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="danger" className="s-light s-sharp s-false">
                          {svg1}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Edit</Dropdown.Item>
                          <Dropdown.Item>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>03</strong></td>
                    <td>Mr. Bobby</td>
                    <td>Dr. Jackson</td>
                    <td>01 August 2022</td>
                    <td><Badge variant="warning light">Pending</Badge></td>
                    <td>$21.56</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="warning" className="s-light s-sharp s-false">
                          {svg1}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Edit</Dropdown.Item>
                          <Dropdown.Item>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Exam Toppers</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="s-width50">
                      <div className="form-check custom-checkbox checkbox-success check-lg me-3 s-exam-topper-all">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="checkAll"
                          required=""
                          onClick={() => chackboxFun("all")}
                        />
                        <label className="form-check-label" htmlFor="checkAll"></label>
                      </div>
                    </th>
                    <th><strong>ROLL NO.</strong></th>
                    <th><strong>NAME</strong></th>
                    <th><strong>Email</strong></th>
                    <th><strong>Date</strong></th>
                    <th><strong>Status</strong></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="form-check custom-checkbox checkbox-success check-lg me-3 s-exam-topper">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customCheckBox2"
                          required=""
                          onClick={() => chackboxFun()}
                        />
                        <label className="form-check-label" htmlFor="customCheckBox2"></label>
                      </div>
                    </td>
                    <td><strong>542</strong></td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={avatar1} className="rounded-lg me-2" width="24" alt="" />
                        <span className="s-w-space-no">Dr. Jackson</span>
                      </div>
                    </td>
                    <td>example@example.com</td>
                    <td>01 August 2022</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-circle text-success me-1"></i> Successful
                      </div>
                    </td>
                    <td>
                      <div className="d-flex">
                        <Link to="#" className="btn btn-primary shadow btn-xs sharp me-1">
                          <i className="fas fa-pencil-alt"></i>
                        </Link>
                        <Link to="#" className="btn btn-danger shadow btn-xs sharp">
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="form-check custom-checkbox checkbox-success check-lg me-3 s-exam-topper">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customCheckBox3"
                          required=""
                          onClick={() => chackboxFun()}
                        />
                        <label className="form-check-label" htmlFor="customCheckBox3"></label>
                      </div>
                    </td>
                    <td><strong>542</strong></td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={avatar2} className="rounded-lg me-2" width="24" alt="" />
                        <span className="s-w-space-no">Dr. Jackson</span>
                      </div>
                    </td>
                    <td>example@example.com</td>
                    <td>01 August 2022</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-circle text-danger me-1"></i> Canceled
                      </div>
                    </td>
                    <td>
                      <div className="d-flex">
                        <Link to="#" className="btn btn-primary shadow btn-xs sharp me-1">
                          <i className="fas fa-pencil-alt"></i>
                        </Link>
                        <Link to="#" className="btn btn-danger shadow btn-xs sharp">
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Additional tables with similar class name updates */}
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Basic Table</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive className="s-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Kolor Tea Shirt For Man</td>
                    <td><Badge variant="primary light">Sale</Badge></td>
                    <td>January 22</td>
                    <td className="text-primary">$21.56</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Kolor Tea Shirt For Women</td>
                    <td><Badge variant="success">Tax</Badge></td>
                    <td>January 30</td>
                    <td className="text-success">$55.32</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Primary Table</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive className="s-primary-table-bordered">
                <thead className="s-thead-primary">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title>Contextual Table</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive className="s-header-border">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Column heading</th>
                    <th>Column heading</th>
                    <th>Column heading</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="s-bg-active">
                    <td>1</td>
                    <td>Column content</td>
                    <td>Column content</td>
                    <td>Column content</td>
                  </tr>
                  <tr className="s-bg-primary">
                    <td>1</td>
                    <td>Column content</td>
                    <td>Column content</td>
                    <td>Column content</td>
                  </tr>
                  <tr className="s-bg-success">
                    <td>2</td>
                    <td>Column content</td>
                    <td>Column content</td>
                    <td>Column content</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default BootstrapTable;