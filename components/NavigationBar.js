import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

/* Configures */
import firebase from '../configure/firebase'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/root.css'
import '../static/navbar.css'

export default function NavigationBar (props) {
    const router = useRouter();
    const {
        user,
        handleSignIn,
    } = props

    const handleSignOut = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('로그아웃 성공')
            router.push('/')
          }).catch(function(error) {
            // An error happened.
            console.log(error)
        });
    }

    return (
        <div>
            <Head>
                <link rel="icon" href="" />
                <meta 
                    name='viewport'
                    content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' 
                />
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Noto+Sans+KR&display=swap" rel="stylesheet"></link>
            </Head>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Link href='/'>
                    <Navbar.Brand style={{ cursor: "pointer" }}>ClassMatser beta</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="#features">Features</Nav.Link> */}
                        {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                    </Nav>
                    <Nav>
                        {
                            user.uuid
                            ? <Nav.Link onClick={handleSignOut}>로그아웃</Nav.Link>
                            : <Nav.Link onClick={handleSignIn}>로그인</Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};