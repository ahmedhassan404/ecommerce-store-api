import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">About Our E-Commerce Platform</h1>
          <p className="lead text-center">
            We're dedicated to providing the best shopping experience for our customers
            and a powerful platform for our sellers.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                To create a seamless marketplace that connects quality sellers with
                discerning customers, fostering a community of trust and excellence
                in online commerce.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Our Vision</Card.Title>
              <Card.Text>
                To become the leading e-commerce platform that empowers businesses
                and delights customers through innovative technology and exceptional
                service.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Our Values</Card.Title>
              <Card.Text>
                Integrity, customer satisfaction, innovation, and community are the
                core values that drive everything we do.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Our Story</Card.Title>
              <Card.Text>
                Founded with a passion for revolutionizing online shopping, our platform
                has grown from a small startup to a comprehensive marketplace serving
                thousands of customers and sellers. We continue to innovate and improve
                our services to provide the best possible experience for our community.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage; 