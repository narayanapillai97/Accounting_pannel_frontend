import React, { Fragment } from "react";
import { Row, Col, Card, Button, Dropdown, ButtonGroup } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import "../../../../src/css/buttons.css"; // We'll create this CSS file
import "../../../css/sCardStyles.css";

const ButtonUi= () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="Buttons"
        pageContent="Buttons"
        motherMenu="Bootstrap"
      />
      <div className="s-btn-page">
        <Row>
          <Col lg="12">
            <card className="s-card">
              <Card.Header className="s-card-header">
                <Card.Title>Basic Buttons</Card.Title>
                <Card.Text className="s-subtitle">
                  Solid button styles
                </Card.Text>
              </Card.Header>
              <div className="s-card-body">
                <Button className="s-btn s-btn-primary">Primary</Button>
                <Button className="s-btn s-btn-secondary">Secondary</Button>
                <Button className="s-btn s-btn-success">Success</Button>
                <Button className="s-btn s-btn-danger">Danger</Button>
                <Button className="s-btn s-btn-warning">Warning</Button>
                <Button className="s-btn s-btn-info">Info</Button>
                <Button className="s-btn s-btn-light">Light</Button>
                <Button className="s-btn s-btn-dark">Dark</Button>
              </div>
            </card>
          </Col>

          <Col lg="12">
            <Card>
              <Card.Header className="s-card-header">
                <Card.Title>Gradient Buttons</Card.Title>
                <Card.Text className="s-subtitle">
                  Beautiful gradient effects
                </Card.Text>
              </Card.Header>
              <div className="s-card-body">
                <Button className="s-btn s-btn-grad-primary">Primary Gradient</Button>
                <Button className="s-btn s-btn-grad-success">Success Gradient</Button>
                <Button className="s-btn s-btn-grad-danger">Danger Gradient</Button>
                <Button className="s-btn s-btn-grad-warning">Warning Gradient</Button>
              </div>
            </Card>
          </Col>

          <Col lg="12">
            <Card>
              <Card.Header className="s-card-header">
                <Card.Title>Outline Buttons</Card.Title>
                <Card.Text className="s-subtitle">
                  Transparent background with colored border
                </Card.Text>
              </Card.Header>
              <div className="s-card-body">
                <Button className="s-btn s-btn-outline-primary">Primary</Button>
                <Button className="s-btn s-btn-outline-secondary">Secondary</Button>
                <Button className="s-btn s-btn-outline-success">Success</Button>
                <Button className="s-btn s-btn-outline-danger">Danger</Button>
              </div>
            </Card>
          </Col>

          <Col lg="12">
            <Card>
              <Card.Header className="s-card-header">
                <Card.Title>3D Buttons</Card.Title>
                <Card.Text className="s-subtitle">
                  Buttons with depth effect
                </Card.Text>
              </Card.Header>
              <div className="s-card-body">
                <Button className="s-btn s-btn-3d-primary">Primary 3D</Button>
                <Button className="s-btn s-btn-3d-success">Success 3D</Button>
                <Button className="s-btn s-btn-3d-danger">Danger 3D</Button>
              </div>
            </Card>
          </Col>

          <Col lg="12">
            <Card>
              <Card.Header className="s-card-header">
                <Card.Title>Animated Buttons</Card.Title>
                <Card.Text className="s-subtitle">
                  Buttons with hover animations
                </Card.Text>
              </Card.Header>
              <div className="s-card-body">
                <Button className="s-btn s-btn-animate-fill">Fill Animation</Button>
                <Button className="s-btn s-btn-animate-slide">Slide Animation</Button>
                <Button className="s-btn s-btn-animate-shine">Shine Animation</Button>
              </div>
            </Card>
          </Col>

          <Col lg="12">
            <Card>
              <Card.Header className="s-card-header">
                <Card.Title>Icon Buttons</Card.Title>
                <Card.Text className="s-subtitle">
                  Buttons with icons
                </Card.Text>
              </Card.Header>
              <div className="s-card-body">
                <Button className="s-btn s-btn-icon">
                  <i className="fas fa-heart s-btn-icon-left"></i> Like
                </Button>
                <Button className="s-btn s-btn-icon s-btn-icon-right">
                  Share <i className="fas fa-share s-btn-icon-right"></i>
                </Button>
                <Button className="s-btn s-btn-icon-only">
                  <i className="fas fa-cog"></i>
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default ButtonUi;