/* Frames, Modules, Libraries */
import Head from 'next/head'
import Link from 'next/link'

/* Components */
import { Container, Row, Col, Modal, Button, Form, FormControl, Image, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap'

/* Configures */
import firebase from '../configure/firebase'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/root.css'

function Modal_AssignmentEdit (props) {
    const { willUpdateAssignment, showAssignmentEdit, handleCloseAssignmentEdit, handleChange, updateAssignment, createOptions } = props;

    return (
        <div>
            <Modal show={showAssignmentEdit} onHide={handleCloseAssignmentEdit}>
            <Form>
                <Modal.Header closeButton>
                    <Modal.Title>과제 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row} controlId="formPlaintext">
                    <Form.Label column sm="2">
                        주차
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control name="weeks" as="select" type="number" defaultValue={willUpdateAssignment.weeks} onChange={handleChange}>
                        {
                            createOptions()
                        }
                        </Form.Control>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                    <Form.Label column sm="2">
                        기한
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control name="deadline" placeholder="제출 기한" defaultValue={willUpdateAssignment.deadline} onChange={handleChange} />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                    <Form.Label column sm="2">
                        중요
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control as="textarea" name="note" placeholder="교수님이 짚어주신 포인트" defaultValue={willUpdateAssignment.note} onChange={handleChange}/>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                    <Form.Label column sm="2">
                        과제
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control as="textarea" name="text" type="text" placeholder="Chapter 1~2 요약하기" defaultValue={willUpdateAssignment.text} onChange={handleChange}/>
                    </Col>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" type="reset" onClick={handleCloseAssignmentEdit}>
                    취소
                    </Button>
                    <Button variant="primary" onClick={updateAssignment}>
                    수정
                    </Button>
                </Modal.Footer>
            </Form>
            </Modal>
        </div>
    )
};

function areEqual(prevProps, nextProps) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
    // console.log(prevProps, nextProps)
}

export default React.memo(Modal_AssignmentEdit, areEqual);