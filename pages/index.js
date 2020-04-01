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

/* Custom Hooks */


/* Components */
import NavigationBar from '../components/NavigationBar'
import Modal_CourseEdit from '../components/Modal_CourseEdit'
import Modal_AssignmentEdit from '../components/Modal_AssignmentEdit'

/* Styles */
import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/root.css'
import '../static/home.css'

export default function home (props) {
  const router = useRouter();
  const db = firebase.firestore();
  const {
    user,
    handleSignIn,
  } = props

  const [ coursesData, setCourses ] = useState([])
  const courses = coursesData;
  const [ semester, setSemester ] = useState("2020-1")
  const [ selectedCourseId, setSelectCourseId ] = useState(null)
  const [ selectedCourse, setSelectCourse ] = useState({})
  const [ assignments, setAssignment ] = useState({})

  const [ showCourse, setShowCourse ] = useState(false)
  const [ courseInformation, setCourseInformation ] = useState({
    class_name: '',
    day: '',
    email: '',
    homepage: '',
    professor: '',
    semester: '2020-1',
    uuid: null,
  })
  const [ showCourseEdit, setShowCourseEdit ] = useState(false)
  const [ willUpdateCourse, setWillUpdateCourse ] = useState({
    class_name: '',
    day: '',
    email: '',
    homepage: '',
    professor: '',
    semester: '2020-1',
  })
  const [ showCourseDelete, setShowCourseDelete ] = useState(false)
  
  const [ showAssignment, setShowAssignment ] = useState(false)
  const [ assignmentInformation, setAssignmentInformation ] = useState({
    deadline: null,
    note: null,
    text: null,
    weeks: null,
  })
  const [ showAssignmentManage, setShowAssignmentManage ] = useState(false)
  const [ showAssignmentEdit, setShowAssignmentEdit ] = useState(false)
  const [ selectedAssignmentId, setSelectedAssignmentId ] = useState(null)
  const [ willUpdateAssignment, setWillUpdateAssignment ] = useState({
    deadline: null,
    note: null,
    text: null,
    weeks: null,
  })

  const handleChange = evt => {
    const formName = evt.target.name;
    const value = evt.target.value;

    let newData = {
      [formName]: value,
    };

    console.log(newData);
    if (showCourse) setCourseInformation(Object.assign(courseInformation, newData))
    if (showAssignment) setAssignmentInformation(Object.assign(assignmentInformation, newData))
    if (showAssignmentEdit) setWillUpdateAssignment(Object.assign(willUpdateAssignment, newData))
    if (showCourseEdit) setWillUpdateCourse(Object.assign(willUpdateCourse, newData))
  }

  const handleShowCourse = () => {
    setShowCourse(true)
    setShowCourseDelete(false)
    setShowCourseEdit(false)
    setShowAssignment(false)
    setShowAssignmentEdit(false)
    handleCloseAssignmentManage()
  }
  const handleCloseCourse = () => setShowCourse(false)
  const handleCourseEdit = () => {
    if (showCourseEdit === false) {
      setShowCourseEdit(true)
      setShowCourseDelete(false)
      setShowAssignmentManage(false)
    }
    if (showCourseEdit === true) setShowCourseEdit(false)
  }
  const handleCourseEditCancel = () => setShowCourseEdit(false)
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
  
  const handleShowAssignment = () => {
    setShowAssignment(true)
    handleCloseAssignmentManage()
    setShowCourseDelete(false)
  }
  const handleCloseAssignment = () => setShowAssignment(false)
  const handleShowAssignmentManage = () => {
    setShowAssignmentManage(true)
    setShowCourse(false)
    setShowCourseDelete(false)
    setShowCourseEdit(false)
    setShowAssignment(false)

    /* 과제 수정 열기 */
    let assignment_edits = document.getElementsByClassName("assignment-edit");
    Array.prototype.forEach.call(assignment_edits, element => {
      element.style.display = "block"
    })
    
    /* 과제 삭제 열기 */
    let assignment_deletes = document.getElementsByClassName("assignment-delete");
    Array.prototype.forEach.call(assignment_deletes, element => {
      element.style.display = "block"
    })

    /* 완료 버튼 열고 선택 버튼 닫기 */
    let edit_button = document.getElementById("select-assignment-manage")
    edit_button.style.display = "none"
    
    let complete_button = document.getElementById("select-assignment-complete")
    complete_button.style.display = "block"
  }
  const handleCloseAssignmentManage = () => {
    setShowAssignmentManage(false)

    /* 과제 수정 닫기 */
    let assignment_edits = document.getElementsByClassName("assignment-edit");
    Array.prototype.forEach.call(assignment_edits, element => {
      element.style.display = "none"
    })
    
    /* 과제 삭제 닫기 */
    let assignment_deletes = document.getElementsByClassName("assignment-delete");
    Array.prototype.forEach.call(assignment_deletes, element => {
      element.style.display = "none"
    })

    /* 완료 버튼 닫고 선택 버튼 열기 */
    let edit_button = document.getElementById("select-assignment-manage")
    edit_button.style.display = "block"
  
    let complete_button = document.getElementById("select-assignment-complete")
    complete_button.style.display = "none"
  }

  const handleShowAssignmentEdit = (evt) => {
    let id = evt.target.id
    console.log(id)
    setShowAssignmentEdit(true)
    setShowCourse(false)
    setShowCourseDelete(false)
    setShowCourseEdit(false)
    setShowAssignment(false)
    setSelectedAssignmentId(id)
    
    let selectedAssignment = assignments.filter(assignment => id === assignment.id)[0]
    setWillUpdateAssignment(selectedAssignment)
  }

  const handleCloseAssignmentEdit = () => {
    setShowAssignmentEdit(false)
    setWillUpdateAssignment({
      deadline: null,
      note: null,
      text: null,
      weeks: null,
    })
  }

  useEffect(() => {
    async function fetchData() {
        await db.collection('class').where('uuid', '==', user.uuid).orderBy('class_name', 'asc')
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

    setCourseInformation(Object.assign(courseInformation, { uuid: user.uuid }))

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
      course_edit[0].style.display = 'none'
    }
    if (showCourseEdit === false) {
      course_edit_cancel[0].style.display = 'none'
      course_edit[0].style.display = 'block'
    }

    let course_setting = document.getElementsByClassName("course-setting");
    if (showCourseDelete === false) {
      course_setting[0].className = course_setting[0].className.replace(" active", "");
  
      let course_deletes = document.getElementsByClassName("course-delete");
      Array.prototype.forEach.call(course_deletes, element => {
        element.style.display = "none"
      })
    }

    fetchData();
  }, [user, selectedCourseId, showCourseEdit, showCourseDelete])

  const selectCourse = (evt) => {
    evt.preventDefault();
    let id = evt.target.getAttribute('id')
    let name = evt.target.getAttribute('name')
    let value = evt.target.getAttribute('value')

    db.collection('class').doc(`${id}`)
      .get()
      .then(async doc => {
        await setSelectCourse(Object.assign({
          class_id: doc.id,
        }, doc.data()))
        
        await setWillUpdateCourse(Object.assign({
          class_id: doc.id,
        }, doc.data()))
      })

    setSelectCourseId(id)
    setSemester(value)
    handleCloseAssignmentManage()
    setShowCourseEdit(false)
    setShowCourseDelete(false)
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
        uuid: null,
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

  const updateCourse = () => {
    db.collection('class').doc(`${selectedCourseId}`)
    .update(willUpdateCourse)
    .then(res => setShowCourseEdit(false))
  }

  const updateAssignment = () => {
    db.collection('class').doc(`${selectedCourseId}`).collection('assignment').doc(`${selectedAssignmentId}`)
    .update(willUpdateAssignment)
    .then(res => {
      setShowAssignmentEdit(false)
      setWillUpdateAssignment({
        deadline: null,
        note: null,
        text: null,
        weeks: 1,
      })
    })
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
      <NavigationBar
        user={user}
        handleSignIn={handleSignIn}
      />
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
                    <span className="tool course-add add" onClick={handleShowCourse}>강의 추가</span>
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
                                      <p id={course.class_id} className="course-delete delete" onClick={deleteCourse}>삭제</p>
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
                                      <p id={course.class_id} className="course-delete delete" onClick={deleteCourse}>삭제</p>
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
                      <Modal.Title>강의 추가</Modal.Title>
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
                          강의명
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
                <Row className="non-selected-right-view col-centering">
                  <Col md={8} className="col-centering margin-btm-md">
                    <Row className="w-fluid col-start margin-btm-md padding-top-btm-md dash">
                      {
                        !user.uuid &&
                        <div>
                          <div className="margin-btm-lg">
                            <p className="h6">
                              <strong>이번 주 수업 과제</strong>가 뭐였지?
                            </p>
                            <p className="h6">
                              <strong>언제까지 </strong>내야하지?
                            </p>
                            <p className="h6">
                              <strong>손으로 </strong>써야하나?
                            </p>
                          </div>
                          <div className="typewriter margin-btm-lg">
                            <p className="h2">
                              전부,
                            </p>
                            <p className="h2">
                              클래스마스터에서
                            </p>
                            <p className="h2">한 눈에 보세요.</p>
                          </div>
                        </div>
                      }
                      {
                        user.uuid &&
                          <p className="">강의를 선택하거나 추가하세요.</p>
                      }
                      <Button onClick={handleShowCourse}>강의 추가</Button>
                    </Row>
                    {
                      !user.uuid &&
                      <div className="sub-description-conatiner">
                        <Row className="col-start margin-unstyled margin-btm-md">
                          <p className="sub-description" onClick={handleSignIn}>지금 <span className="blue strong pointer">로그인</span>하고 흩어진 강의를 간편하게 저장하고 관리하세요!</p>
                          <p className="sub-description">로그인이 제대로 안될 경우
                              <Link
                                  href=
                                  {
                                    `${router.pathname}`
                                  }
                                  >
                                <a className="strong pointer"> 여기</a>
                              </Link>
                          를 눌러주세요.</p>
                        </Row>
                        <Row className="col-start margin-unstyled margin-btm-md">
                          <span className="">
                            <span className="kakaotalk strong">카카오톡</span> 내 웹브라우저는 구글 정책으로
                            <br></br>
                            <span className="warning strong">구글 로그인 불가능</span>합니다. Chrome 또는 사파리 브라우저를 이용하세요.
                          </span>
                        </Row>
                      </div>
                    }
                  </Col>
                </Row>
              </Col>
              <Col md={8} className="right-view" id="right-view">
                <Row className="course-container">
                  <Col sm={12}>
                    <Row>
                      <Col sm={12} className="content-header dash">
                        <div className="h3">강의 정보</div>
                      </Col>
                      <Col sm={12} className="tool-box row-start">
                        <div className="tool course-edit-cancel" value="cancel" onClick={handleCourseEditCancel}><span>취소</span></div>
                        <div className="tool course-edit edit" value="edit" onClick={handleCourseEdit}><span>수정</span></div>
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
                                      <span>학기</span>
                                    </Col>
                                    <Col md={10} className="">
                                      <span>{course.semester}</span>
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      <span>강의</span>
                                    </Col>
                                    <Col md={10} className="course-readonly ">
                                      {course.class_name}
                                      <span></span>
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      <span>시간</span>
                                    </Col>
                                    <Col md={10} className="course-readonly ">
                                      <span>{course.day}</span>
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      <span>교수님</span>
                                    </Col>
                                    <Col md={10} className="course-readonly ">
                                      <span>{course.professor}</span>
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      <span>메일</span>
                                    </Col>
                                    <Col md={10} className="course-readonly ">
                                      <span>{course.email}</span>
                                    </Col>
                                  </Row>
                                  <Row className="margin-top-btm-md">
                                    <Col md={2} className="word ">
                                      <span>링크</span>
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
                  <Modal_CourseEdit
                    selectedCourse={selectedCourse}
                    showCourseEdit={showCourseEdit}
                    handleCourseEdit={handleCourseEdit}
                    handleChange={handleChange}
                    updateCourse={updateCourse}
                  />
                </Row>
                <Row className="assignment-container">
                  <Col sm={12}>
                    <Row>
                      <Col sm={12} className="content-header dash">
                          <div className="h3">과제</div>
                      </Col>
                      <Col sm={12} className="tool-box row-start">
                        <div className="tool" onClick={handleShowAssignment}><span className="add">추가</span></div>
                        <div className="tool" id="select-assignment-manage" onClick={handleShowAssignmentManage}><span>선택</span></div>
                        <div className="tool" id="select-assignment-complete" onClick={handleCloseAssignmentManage}><span>완료</span></div>
                      </Col>
                    </Row>
                    <Modal_AssignmentEdit
                      willUpdateAssignment={willUpdateAssignment}
                      showAssignmentEdit={showAssignmentEdit}
                      handleCloseAssignmentEdit={handleCloseAssignmentEdit}
                      handleChange={handleChange}
                      updateAssignment={updateAssignment}
                      createOptions={createOptions}
                    />
                    {
                      assignments.length && assignments.map(assignment => (
                        <div className="detail-box margin-top-btm-lg">
                          <Row>
                            <Col md={12}>
                              <div className="h4">{assignment.weeks}주차</div>
                            </Col>
                            <Col md={12} className="row-start">
                              <div className="assignment-edit tool">
                                <span id={assignment.id} className="edit" onClick={handleShowAssignmentEdit}>수정</span>
                              </div>
                              <div className="assignment-delete tool">
                                <span id={assignment.id} className="delete" onClick={deleteAssignment}>삭제</span>
                              </div>
                            </Col>
                          </Row>
                          <Row className="margin-top-btm-md">
                            <Col md={2} className="word ">
                              <span>기한</span>
                            </Col>
                            <Col md={10} className="">
                              <p>{assignment.deadline}</p>
                            </Col>
                          </Row>
                          <Row className="margin-top-btm-md">
                            <Col md={2} className="word ">
                              <span>중요</span>
                            </Col>
                            <Col md={10} className="">
                              <p>{assignment.note}</p>
                            </Col>
                          </Row>
                          <Row className="margin-top-btm-md">
                            <Col md={2} className="word ">
                              <span>내용</span>
                            </Col>
                            <Col md={10} className="">
                              <p>{assignment.text}</p>
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
                      <Modal.Title>{selectedCourse.class_name} - 과제 추가</Modal.Title>
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
            href="https://bit.ly/3aSqzQw"
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
  // const db = firebase.firestore();

  // let courses = await new Promise((resolve, reject) => {
  //   let data = [];
  //   db.collection('class').orderBy('class_name', 'asc')
  //   .get()
  //   .then(async docs => {
  //     await docs.forEach(doc => {
  //       data.push(Object.assign({
  //           class_id: doc.id,
  //       }, doc.data()))
  //     })
  //     let result = await data.reduce((total, {
  //       class_id,
  //       class_name,
  //       day,
  //       email,
  //       homepage,
  //       professor,
  //       semester,
  //       uuid,
  //       ...data
  //     }) => {
  //         if(!total[semester]) {
  //             total[semester] = [];
  //         }

  //         total[semester].push({
  //           class_id,
  //           class_name,
  //           day,
  //           email,
  //           homepage,
  //           professor,
  //           semester,
  //           uuid,
  //         })
          
  //         return total;
  //     }, [])

  //     let resultArr = Object.entries(result);

  //     resolve(resultArr);
  //   })
  //   .catch(err => reject([]));
  // })

  return {
    data: {
    },
  };

}