import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const CreateMarket = ({ save }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [show, setShow] = useState(false);

  const isFormFilled = () => title && description && endDate;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-3"
      >
        Create Market
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Prediction Market</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel controlId="inputTitle" label="Title" className="mb-3">
              <Form.Control
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </FloatingLabel>
            <FloatingLabel controlId="inputDescription" label="Description" className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Description"
                style={{ height: "100px" }}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="inputEndDate" label="End Date" className="mb-3">
              <Form.Control
                type="datetime-local"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                title,
                description,
                endDate,
              });
              handleClose();
            }}
          >
            Create Market
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

CreateMarket.propTypes = {
  save: PropTypes.func.isRequired,
};

export default CreateMarket;