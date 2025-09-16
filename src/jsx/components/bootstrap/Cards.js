import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../layouts/PageTitle";
import img1 from "../../../images/card/1.png";
import img2 from "../../../images/card/2.png";
import img3 from "../../../images/card/img5.jpg";
import { Row, Col, Card, Button, Nav } from "react-bootstrap";
import "../../../../src/css/sCardStyles.css";

const UiCards = () => {
  return (
    <Fragment>
      <PageTitle activeMenu="Card" pageContent="Card" motherMenu="Bootstrap" />
      <Row>
        {/* Elevated Card */}
        <Col xl="6">
          <Card className="s-card s-elevated highlighted-card">
            <div className="s-header">
              <h5 className="mb-0">Elevated Card (Highlighted)</h5>
            </div>
            <div className="s-body">
              <p>
                This card is highlighted to draw attention. It uses shadow and
                border to stand out.
              </p>
            </div>
            <div className="s-footer">Last updated just now</div>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card s-glass">
            <div className="s-header">
              <h5 className="mb-0">Glass Card</h5>
            </div>
            <div className="s-body">
              <p>Frosted glass effect with blur background. Modern UI trend.</p>
            </div>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card s-neumorphism">
            <div className="s-header">
              <h5 className="mb-0">Neumorphism</h5>
            </div>
            <div className="s-body">
              <p>Soft UI with subtle shadows for 3D effect.</p>
            </div>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card s-gradient">
            <div className="s-header">
              <h5 className="mb-0 text-white">Gradient Card</h5>
            </div>
            <div className="s-body text-white">
              <p>Smooth color transition background.</p>
            </div>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card s-hoverable">
            <div className="s-header">
              <h5 className="mb-0">Hoverable Card</h5>
            </div>
            <div className="s-body">
              <p>Hover me to see the effect!</p>
            </div>
          </Card>
        </Col>
        <Col xl="6">
          <Card className="s-card s-elevated">
            <div className="s-header with-icon">
              <i className="bi bi-star-fill text-warning"></i>
              <h5 className="mb-0">Featured</h5>
            </div>
            <div className="s-body">
              <p>Card with icon in header for visual emphasis.</p>
            </div>
          </Card>
        </Col>
        <Col xl="6">
          <Card className="s-card s-stat">
            <div className="s-body text-center">
              <h3 className="mb-1">1,234</h3>
              <p className="text-muted">Total Users</p>
              <div className="stat-trend up">↑ 12%</div>
            </div>
          </Card>
        </Col>
        <Col xl="6">
          <Card className="s-card s-avatar">
            <div className="s-body text-center">
              {/* <img src={avatarImg} className="avatar" alt="User" /> */}
              <h5 className="mt-3 mb-1">John Doe</h5>
              <p className="text-muted">UX Designer</p>
            </div>
          </Card>
        </Col>
        <Col xl="6">
          <Card className="s-card s-action">
            <div className="s-header">
              <h5 className="mb-0">Action Required</h5>
            </div>
            <div className="s-body">
              <p>Complete your profile to get started.</p>
            </div>
            <div className="s-footer">
              <Button variant="primary">Take Action</Button>
            </div>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card s-expandable">
            <div className="s-header clickable">
              <h5 className="mb-0">Click to Expand</h5>
            </div>
            <div className="s-body collapse">
              <p>Hidden content that appears when clicked.</p>
            </div>
          </Card>
        </Col>
        <Col xl="6">
          <Card className="s-card s-split">
            <div className="s-header accent-blue">
              <h5 className="mb-0">Split Color</h5>
            </div>
            <div className="s-body">
              <p>Header with different accent color.</p>
            </div>
          </Card>
        </Col>

        {/* Outlined Card */}
        <Col xl="6">
          <Card className="s-card s-outlined">
            <div className="s-header">
              <h5 className="mb-0">Outlined Card</h5>
            </div>
            <div className="s-body">
              <p>
                This is clean and minimal with just a border. Use when subtle
                design is needed.
              </p>
            </div>
            <div className="s-footer">Last updated 1 min ago</div>
          </Card>
        </Col>

        {/* Flat Card */}
        <Col xl="6">
          <Card className="s-card s-flat">
            <div className="s-header">
              <h5 className="mb-0">Flat Card</h5>
            </div>
            <div className="s-body">
              <p>
                Flat design. No border or shadow. Used when UI needs to look
                seamless.
              </p>
            </div>
            <div className="s-footer">No border, no shadow</div>
          </Card>
        </Col>

        {/* Image Overlay Card */}
        <Col xl="6">
          <Card className="s-card s-image-overlay">
            <img src={img3} alt="Card with overlay" />
            <div className="s-image-content">
              <h5>Image Overlay Card</h5>
              <p>This card has an image background with text layered on top.</p>
            </div>
          </Card>
        </Col>

        {/* Existing Image Card */}
        <Col xl="6">
          <Card className="s-card s-elevated">
            {/* <img className="card-img-top img-fluid" src={img1} alt="Card cap" /> */}
            <div className="s-header">
              <h5 className="mb-0">Card with Image</h5>
            </div>
            <div className="s-body">
              <p>
                This is a wider card with supporting text below as a natural
                lead-in to additional content.
              </p>
              <p className="text-muted">Last updated 3 mins ago</p>
            </div>
          </Card>
        </Col>

        {/* Tabs Card */}
        <Col xl="6">
          <Card className="s-card s-outlined">
            <div className="s-header">
              <h5 className="mb-0">Tabs Card</h5>
            </div>
            <div className="s-body">
              <ul className="nav nav-tabs card-body-tabs mb-3">
                <Nav.Item as="li">
                  <Nav.Link active href="#">
                    Active
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link href="#">Link</Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link disabled href="#">
                    Disabled
                  </Nav.Link>
                </Nav.Item>
              </ul>
              <p>
                With supporting text below as a natural lead-in to additional
                content.
              </p>
              <Button variant="primary">Go somewhere</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiCards;
