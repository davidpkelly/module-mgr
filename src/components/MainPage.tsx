import { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";

const MainPage = () => {
  const [usbDevice, setUsbDevice] = useState<USBDevice>();

  //   navigator.usb
  //     .requestDevice({ filters: [] })
  //     .then((device) => {
  //       console.log(device);
  //       // Add the device to the UI or perform other actions
  //     })
  //     .catch((error) => {
  //       console.error("No device was selected:", error);
  //     });

  //   useEffect(() => {
  //     navigator.usb
  //       .requestDevice({ filters: [] })
  //       .then((devs: USBDevice) => {
  //         setUsbDevices(devs);
  //       })
  //       .catch((err: Error) => {
  //         <Alert variant={"danger"}>
  //           Failed to get USB devices: {err.message}
  //         </Alert>;
  //         console.error(err);
  //       });
  //   }, []);

  const handleRequestDevice = () => {
    navigator.usb
      .requestDevice({ filters: [] })
      .then((device: USBDevice) => {
        setUsbDevice(device);
      })
      .catch((error) => {
        console.error("No device was selected:", error);
      });
  };

  return (
    <Container>
      <Row className="px-4 my-5">
        <Col xs={6}>
          <h1>Module Configuration</h1>
        </Col>
        <Col></Col>
      </Row>
      <Row className="px-4 my-5">
        <Col></Col>
        <Col xs={6}>
          <Form>
            <Row>
              <Col>
                <Form.Label className="my-2">
                  Click here to select the USB device:{" "}
                </Form.Label>
              </Col>
              <Col>
                <Button variant="primary" onClick={handleRequestDevice}>
                  Devices
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col></Col>
      </Row>
      {usbDevice && (
        <Row className="px-4 my-5">
          <Col></Col>
          <Col xs={6}>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="usbManufacturerName">
                  <Form.Label>Manufacturer:</Form.Label>
                  <Form.Control type="text" placeholder="" value={usbDevice.manufacturerName} />
                </Form.Group>
                <Form.Group as={Col} controlId="formProductName">
                  <Form.Label>Product Name:</Form.Label>
                  <Form.Control type="text" placeholder="" value={usbDevice.productName}/>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="usbSerialNumber">
                  <Form.Label>Serial Number:</Form.Label>
                  <Form.Control type="text" placeholder="" value={usbDevice.serialNumber} />
                </Form.Group>
                <Form.Group as={Col} controlId="formVendorID">
                  <Form.Label>Vendor ID:</Form.Label>
                  <Form.Control type="text" placeholder="" value={usbDevice.vendorId}/>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="usbProductID">
                  <Form.Label>Product ID:</Form.Label>
                  <Form.Control type="text" placeholder="" value={usbDevice.productId} />
                </Form.Group>
                <Form.Group as={Col}></Form.Group>
              </Row>
              <hr/>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      )}
    </Container>
  );
};

export default MainPage;
