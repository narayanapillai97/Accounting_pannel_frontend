import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import {
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

// Component for a standard button group
const StandardButtonGroup = () => (
  <ButtonGroup>
    <Button variant="primary">Left</Button>
    <Button variant="primary">Middle</Button>
    <Button variant="primary">Right</Button>
  </ButtonGroup>
);

// Component for button toolbar
const ButtonToolbar = () => (
  <>
    <ButtonGroup className="me-2 mb-2">
      <Button variant="primary">1</Button>
      <Button variant="primary">2</Button>
      <Button variant="primary">3</Button>
      <Button variant="primary">4</Button>
    </ButtonGroup>
    <ButtonGroup className="me-2 mb-2">
      <Button variant="primary">5</Button>
      <Button variant="primary">6</Button>
      <Button variant="primary">7</Button>
    </ButtonGroup>
    <ButtonGroup className="mb-2">
      <Button variant="primary">8</Button>
    </ButtonGroup>
  </>
);

// Component for button sizing examples
const ButtonSizing = () => (
  <>
    <ButtonGroup size="lg" className="mb-2 me-2">
      <Button variant="primary">Left</Button>
      <Button variant="primary">Middle</Button>
      <Button variant="primary">Right</Button>
    </ButtonGroup>
    <ButtonGroup className="mb-2 me-2">
      <Button variant="primary">Left</Button>
      <Button variant="primary">Middle</Button>
      <Button variant="primary">Right</Button>
    </ButtonGroup>
    <ButtonGroup size="sm" className="mb-2">
      <Button variant="primary">Left</Button>
      <Button variant="primary">Middle</Button>
      <Button variant="primary">Right</Button>
    </ButtonGroup>
  </>
);

// Component for button nesting with dropdown
const ButtonNesting = () => (
  <ButtonGroup>
    <Button variant="primary">1</Button>
    <Button variant="primary">2</Button>
    <DropdownButton
      as={ButtonGroup}
      title="Dropdown"
      id="bg-nested-dropdown"
    >
      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
    </DropdownButton>
  </ButtonGroup>
);

// Component for vertical button group
const VerticalButtonGroup = () => (
  <ButtonGroup vertical>
    <Button variant="primary">Button</Button>
    <Button variant="primary">Button</Button>
    <Button variant="primary">Button</Button>
    <Button variant="primary">Button</Button>
    <Button variant="primary">Button</Button>
    <Button variant="primary">Button</Button>
  </ButtonGroup>
);

// Component for vertical dropdown variation
const VerticalDropdownGroup = () => (
  <ButtonGroup vertical>
    <Button variant="primary">Button</Button>
    <Button variant="primary">Button</Button>
    <DropdownButton
      as={ButtonGroup}
      title="Dropdown"
      id="bg-vertical-dropdown-1"
    >
      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
    </DropdownButton>
    <Button variant="primary">Button</Button>
    <Button variant="primary">Button</Button>
    <DropdownButton
      as={ButtonGroup}
      title="Dropdown"
      id="bg-vertical-dropdown-2"
    >
      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
    </DropdownButton>
    <DropdownButton
      as={ButtonGroup}
      title="Dropdown"
      id="bg-vertical-dropdown-3"
    >
      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
    </DropdownButton>
    <DropdownButton
      as={ButtonGroup}
      title="Dropdown"
      id="bg-vertical-dropdown-4"
    >
      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
    </DropdownButton>
  </ButtonGroup>
);

// Card component to reduce repetition
const ExampleCard = ({ title, subtitle, children }) => (
  <Card>
    <Card.Header className="d-block">
      <Card.Title>{title}</Card.Title>
      <Card.Text className="mb-0 subtitle">
        {subtitle}
      </Card.Text>
    </Card.Header>
    <Card.Body>
      {children}
    </Card.Body>
  </Card>
);

const GroupButton = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu={"Button Group"}
        pageContent="Button Group"
        motherMenu={"Bootstrap"}
      />
      <Row>
        <Col xl="6">
          <ExampleCard
            title="Button group"
            subtitle="Default Button group style"
          >
            <StandardButtonGroup />
          </ExampleCard>
        </Col>
        <Col xl="6">
          <ExampleCard
            title="Button toolbar"
            subtitle="Default Button toolbar style"
          >
            <ButtonToolbar />
          </ExampleCard>
        </Col>
        <Col xl="6">
          <ExampleCard
            title="Button Sizing"
            subtitle="Default button size style"
          >
            <ButtonSizing />
          </ExampleCard>
        </Col>
        <Col xl="6">
          <ExampleCard
            title="Button Nesting"
            subtitle="Default button nesting style"
          >
            <ButtonNesting />
          </ExampleCard>
        </Col>
        <Col xl="6">
          <ExampleCard
            title="Vertical variation"
            subtitle="Default button vertical variation style"
          >
            <VerticalButtonGroup />
          </ExampleCard>
        </Col>
        <Col lg="6" md="6">
          <ExampleCard
            title="Vertical dropdown variation"
            subtitle="Default button vertical variation style"
          >
            <VerticalDropdownGroup />
          </ExampleCard>
        </Col>
      </Row>
    </Fragment>
  );
};

export default GroupButton;