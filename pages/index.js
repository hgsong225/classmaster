/* Frames, Modules, Libraries */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import { Container, Row, Col, Modal, Button, Form, FormControl, Image, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap'
import moment from 'moment'
moment.locale('ko')

/* Configures */
import firebase from '../configure/firebase'
const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;


export default function home (props) {
  const router = useRouter();
  const db = firebase.firestore();
  const courses = props.data.courses;

  const [ selectedCourseId, setSelectCourseId ] = useState(null)
  const [ selectedCourse, setSelectCourse ] = useState(null)
  const [ assignments, setAssignment ] = useState({})
  const [ showCourse, setShowCourse ] = useState(false)
  const [ showAssignment, setShowAssignment ] = useState(false)
  const [ courseInformation, setCourseInformation ] = useState({
    class_name: '',
    day: '',
    email: '',
    homepage: '',
    professor: '',
    semester: '2020-1',
    uuid: '',
  })
  const [ assignmentInformation, setAssignmentInformation ] = useState({
    deadline: null,
    note: null,
    text: null,
    weeks: null,
  })

  const handleCloseCourse = () => setShowCourse(false);
  const handleShowCourse = () => setShowCourse(true);
  const handleCloseAssignment = () => setShowAssignment(false);
  const handleShowAssignment = () => setShowAssignment(true);

  useEffect(() => {
    async function fetchData() {
      await db.collection('class').doc(`${selectedCourseId}`).collection('assignment').orderBy('weeks', 'desc')
      .onSnapshot(async data => {
        setAssignment(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      })

      let right_view_alt = document.getElementById("right-view-alt");
      let right_view = document.getElementById("right-view");
      if (selectedCourseId === null) {
        right_view_alt.style.display = "block";
        right_view.style.display = "none";
      } else {
        right_view_alt.style.display = "none";
        right_view.style.display = "block";
      }
    }
    

    fetchData();
  }, [assignments])

  const selectCourse = (evt) => {
    evt.preventDefault();
    // const value = evt.target.getAttribute('value');

    setSelectCourseId(evt.target.getAttribute('value'));
    setSelectCourse(evt.target.getAttribute('name'));
  }

  const handleChange = evt => {
    const formName = evt.target.name;
    const value = evt.target.value;

    let newCourse = {
      [formName]: value,
    };
    
    if (showCourse) setCourseInformation(Object.assign(courseInformation, newCourse))
    if (showAssignment) setAssignmentInformation(Object.assign(assignmentInformation, newCourse))
  }

  const addCourse = () => {
    db.collection('class')
    .add(courseInformation)
    .then(res => {
      setCourseInformation({});
      handleCloseCourse();
      router.push('/');
    })
    .catch(err => console.log(err));
  }

  const addAssignment = () => {
    db.collection('class').doc(`${selectedCourseId}`).collection('assignment')
    .add(assignmentInformation)
    .then(res => {
      setAssignmentInformation({});
      handleCloseAssignment();
      router.push('/');
    })
    .catch(err => console.log(err));
  }

  const createOptions = () => {
    let options = [];

    for (let i = 1; i <= 20; i += 1)
    {
      options.push(
        <option value={i}>{i}</option>
      )
    }

    return options;
  }
  
  return (
    <div className="container">
      <Head>
        <title>classmaster | 클래스마스터 | 사이드 프로젝트 커뮤니티 - 킥사</title>
        <meta 
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' 
        />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Noto+Sans+KR&display=swap" rel="stylesheet"></link>
      </Head>

      <main>
        <Container fluid>
          <Row>
            <Col sm={12} className="today">
              <h1>
                {moment().format('YYYY년 MMMM Do dddd')} - <span style={{color: "#1a73e8"}}>2주차</span>
              </h1>
            </Col>
            <Col sm={4} className="left-bar">
              <ul className="list-unstyled">
                <li className="semester">
                  <p>2020-1학기</p>
                </li>
              {
                courses.map(course => {
                  if (course.class_id === selectedCourseId) {
                    return (
                      <li key={course.class_id}>
                          <p className="pointer" name={course.class_name} value={course.class_id} onClick={selectCourse}>
                            <strong>{course.class_name}</strong>
                          </p>
                      </li>
                    )
                  } else {
                    return (
                      <li key={course.class_id}>
                          <p className="pointer" name={course.class_name} value={course.class_id} onClick={selectCourse}>
                            {course.class_name}
                          </p>
                      </li>
                    )
                  }
                })
              }
                <li>
                  <Button variant="outline-primary" onClick={handleShowCourse}>과목추가</Button>
                </li>
              </ul>
              <Modal show={showCourse} onHide={handleCloseCourse}>
                <Form>
                  <Modal.Header closeButton>
                    <Modal.Title>과목 추가</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        학기
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="semester" readOnly defaultValue="2020-1학기" />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        과목명
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="class_name" placeholder="경영학원론" onChange={handleChange} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        요일
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="day" placeholder="예시) 월 9시~12시" onChange={handleChange}/>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        교수님
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="professor" type="text" placeholder="홍길동" onChange={handleChange}/>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        Email
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="email" type="email" placeholder="email" controlId="formPlaintextEmail" onChange={handleChange}/>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        page
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="homepage" type="email" placeholder="참고 홈페이지" controlId="formPlaintext" onChange={handleChange}/>
                      </Col>
                    </Form.Group>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" type="reset" onClick={handleCloseCourse}>
                      취소
                    </Button>
                    <Button variant="primary" onClick={addCourse}>
                      추가
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal>
            </Col>
            <Col sm={8} className="row-centering" id="right-view-alt">
              <Row>
                <p>과목을 선택하세요.</p>
              </Row>
            </Col>
            <Col sm={8} className="right-view" id="right-view">
              <Row className="course-container">
                <Col sm={12}>
                  <Row>
                    <Col sm={12} className="dash">
                      <h3>과목 정보</h3>
                    </Col>
                  </Row>
                  {
                    courses.map(course => {
                      if (course.class_id === selectedCourseId) {
                        return (
                          <Row className="detail-box">
                            <Col sm={2} className="margin-btm-lg">
                              과목
                            </Col>
                            <Col sm={10} className="margin-btm-lg">
                              {course.class_name}
                            </Col>
                            <Col sm={2} className="margin-btm-lg">
                              시간
                            </Col>
                            <Col sm={10} className="margin-btm-lg">
                              {course.day}
                            </Col>
                            <Col sm={2} className="margin-btm-lg">
                              교수님
                            </Col>
                            <Col sm={10} className="margin-btm-lg">
                              {course.professor}
                            </Col>
                            <Col sm={2} className="margin-btm-lg">
                              메일
                            </Col>
                            <Col sm={10} className="margin-btm-lg">
                              {course.email}
                            </Col>
                            <Col sm={2} className="margin-btm-lg">
                              링크
                            </Col>
                            <Col sm={10} className="margin-btm-lg">
                              <a
                                href={course.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                <strong>홈페이지</strong>
                              </a>
                            </Col>
                          </Row>
                          )
                        }
                      })
                  }
                </Col>
              </Row>
              <Row className="assignment-container">
                <Col>
                  <Row>
                    <Col sm={12} className="dash">
                        <h3>과제</h3>
                    </Col>
                    <Col sm={12} className="margin-top-btm-lg row-start">
                      <Button variant="outline-primary" onClick={handleShowAssignment}>과제추가</Button>
                    </Col>
                  </Row>
                  {
                    assignments.length && assignments.map(assignment => (
                      <Row className="detail-box margin-btm-lg">
                        <Col sm={12}>
                          <h4>
                            {assignment.weeks}주차
                          </h4>
                        </Col>
                        <Col sm={2}>
                          기한
                        </Col>
                        <Col sm={10}>
                          {assignment.deadline}
                        </Col>
                        <Col sm={2}>
                          중요
                        </Col>
                        <Col sm={10}>
                          {assignment.note}
                        </Col>
                        <Col sm={2}>
                          내용
                        </Col>
                        <Col sm={10}>
                          {assignment.text}
                        </Col>
                      </Row>
                    ))
                  }
                </Col>
              </Row>
              <Modal show={showAssignment} onHide={handleCloseAssignment}>
                <Form>
                  <Modal.Header closeButton>
                    <Modal.Title>{selectedCourse} - 과제 추가</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        주차
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="weeks" as="select" type="number" defaultValue="1" onChange={handleChange}>
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
                        <Form.Control name="deadline" placeholder="제출 기한" onChange={handleChange} />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        중요
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="note" placeholder="교수님이 짚어주신 포인트" onChange={handleChange}/>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPlaintext">
                      <Form.Label column sm="2">
                        과제
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control name="text" type="text" placeholder="Chapter 1~2 요약하기" onChange={handleChange}/>
                      </Col>
                    </Form.Group>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" type="reset" onClick={handleCloseAssignment}>
                      취소
                    </Button>
                    <Button variant="primary" onClick={addAssignment}>
                      추가
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal>
            </Col>
          </Row>
        </Container>
      </main>

      <footer>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          >
          MVP 사이드 프로젝트 커뮤니티 - 킥보드 만드는 사람들
        </a>
      </footer>

      <style jsx>{`
        .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .pointer {
          cursor: pointer;
      }

        main {
            width: 100%;
            padding: 5rem 0;
            flex: 1;

        }

        footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        footer img {
            margin-left: 0.5rem;
        }

        footer a {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        `}</style>

    </div>

  );
}



home.getInitialProps = async ({query}) => {
  const db = firebase.firestore();

  let courses = await new Promise((resolve, reject) => {
    let data = [];
    db.collection('class').orderBy('class_name', 'asc')
    .get()
    .then(docs => {
      docs.forEach(doc => {
        data.push(Object.assign({
            class_id: doc.id,
        }, doc.data()))
      })
      resolve(data);
    })
    .catch(err => reject([]));
  })

  return {
    data: {
      courses,
    }
  };

}