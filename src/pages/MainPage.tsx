import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ModuleSelectButton from "../components/ModuleSelectButton";
import ToastMessage, { ToastMessageProps } from "../components/ToastMessage";
import PluggableRO from "../utils/PluggableRO";

export interface PluggableType {
  name: "sfp" | "qsfp" | undefined;
}

const MainPage = () => {
  const [pluggableType, setPluggableType] = useState<PluggableType>();
  const [usbDevice, setUsbDevice] = useState<USBDevice>();

  const [toastMsg, setToastMsg] = useState<ToastMessageProps>({
    show: false,
    onClose: () => {},
    message: "",
    type: "info",
  });

  const handleSelection = (selection: PluggableType) => {
    setPluggableType(selection);
  };

  const handleRequestDevice = async () => {
    const programmer = new PluggableRO();
    const device = await programmer.connect();
    if (device) {
        console.log(`Device Info: ${device.productName} by ${device.manufacturerName}`);
        setUsbDevice(device);
    } else {
        console.error("Failed to connect to the device.");
        setToastMsg({
          show: true,
          onClose: () => {setToastMsg({show: false, onClose: () => {}, message: "", type: "info"})},
          message: `Failed to connect to the ${pluggableType?.name} device`,
          type: "warning",
        })
    }
  };

  return (
    <>
      <ToastMessage
        show={toastMsg.show}
        onClose={toastMsg.onClose}
        message={toastMsg.message}
        type={toastMsg.type}
      />
      <Container>
        <Row className="px-4 my-5">
          <Col xs={6}>
            <h1>Module Configuration</h1>
          </Col>
          <Col></Col>
        </Row>
        <Row className="px-4 my-5">
          <Col>
            <Form>
              <Row>
                <Col>
                  <Form.Label className="my-4">
                    Select the pluggable type and click "Connect" to begin:
                  </Form.Label>
                  <ModuleSelectButton
                    selection={pluggableType!}
                    setSelection={handleSelection}
                  />
                </Col>
              </Row>
              <Row className="my-4 py-4">
                <Col className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    onClick={handleRequestDevice}
                    size="lg"
                    disabled={!pluggableType}
                  >
                    Connect
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        {usbDevice && (
          <Row className="px-4 my-5">
            <Col></Col>
            <Col xs={6}>
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="usbManufacturerName">
                    <Form.Label>Manufacturer:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={usbDevice.manufacturerName}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formProductName">
                    <Form.Label>Product Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={usbDevice.productName}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="usbSerialNumber">
                    <Form.Label>Serial Number:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={usbDevice.serialNumber}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formVendorID">
                    <Form.Label>Vendor ID:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={usbDevice.vendorId}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="usbProductID">
                    <Form.Label>Product ID:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={usbDevice.productId}
                    />
                  </Form.Group>
                  <Form.Group as={Col}></Form.Group>
                </Row>
                <hr />
              </Form>
            </Col>
            <Col></Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default MainPage;
