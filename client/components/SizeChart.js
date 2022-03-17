import React from "react";
import dynamic from "next/dynamic";
import { Col, Nav, Row, Table } from "react-bootstrap";

const DynamicTabContainer = dynamic(
  () => import("react-bootstrap/TabContainer"),
  {
    ssr: false,
  }
);
const DynamicTabContent = dynamic(() => import("react-bootstrap/TabContent"), {
  ssr: false,
});
const DynamicTabPane = dynamic(() => import("react-bootstrap/TabPane"), {
  ssr: false,
});

const SizeChart = () => {
  return (
    <DynamicTabContainer id="size-chart-box" defaultActiveKey="inch">
      <Row>
        <Col className="px-0">
          <Nav
            variant="pills"
            className="description-tabs "
            id="size-chart"
            defaultActiveKey="inch"
          >
            <Nav.Item>
              <Nav.Link eventKey="inch" as="div">
                Inch
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="centimeter" as="div">
                Centimeter
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col className="px-0">
          <DynamicTabContent>
            <DynamicTabPane
              className="description-panel px-0"
              eventKey="inch"
              title="Inch"
            >
              <div className="mb-3 description-section">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>SIZE</th>
                      <th>XS</th>
                      <th>S</th>
                      <th>M</th>
                      <th>L</th>
                      <th>XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bust</td>
                      <td>32</td>
                      <td>34</td>
                      <td>36</td>
                      <td>38</td>
                      <td>39</td>
                    </tr>
                    <tr>
                      <td>Waist</td>
                      <td>25.5</td>
                      <td>27.5</td>
                      <td>29.5</td>
                      <td>31.5</td>
                      <td>32.5</td>
                    </tr>
                    <tr>
                      <td>Hip</td>
                      <td>35</td>
                      <td>37</td>
                      <td>39</td>
                      <td>41</td>
                      <td>42</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </DynamicTabPane>

            <DynamicTabPane
              className="description-panel px-0"
              eventKey="centimeter"
              title="Centimeter"
            >
              <div className="mb-3 description-section">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>SIZE</th>
                      <th>XS</th>
                      <th>S</th>
                      <th>M</th>
                      <th>L</th>
                      <th>XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bust</td>
                      <td>81</td>
                      <td>86</td>
                      <td>91</td>
                      <td>96</td>
                      <td>98.5</td>
                    </tr>
                    <tr>
                      <td>Waist</td>
                      <td>65</td>
                      <td>70</td>
                      <td>75</td>
                      <td>80</td>
                      <td>82.5</td>
                    </tr>
                    <tr>
                      <td>Hip</td>
                      <td>89</td>
                      <td>94</td>
                      <td>99</td>
                      <td>104</td>
                      <td>106.5</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </DynamicTabPane>
          </DynamicTabContent>
        </Col>
      </Row>
    </DynamicTabContainer>
  );
};

export default SizeChart;
