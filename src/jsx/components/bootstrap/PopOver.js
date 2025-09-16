import React from "react";
import PageTitle from "../../layouts/PageTitle";
import {
  Row,
  Col,
  Card,
  Tooltip,
  OverlayTrigger,
  Button,
} from "react-bootstrap";
import "../../../../src/css/UiPopOver.css";

const toottip = () => {
  let width = window.innerWidth;

  // Define different tooltip styles
  const tooltipStyles = [
    {
      className: "s-modern",
      font: "'Poppins', sans-serif",
      bgColor: "#4a5568",
      textColor: "#eef2f7",
      border: "none",
    },
    {
      className: "s-vintage",
      font: "'Playfair Display', serif",
      bgColor: "#faf6ee",
      textColor: "#6c584c",
      border: "1px solid #cbb994",
    },
    {
      className: "s-futuristic",
      font: "'Orbitron', sans-serif",
      bgColor: "#0f172a",
      textColor: "#5dd3f3",
      border: "1px solid #38bdf8",
    },
    {
      className: "s-minimal",
      font: "'Inter', sans-serif",
      bgColor: "#ffffff",
      textColor: "#475569",
      border: "1px solid #cbd5e1",
    },
  ];

  // Responsive placement logic
  const getPlacement = (placement) => {
    if (width < 1300 && width > 700) {
      return placement === "Left" ? "right" : placement.toLowerCase();
    } else if (width < 700) {
      if (placement === "Right") return "top";
      if (width < 385) {
        return placement === "Left" ? "bottom" : placement.toLowerCase();
      }
      return placement.toLowerCase();
    }
    return placement.toLowerCase();
  };

  return (
    <div className="h-80">
      <PageTitle activeMenu="Popover" pageContent="Popover" motherMenu="Bootstrap" />
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Bootstrap popover with styled tooltips</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Different styled tooltips with Google Fonts and custom styling.
                Each tooltip has a classname starting with 's-' for styling.
              </Card.Text>

              <div className="bootstrap-popover-wrapper">
                {tooltipStyles.map((style, styleIndex) => (
                  <div key={styleIndex} className="mb-5">
                    <h5 className="mb-4 fw-semibold text-uppercase">
                      Style: {style.className.replace("s-", "")}
                    </h5>
                    <div className="bootstrap-popover">
                      {["Left", "Top", "Bottom", "Right"].map((placement, i) => (
                        <OverlayTrigger
                          trigger="click"
                          key={i}
                          placement={getPlacement(placement)}
                          overlay={
                            <Tooltip
                              id={`popover-${style.className}-${placement.toLowerCase()}`}
                              className={style.className}
                            >
                              <div className="tooltip-header">
                                {`${style.className.replace("s-", "")} Tooltip`}
                              </div>
                              <div>Position: {placement}</div>
                              <div>Custom styling with Google Fonts</div>
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2 mt-2 px-3"
                          >
                            {placement}
                          </Button>
                        </OverlayTrigger>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default toottip;