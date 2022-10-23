import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

function Navigation() {
    return(
        <Navbar bg="dark" variant="dark" expand="md">
            <Container fluid>
                <Navbar.Brand as={Link} to={process.env.PUBLIC_URL + '/'}>Group 9 ASE Project</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={process.env.PUBLIC_URL + '/'}>Home</Nav.Link>
                        <Nav.Link as={Link} to={process.env.PUBLIC_URL + '/n-queens-problem'}>N Queens Problem</Nav.Link>
                        <Nav.Link as={Link} to={process.env.PUBLIC_URL + '/polysphere-puzzle'}>Polysphere Puzzle</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;