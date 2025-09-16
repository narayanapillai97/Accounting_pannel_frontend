import React from "react";
import { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle.js";
import { Row, Card, Col, Pagination } from "react-bootstrap";

const UiPagination = () => {
  const active = 2;
  const items = [1, 2, 3, 4, 5];
  const advancedItems = [1, '...', 10, 11, 12, '...', 20];

  // Modern Pagination
  const ModernPagination = () => (
    <Pagination className="mt-3">
      {items.map((number) => (
        <Pagination.Item key={number} active={number === active}>
          {number}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  // Outline Pagination
  const OutlinePagination = () => (
    <Pagination className="mt-3 pagination-outline">
      {items.map((number) => (
        <Pagination.Item key={number} active={number === active}>
          {number}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  // Minimal Pagination
  const MinimalPagination = () => (
    <Pagination className="mt-3 pagination-minimal">
      {items.map((number) => (
        <Pagination.Item key={number} active={number === active}>
          {number}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  // Gradient Pagination
  const GradientPagination = () => (
    <Pagination className="mt-3 pagination-gradient">
      {items.map((number) => (
        <Pagination.Item key={number} active={number === active}>
          {number}
        </Pagination.Item>
      ))}
    </Pagination>
  );

  // Advanced Pagination
  const AdvancedPagination = () => (
    <Pagination className="mt-3">
      <Pagination.First />
      <Pagination.Prev />
      {advancedItems.map((item, index) => (
        item === '...' ? 
          <Pagination.Ellipsis key={index} /> : 
          <Pagination.Item key={index} active={item === 11}>
            {item}
          </Pagination.Item>
      ))}
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );

  return (
    <Fragment>
      <style>{`
        .pagination-outline .page-item .page-link {
          border: 1px solid #dee2e6;
          background: transparent;
          color: #495057;
        }
        
        .pagination-outline .page-item.active .page-link {
          border-color: #0d6efd;
          color: #0d6efd;
          background: transparent;
        }
        
        .pagination-minimal .page-item .page-link {
          background: transparent;
          border: none;
          color: #333;
        }
        
        .pagination-minimal .page-item.active .page-link {
          color: #fff;
          background: #333;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pagination-gradient .page-item .page-link {
          background: linear-gradient(to right, #f6f7f9, #ebedf0);
          border: none;
        }
        
        .pagination-gradient .page-item.active .page-link {
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
        }
        
        .pagination-lg .page-link {
          padding: 0.75rem 1.5rem;
          font-size: 1.25rem;
        }
      `}</style>

      <PageTitle
        activeMenu="Pagination"
        motherMenu="Bootstrap"
        pageContent="Pagination"
      />
      
      <Row>
        <Col xl={6} className="col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Modern Pagination</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Clean design with smooth transitions
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <ModernPagination />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Outline Pagination</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Border-only style with active state highlight
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <OutlinePagination />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Sizes</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Different pagination sizes
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Pagination size="lg" className="mb-3">
                {items.map((number) => (
                  <Pagination.Item key={number} active={number === active}>
                    {number}
                  </Pagination.Item>
                ))}
              </Pagination>
              <Pagination size="sm">
                {items.map((number) => (
                  <Pagination.Item key={number} active={number === active}>
                    {number}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Minimal Pagination</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Simple and clean design with circular active item
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <MinimalPagination />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Gradient Pagination</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Gradient background with colorful active state
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <GradientPagination />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Advanced Pagination</Card.Title>
              <Card.Text className="mb-0 subtitle">
                With first/last buttons and ellipsis
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <AdvancedPagination />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiPagination;