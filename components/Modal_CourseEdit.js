/* Frames, Modules, Libraries */
import Head from 'next/head'
import Link from 'next/link'

/* Components */
import { Container, Row, Col, Modal, Button, Form, FormControl, Image, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap'

/* Configures */
import firebase from '../configure/firebase'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/root.css'

export default function Modal_CourseEdit (props) {
    const { selectedCourse, showCourseEdit, handleCourseEdit, handleChange, updateCourse} = props;
    return (
        <div>
            <Modal show={showCourseEdit} onHide={handleCourseEdit}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title>강의 수정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group as={Row} controlId="formPlaintext">
                        <Form.Label column sm="2">
                            학기
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control name="semester" readOnly defaultValue={selectedCourse.semester} />
                        </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintext">
                        <Form.Label column sm="2">
                            강의명
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control name="class_name" placeholder="경영학원론" defaultValue={selectedCourse.class_name} onChange={handleChange} />
                        </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintext">
                        <Form.Label column sm="2">
                            요일
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control name="day" placeholder="예시) 월 9시~12시" defaultValue={selectedCourse.day} onChange={handleChange}/>
                        </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintext">
                        <Form.Label column sm="2">
                            교수님
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control name="professor" type="text" placeholder="홍길동" defaultValue={selectedCourse.professor} onChange={handleChange}/>
                        </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintext">
                        <Form.Label column sm="2">
                            Email
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control name="email" type="email" placeholder="email" controlId="formPlaintextEmail" defaultValue={selectedCourse.email} onChange={handleChange}/>
                        </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintext">
                        <Form.Label column sm="2">
                            page
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control name="homepage" type="email" placeholder="참고 홈페이지" controlId="formPlaintext" defaultValue={selectedCourse.homepage} onChange={handleChange}/>
                        </Col>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" type="reset" onClick={handleCourseEdit}>
                        취소
                        </Button>
                        <Button variant="primary" onClick={updateCourse}>
                        수정
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};