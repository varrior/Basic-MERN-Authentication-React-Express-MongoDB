import React, { Component } from 'react';
import Users from './components/users/users';
import Home from './components/Home/home';
import Blog from './components/Blog/blog';
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import {
    Navbar, 
    NavItem,
    Nav,
    Button
} from 'react-bootstrap';
import './App.css'

import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom'


class App extends Component {

    loginModalRef = ({handleShow}) => {
        this.showModal = handleShow
    };
    onLoginClick = () => {
        this.showModal();
    }
    registerModalRef = ({handleShowRegister}) => {
        this.showRegister = handleShowRegister
    };
    onRegisterClick = () => {
        this.showRegister();
    }
    render(){
        return (
            <Router>
                <div className="menu-bar">
                    
                    <Navbar fluid inverse collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link to="/home">Home</Link>
                            </Navbar.Brand>
                            <Navbar.Toggle/>
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav>
                                <NavItem componentClass={Link} href="/users" to="/users">Users</NavItem>
                                <NavItem componentClass={Link} href="/blog" to="/blog">Blog</NavItem>
                            </Nav>
                            <Nav pullRight>
                                <NavItem>
                                    <Button onClick={this.onLoginClick}>Login</Button>
                                </NavItem>
                                <NavItem>
                                    <Button bsStyle="danger" onClick={this.onRegisterClick}>Register</Button>
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Login ref={this.loginModalRef}></Login>
                    <Register ref={this.registerModalRef}></Register>
                    <Switch>
                        <Route exact path="/" component={Users}/>
                        <Route path="/users" component={Users}/>
                        <Route path="/blog" component={Blog}/>
                        <Route path="/home" component={Home}/>
                        <Route component={Blog}></Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;