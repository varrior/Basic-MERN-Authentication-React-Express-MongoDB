import React, { Component } from 'react';
import Users from './components/users/users';
import Home from './components/Home/home';
import Blog from './components/Blog/blog';
import Login from './components/Login/Login'
import Register from './components/Register/Register';
import Activation from './components/Activation/Activation'
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
    Redirect,
} from 'react-router-dom'
import { isLoggedIn, checkSession, logOut } from './components/Auth/AuthService'

const Protected = () => <div className="protectedRoute"><h1>Protected page! If you can see this route, means that you are authenticated user :)</h1></div>

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props)=> (
        isLoggedIn()
        ?<Component {...props}/>
        :<Redirect to={{
            pathname: '/home',
            state: {from: props.location}
        }}/>
    )} ></Route>
)

class App extends React.Component {
    constructor(props, context){
        super(props);
        this.state = {
            loginSuccessful: false
        }
        this.logOutUser = this.logOutUser.bind(this);
        this.doLogin = this.doLogin.bind(this)
        console.log(this)
    }
    loginModalRef = ({handleShow, state}) => {
        this.showModal = handleShow;
        console.log(state)
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
    componentWillMount(){
        checkSession();
        if(isLoggedIn()){
            this.setState({
                login: true
            })
        } else {
            this.setState({
                login: false
            })
        }
    }
    logOutUser(){
        logOut();
        this.setState({
            login: false
        })
    }
    doLogin(val){
        this.setState({
            login: val
        })
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
                                <NavItem componentClass={Link} href="/protected" to="/protected">Protected</NavItem>
                            </Nav>
                            <Nav pullRight>
                                <NavItem>
                                    {!this.state.login?
                                        <Button onClick={this.onLoginClick}>Login</Button>
                                    :
                                        <Button onClick={this.logOutUser}>Log out</Button>}
                                </NavItem>
                                <NavItem>
                                    {!this.state.login?
                                        <Button bsStyle="danger" onClick={this.onRegisterClick}>Register</Button>
                                    : null}
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Login doLogin={this.doLogin} ref={this.loginModalRef}></Login>
                    <Register ref={this.registerModalRef}></Register>
                    <Switch>
                        <Route exact path="/" component={Users} />
                        <Route path="/users" component={Users}/>
                        <Route path="/blog" component={Blog} />
                        <Route path="/home" component={Home}/>
                        <Route exact path="/activate/:id" component={Activation}/>
                        <PrivateRoute path="/protected" component={Protected}/>
                        
                        <Route component={Blog}></Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;
