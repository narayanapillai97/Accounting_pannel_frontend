import React, { Fragment } from "react";
import { Row, Col, Card, Accordion } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import "../../../../src/css/Accordion.css";

const accordionData = [
  {
    title: "Accordion Header One",
    text: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid...",
    color: "primary",
  },
  {
    title: "Accordion Header Two",
    text: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid...",
    color: "info",
  },
  {
    title: "Accordion Header Three",
    text: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid...",
    color: "success",
  },
];

const renderAccordion = (extraClasses = "") => (
  <Accordion className={`s-accordion ${extraClasses}`} defaultActiveKey="0">
    {accordionData.map((item, index) => (
      <Accordion.Item
        className="s-accordion-item"
        key={index}
        eventKey={`${index}`}
      >
        <Accordion.Header
          className={`s-accordion-header ${
            item.color ? `s-accordion-header-${item.color}` : ""
          }`}
        >
          {item.title}
        </Accordion.Header>
        <Accordion.Collapse eventKey={`${index}`}>
          <div className="s-accordion-body">{item.text}</div>
        </Accordion.Collapse>
      </Accordion.Item>
    ))}
  </Accordion>
);

const UiAccordion = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="Accordion"
        motherMenu="Bootstrap"
        pageContent="Accordion"
      />
      <Row>
        <Col xl="6">
          <Card className="s-card">
            <Card.Header className="s-card-header">
              <Card.Title>Default Accordion</Card.Title>
              <Card.Text className="s-subtitle">
                Basic example with color variations
              </Card.Text>
            </Card.Header>
            <Card.Body>{renderAccordion("s-accordion-primary")}</Card.Body>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card">
            <Card.Header className="s-card-header">
              <Card.Title>Bordered Accordion</Card.Title>
              <Card.Text className="s-subtitle">
                Adds clean borders between sections
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {renderAccordion("s-accordion-bordered s-accordion-danger")}
            </Card.Body>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card">
            <Card.Header className="s-card-header">
              <Card.Title>Gradient Header</Card.Title>
              <Card.Text className="s-subtitle">
                Eye-catching gradient backgrounds
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {renderAccordion("s-accordion-gradient s-accordion-rounded")}
            </Card.Body>
          </Card>
        </Col>

        <Col xl="6">
          <Card className="s-card">
            <Card.Header className="s-card-header">
              <Card.Title>Icon Indicator</Card.Title>
              <Card.Text className="s-subtitle">
                Expands with a smooth icon rotation
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {renderAccordion("s-accordion-with-icon s-accordion-bordered")}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiAccordion;
