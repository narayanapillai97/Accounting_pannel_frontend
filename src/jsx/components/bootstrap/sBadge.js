import React from "react";
import { Col, Badge, Card, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

// Import your custom CSS file
import "../../../../src/css/s-badge.css";

const sBadge = () => {
  return (
    <div className="badge-demo">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      <PageTitle
        motherMenu="Bootstrap"
        activeMenu="Badge"
        pageContent="Stylish Badge Collection"
      />
      <Row>
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>🌟 Glowing Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Interactive glow effects with shimmer animation
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-glow s-size-tiny">Tiny Glow</Badge>
                <Badge as="span" className="s-badge s-badge-glow s-size-small">Small Glow</Badge>
                <Badge as="span" className="s-badge s-badge-glow s-size-medium">Medium Glow</Badge>
                <Badge as="span" className="s-badge s-badge-glow s-size-large">Large Glow</Badge>
                <Badge as="span" className="s-badge s-badge-glow s-size-huge">Huge Glow</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>🚀 Neon Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Cyberpunk-style neon effects with pulsing animation
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-neon s-size-small">Neon 1</Badge>
                <Badge as="span" className="s-badge s-badge-neon s-size-medium">Neon 2</Badge>
                <Badge as="span" className="s-badge s-badge-neon s-size-large">Neon 3</Badge>
                <Badge as="span" className="s-badge s-badge-neon s-size-small">✨ Sparkle</Badge>
                <Badge as="span" className="s-badge s-badge-neon s-size-medium">🚀 Rocket</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <Card.Header className="d-block">
              <Card.Title style={{color: 'white'}}>💎 Glass Morphism Badges</Card.Title>
              <Card.Text className="mb-0 subtitle" style={{color: 'rgba(255,255,255,0.8)'}}>
                Modern glassmorphism design with backdrop blur
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-glass s-size-small">Glass</Badge>
                <Badge as="span" className="s-badge s-badge-glass s-size-medium">Frosted</Badge>
                <Badge as="span" className="s-badge s-badge-glass s-size-large">Blurred</Badge>
                <Badge as="span" className="s-badge s-badge-glass s-size-small">Transparent</Badge>
                <Badge as="span" className="s-badge s-badge-glass s-size-medium">Modern</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>🎨 Gradient Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Beautiful gradients with hover scale effects
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-gradient s-size-small">Gradient 1</Badge>
                <Badge as="span" className="s-badge s-badge-gradient s-size-medium">Gradient 2</Badge>
                <Badge as="span" className="s-badge s-badge-gradient s-size-large">Gradient 3</Badge>
                <Badge as="span" className="s-badge s-badge-gradient s-size-small">Purple</Badge>
                <Badge as="span" className="s-badge s-badge-gradient s-size-medium">Blue</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>🎭 Shadow Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Elevated shadows with smooth hover animations
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-shadow">Shadow Primary</Badge>
                <Badge as="span" className="s-badge s-badge-shadow s-success">Shadow Success</Badge>
                <Badge as="span" className="s-badge s-badge-shadow s-danger">Shadow Danger</Badge>
                <Badge as="span" className="s-badge s-badge-shadow s-warning">Shadow Warning</Badge>
                <Badge as="span" className="s-badge s-badge-shadow s-info">Shadow Info</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>⚡ Metallic Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Neumorphism style with metallic finish
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-metallic s-size-small">Metal 1</Badge>
                <Badge as="span" className="s-badge s-badge-metallic s-size-medium">Metal 2</Badge>
                <Badge as="span" className="s-badge s-badge-metallic s-size-large">Metal 3</Badge>
                <Badge as="span" className="s-badge s-badge-metallic s-size-small">Chrome</Badge>
                <Badge as="span" className="s-badge s-badge-metallic s-size-medium">Steel</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>🎯 Outlined Interactive Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Hover to fill - smooth color transitions
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-outlined s-primary s-size-small">Primary</Badge>
                <Badge as="span" className="s-badge s-badge-outlined s-success s-size-small">Success</Badge>
                <Badge as="span" className="s-badge s-badge-outlined s-danger s-size-small">Danger</Badge>
                <Badge as="span" className="s-badge s-badge-outlined s-warning s-size-small">Warning</Badge>
                <Badge as="span" className="s-badge s-badge-outlined s-info s-size-small">Info</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>🎪 Animated Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Special animation effects - pulse, bounce, rotate
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-pulse s-size-medium">Pulse</Badge>
                <Badge as="span" className="s-badge s-badge-bounce s-size-medium">Bounce</Badge>
                <Badge as="span" className="s-badge s-badge-rotate s-size-medium">Rotate</Badge>
                <Badge as="span" className="s-badge s-badge-flip s-size-medium">Flip</Badge>
                <Badge as="span" className="s-badge s-badge-3d s-size-medium">3D Effect</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>🌊 Morphing & Liquid Badges</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Shape-changing and liquid animation effects
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container">
                <Badge as="span" className="s-badge s-badge-morph s-size-medium">Morph</Badge>
                <Badge as="span" className="s-badge s-badge-liquid s-size-medium">Liquid</Badge>
                <Badge as="span" className="s-badge s-badge-morph s-size-small">Shape</Badge>
                <Badge as="span" className="s-badge s-badge-liquid s-size-large">Flow</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg="12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>📏 Size Showcase</Card.Title>
              <Card.Text className="mb-0 subtitle">
                All available sizes with different styles
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="s-badge-container s-badge-center">
                <Badge as="span" className="s-badge s-badge-shadow s-size-tiny">s-size-tiny</Badge>
                <Badge as="span" className="s-badge s-badge-glow s-size-small">s-size-small</Badge>
                <Badge as="span" className="s-badge s-badge-gradient s-size-medium">s-size-medium</Badge>
                <Badge as="span" className="s-badge s-badge-neon s-size-large">s-size-large</Badge>
                <Badge as="span" className="s-badge s-badge-metallic s-size-huge">s-size-huge</Badge>
              </div>
              <div className="s-badge-container s-badge-center" style={{marginTop: '20px'}}>
                <Badge as="span" className="s-badge s-badge-pulse s-size-tiny">Tiny Pulse</Badge>
                <Badge as="span" className="s-badge s-badge-3d s-size-small">Small 3D</Badge>
                <Badge as="span" className="s-badge s-badge-glass s-size-medium">Medium Glass</Badge>
                <Badge as="span" className="s-badge s-badge-liquid s-size-large">Large Liquid</Badge>
                <Badge as="span" className="s-badge s-badge-bounce s-size-huge">Huge Bounce</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default sBadge;