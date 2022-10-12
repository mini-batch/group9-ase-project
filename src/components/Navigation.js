import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation() {
    return(
        <Navbar bg="dark" variant="dark" expand="md">
            <Container fluid>
                <Navbar.Brand href="/group9-ase-project">Group 9 ASE Project</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/group9-ase-project">Home</Nav.Link>
                        <Nav.Link href="/n-queens-problem">N Queens Problem</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;