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

/* Components */
import NavigationBar from '../components/NavigationBar'

/* Styles */
import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/root.css'
import '../static/home.css'

export default function home (props) {
  const router = useRouter();
  const db = firebase.firestore();
  
  const [ coursesData, setCourses ] = useState([])
  const courses = coursesData;
  const [ semester, setSemester ] = useState("2020-1")
  const [ selectedCourseId, setSelectCourseId ] = useState(null)
  const [ selectedCourse, setSelectCourse ] = useState(null)
  const [ assignments, setAssignment ] = useState({})
  const [ showCourse, setShowCourse ] = useState(false)
  const [ showCourseDelete, setShowCourseDelete ] = useState(false)
  const [ showCourseEdit, setShowCourseEdit ] = useState(false)
  const [ showAssignment, setShowAssignment ] = useState(false)
  const [ showAssignmentEdit, setShowAssignmentEdit ] = useState(false)
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
    weeks: 1,
  })

  const handleShowCourse = () => setShowCourse(true)
  const handleCloseCourse = () => setShowCourse(false)
  const handleCourseEdit = () => {
    if (showCourseEdit === false) setShowCourseEdit(true)
    if (showCourseEdit === true) setShowCourseEdit(false)
  }
  const handleCourseDelete = () => {
    let course_setting = document.getElementsByClassName("course-setting");
    if (course_setting[0].className.split(' ').indexOf('active') === -1)
    {
      setShowCourseDelete(true)
      course_setting[0].className += " active";
  
      let course_deletes = document.getElementsByClassName("course-delete");
      Array.prototype.forEach.call(course_deletes, element => {
        element.style.display = "block"
      })
    } else {
      setShowCourseDelete(false)
      course_setting[0].className = course_setting[0].className.replace(" active", "");
  
      let course_deletes = document.getElementsByClassName("course-delete");
      Array.prototype.forEach.call(course_deletes, element => {
        element.style.display = "none"
      })
    }
  }
  
  const handleShowAssignment = () => setShowAssignment(true)
  const handleCloseAssignment = () => setShowAssignment(false)
  const handleShowAssignmentEdit = () => {
    setShowAssignmentEdit(true)
    let assignment_deletes = document.getElementsByClassName("assignment-delete");
    Array.prototype.forEach.call(assignment_deletes, element => {
      element.style.display = "block"
    })
    let edit_button = document.getElementById("assignment-edit")
    edit_button.style.display = "none"
    
    let complete_button = document.getElementById("assignment-complete")
    complete_button.style.display = "block"
  }
  const handleCloseAssignmentEdit = () => {
    setShowAssignmentEdit(false)
    let assignment_deletes = document.getElementsByClassName("assignment-delete");
    Array.prototype.forEach.call(assignment_deletes, element => {
      element.style.display = "none"
    })
    let edit_button = document.getElementById("assignment-edit")
    edit_button.style.display = "block"
    
    let complete_button = document.getElementById("assignment-complete")
    complete_button.style.display = "none"
  }

  const deleteCourse = (evt) => {
    evt.preventDefault();
    let course_id = evt.target.id;
    db.collection('class').doc(`${course_id}`)
    .delete()
  }

  const deleteAssignment = (evt) => {
    evt.preventDefault();
    const selectedAssignmentId = evt.target.id
    db.collection('class').doc(`${selectedCourseId}`).collection('assignment').doc(`${selectedAssignmentId}`)
    .delete()
  }

  useEffect(() => {
    async function fetchData() {
        db.collection('class').orderBy('class_name', 'asc')
        .onSnapshot(async docs => {
          let data = [];
          await docs.forEach(doc => {
            data.push(Object.assign({
                class_id: doc.id,
            }, doc.data()))
          })
          let result = data.reduce((total, {
            class_id,
            class_name,
            day,
            email,
            homepage,
            professor,
            semester,
            uuid,
            ...data
          }) => {
              if(!total[semester]) {
                  total[semester] = [];
              }
    
              total[semester].push({
                class_id,
                class_name,
                day,
                email,
                homepage,
                professor,
                semester,
                uuid,
              })
              
              return total;
          }, [])
    
          let resultArr = Object.entries(result);
          setCourses(resultArr);
        })


      await db.collection('class').doc(`${selectedCourseId}`).collection('assignment').orderBy('weeks', 'desc')
      .onSnapshot(async data => {
        setAssignment(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      })

    }
    let right_view_alt = document.getElementById("right-view-alt");
    let right_view = document.getElementById("right-view");
    if (selectedCourseId === null) {
      right_view_alt.style.display = "block";
      right_view.style.display = "none";
    } else {
      right_view_alt.style.display = "none";
      right_view.style.display = "block";
    }

    const course_edit = document.getElementsByClassName('course-edit');
    const course_edit_cancel = document.getElementsByClassName('course-edit-cancel');
    if (showCourseEdit === true) {
      course_edit_cancel[0].style.display = 'block'
      course_edit[0].className += " active"
      course_edit[0].getElementsByTagName("span")[0].innerHTML = '완료'
    }
    if (showCourseEdit === false) {
      course_edit_cancel[0].style.display = 'none'
      course_edit[0].className = course_edit[0].className.replace(" active", "")
      course_edit[0].getElementsByTagName("span")[0].innerHTML = '수정'
    }
    
    fetchData();
  }, [selectedCourseId, showCourseEdit])

  const selectCourse = (evt) => {
    evt.preventDefault();
    // const value = evt.target.getAttribute('value');

    setSelectCourseId(evt.target.getAttribute('id'))
    setSelectCourse(evt.target.getAttribute('name'))
    setSemester(evt.target.getAttribute('value'))
    handleCloseAssignmentEdit(false)
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
      setCourseInformation({
        class_name: '',
        day: '',
        email: '',
        homepage: '',
        professor: '',
        semester: '2020-1',
        uuid: '',
      });
      handleCloseCourse();
      router.push('/');
    })
    .catch(err => console.log(err));
  }

  const addAssignment = () => {
    db.collection('class').doc(`${selectedCourseId}`).collection('assignment')
    .add(assignmentInformation)
    .then(res => {
      setAssignmentInformation({
        deadline: null,
        note: null,
        text: null,
        weeks: 1,
      });
      handleCloseAssignment();
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
    <div className="theme-background">
      <NavigationBar />
      <div className="container fluid">
        <Head>
          <title>classmaster | 클래스마스터 | 사이드 프로젝트 커뮤니티 - 킥사</title>
          <meta 
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' 
          />
          <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Noto+Sans+KR&display=swap" rel="stylesheet"></link>
          <script src="https://kit.fontawesome.com/8cf5b2f14d.js" crossorigin="anonymous"></script>
        </Head>
        <main>
          <Container fluid>
            <Row>
              <Col md={12} className="today">
                <div className="h1" style={{color: "#1a73e8"}}>
                  {moment().format('YYYY년 MMMM Do dddd')}<span style={{color: "#1a73e8"}}></span>
                </div>
              </Col>
              <Col md={4} className="left-bar">
                <ul className="list-unstyled">
                  <li className="tool-box">
                    <span className="tool course-add" onClick={handleShowCourse}>과목 추가</span>
                    <span className="tool course-setting" onClick={handleCourseDelete}>관리</span>
                  </li>
                  {
                    courses.map(classes => {
                      return (
                        <div>
                          <li className="semester">
                            <p>{classes[0]}</p>
                          </li>
                          {
                            classes[1].map(course => {
                              if (course.class_id === selectedCourseId) {
                                return (
                                  <li key={course.class_id}>
                                    <div>
                                      <p className="pointer" name={course.class_name} id={course.class_id} value={classes[0]} onClick={selectCourse}>
                                        <strong>{course.class_name}</strong>
                                      </p>
                                      <p id={course.class_id} className="course-delete" onClick={deleteCourse}>삭제</p>
                                    </div>
                                  </li>
                                )
                              } else {
                                return (
                                  <li key={course.class_id}>
                                    <div>
                                      <p className="pointer" name={course.class_name} id={course.class_id} value={classes[0]} onClick={selectCourse}>
                                        {course.class_name}
                                      </p>
                                      <p id={course.class_id} className="course-delete" onClick={deleteCourse}>삭제</p>
                                    </div>
                                  </li>
                                )
                              }
                            })
                          }
                        </div>
                      )
                    })
                  }
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
              <Col md={8} className="row-centering" id="right-view-alt">
                <Row>
                  <p>과목을 선택하세요.</p>
                </Row>
              </Col>
              <Col md={8} className="right-view" id="right-view">
                <Row className="course-container">
                  <Col sm={12}>
                    <Row>
                      <Col sm={12} className="content-header dash">
                        <div className="h3">과목 정보</div>
                      </Col>
                      <Col sm={12} className="tool-box row-start">
                        <div className="tool course-edit-cancel" value="cancel"><span>취소</span></div>
                        <div className="tool course-edit" value="edit" onClick={handleCourseEdit}><span>수정</span></div>
                      </Col>
                    </Row>
                    {
                      courses.map(classes => {
                        return (
                          classes[1].map(course => {
                            if (course.class_id === selectedCourseId) {
                              return (
                                <div className="detail-box">
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      과목
                                    </Col>
                                    <Col md={10} className="">
                                      {course.class_name}
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      시간
                                    </Col>
                                    <Col md={10} className="">
                                      {course.day}
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      교수님
                                    </Col>
                                    <Col md={10} className="">
                                      {course.professor}
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      메일
                                    </Col>
                                    <Col md={10} className="">
                                      {course.email}
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      링크
                                    </Col>
                                    <Col md={10} className="">
                                      <a
                                        href={course.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        >
                                        <strong>홈페이지</strong>
                                      </a>
                                    </Col>
                                  </Row>
                                </div>
                              )
                            }
                          })
                        )
                      })
                    }
                  </Col>
                </Row>
                <Row className="assignment-container">
                  <Col sm={12}>
                    <Row>
                      <Col sm={12} className="content-header dash">
                          <div className="h3">과제</div>
                      </Col>
                      <Col sm={12} className="tool-box row-start">
                        <div className="tool" onClick={handleShowAssignment}><span>추가</span></div>
                        <div className="tool" id="assignment-edit" onClick={handleShowAssignmentEdit}><span>수정</span></div>
                        <div className="tool" id="assignment-complete" onClick={handleCloseAssignmentEdit}><span>완료</span></div>
                      </Col>
                    </Row>
                    {
                      assignments.length && assignments.map(assignment => (
                        <div className="detail-box margin-top-btm-lg">
                          <Row>
                            <Col md={12}>
                              <div className="h4">{assignment.weeks}주차</div>
                              <div className="assignment-delete tool">
                                <span id={assignment.id} onClick={deleteAssignment}>삭제</span>
                              </div>
                            </Col>
                          </Row>
                          <Row  className="margin-top-btm-md">
                            <Col md={2} className="word ">
                              기한
                            </Col>
                            <Col md={10} className="">
                              {assignment.deadline}
                            </Col>
                          </Row>
                          <Row  className="margin-top-btm-md">
                            <Col md={2} className="word ">
                              중요
                            </Col>
                            <Col md={10} className="">
                              <p>{assignment.note}</p>
                            </Col>
                          </Row>
                          <Row  className="margin-top-btm-md">
                            <Col md={2} className="word ">
                              내용
                            </Col>
                            <Col md={10} className="">
                              {assignment.text}
                            </Col>
                          </Row>
                        </div>
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
    </div>

  );
}



home.getInitialProps = async ({query}) => {
  const db = firebase.firestore();

  let courses = await new Promise((resolve, reject) => {
    let data = [];
    db.collection('class').orderBy('class_name', 'asc')
    .get()
    .then(async docs => {
      await docs.forEach(doc => {
        data.push(Object.assign({
            class_id: doc.id,
        }, doc.data()))
      })
      let result = await data.reduce((total, {
        class_id,
        class_name,
        day,
        email,
        homepage,
        professor,
        semester,
        uuid,
        ...data
      }) => {
          if(!total[semester]) {
              total[semester] = [];
          }

          total[semester].push({
            class_id,
            class_name,
            day,
            email,
            homepage,
            professor,
            semester,
            uuid,
          })
          
          return total;
      }, [])

      let resultArr = Object.entries(result);

      resolve(resultArr);
    })
    .catch(err => reject([]));
  })

  return {
    data: {
      courses,
    }
  };

}