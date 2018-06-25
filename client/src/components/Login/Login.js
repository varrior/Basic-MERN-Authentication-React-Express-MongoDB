import React, { Component } from 'react';
import './Login.css';
import { 
    Popover,
    Tooltip,
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    InputGroup,
    Glyphicon,
    Button,
    Alert,
    Fade,
    HelpBlock
} from 'react-bootstrap';
import { login, resendLink } from '../Auth/AuthService'
import { Redirect, Switch } from 'react-router-dom';

class Login extends React.Component {
    constructor(props, context){
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.checkForm = this.checkForm.bind(this);
        this.resendForm = this.resendForm.bind(this);
        this.state = {
            show: false,
            invalidLogin: false,
            errorForm: null,
            loginSuccessful: false,
        }
    }

    handleShow() {
        this.setState({ show: true })
    }
    handleClose(){
        this.setState({ show: false })
    }
    checkForm(){
        this.setState({
            errorForm: null,
            invalidLogin: false,
        })
    }
    resendForm(e){
        e.preventDefault();
        console.log(e)
        let data = new FormData(e.target);
        for(let pair of data.entries()){
            data[pair[0]] = pair[1]
        }
        if(e.target.checkValidity()){
            resendLink(data).then(data => {
                if(data.success){
                    this.setState({
                        resendFade: true,
                        invalidResend: false,
                        resendMsg: data.message,
                        resendErrMsg: false,
                        errorResend: 'success'
                    })
                } else {
                    this.setState({
                        resendFade: false,
                        resendErrMsg: data.message,
                        resendMsg: false,
                        resendErrFade: true
                    })
                    setTimeout(()=>{
                        this.setState({
                            resendErrMsg: null,
                            resendErrFade: false,
                       })
                   }, 2000)
                }
            })            
        } else {
            this.setState({
                invalidResend: true,
                errorResend: 'error',
            })
        }
    }
    doLogin(e){
        e.preventDefault();
        let data = new FormData(e.target);
        for(let pair of data.entries()){
            data[pair[0]] = pair[1]
        }
        if(e.target.checkValidity()){
            login(data).then(data => {
                if(data.success){
                    this.setState({
                        openFade: true,
                        logMsg: data.message,
                        logErrMsg: false,
                        login: true
                    })
                    setTimeout(()=>{
                        this.props.doLogin(true)
                        this.setState({
                            logErrMsg: null,
                            openFade: false,
                            show: false,
                            loginSuccessful: true
                       })
                   }, 2000)
                } else if(data.expired){
                    this.setState({
                        expired: true,
                        logErrMsg: data.message,
                        openErrFade: true
                    })
                } else {
                    this.setState({
                        logErrMsg: data.message,
                        logMsg: false,
                        openErrFade: true
                    })
                    setTimeout(()=>{
                        this.setState({
                            logErrMsg: null,
                            openErrFade: false,
                       })
                   }, 2000)
                }
            })            
        } else {
            this.setState({
                invalidLogin: true,
                errorForm: 'error',
            })
        }
    }
    shouldComponentUpdate(pro, next){
        if(next.loginSuccessful){
            this.setState({
                loginSuccessful: false
            })
        } 
        return true
    }
    render() {
        if(this.state.loginSuccessful){
            return (
                <Switch>
                    <Redirect to='/protected'/>
                </Switch> 
            )
        } else {
            return (
                <div>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Sign in</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={this.doLogin} className="loginForm" noValidate>
                                <FormGroup controlId="username" validationState={this.state.errorForm}>
                                    <ControlLabel>Username</ControlLabel>
                                    <InputGroup>
                                        <InputGroup.Addon>
                                            <Glyphicon glyph="user"/>
                                        </InputGroup.Addon>
                                        <FormControl type="text" name="username" onChange={this.checkForm} placeholder="Username" pattern="^[a-zA-Z0-9]+(([ ][a-zA-Z])?[a-zA-Z]*)*$" required></FormControl>
                                    </InputGroup>
                                    <FormControl.Feedback/>
                                    <HelpBlock>
                                        <ul>
                                            { this.state.invalidLogin? 
                                                <span>
                                                    <li>Should not contain any special characters</li>
                                                    <li>After the space there will be no numbers</li>
                                                    <li>Must have at least 3 characters but no more than 20</li>  
                                                </span>
                                            : null} 
                                        </ul>
                                    </HelpBlock>
                                </FormGroup>
                                <FormGroup controlId="password" validationState={this.state.errorForm}>
                                    <ControlLabel>Password</ControlLabel>
                                    <InputGroup>
                                        <InputGroup.Addon>
                                            <Glyphicon glyph="pencil"/>
                                        </InputGroup.Addon>
                                        <FormControl type="password" name="password" onChange={this.checkForm} placeholder="Password" pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])[0-9a-zA-Z].{7,34}$" required></FormControl>
                                    </InputGroup>
                                    <FormControl.Feedback/>
                                        <HelpBlock>
                                            <ul>
                                                { this.state.invalidLogin? 
                                                    <span>
                                                        <li>Must contain at least one capital letter</li>
                                                        <li>Must contain at least one small letter</li>
                                                        <li>Must contain at least one number</li>
                                                        <li>Must have at least 8 characters but no more than 35</li>    
                                                    </span>
                                                :null} 
                                            </ul>
                                        </HelpBlock>  
                                </FormGroup>
                                <FormGroup>
                                    <Button bsStyle="info" type="submit" className="pull-right">Sign in</Button>
                                </FormGroup>
                            </form>
                            <Fade in={this.state.openFade}>
                                <div>
                                    {this.state.openFade?<Alert bsStyle="success" className="show-hide-message">{this.state.logMsg}</Alert>:null}
                                </div>
                            </Fade>
                            <Fade in={this.state.invalidLogin}>
                                <div>
                                    {this.state.invalidLogin?<Alert bsStyle="danger" className="show-hide-message">Fill form properly</Alert>:null}
                                </div>
                            </Fade>

                            <Fade in={this.state.openErrFade}>
                                <div>
                                    {this.state.openErrFade?<Alert bsStyle="danger" className="show-hide-message">{this.state.logErrMsg}</Alert>:null}

                                    {this.state.expired?
                                        <form onSubmit={this.resendForm} className="resendForm" noValidate>
                                            <FormGroup controlId="username" validationState={this.state.errorResend}>
                                                <ControlLabel>Username</ControlLabel>
                                                <InputGroup>
                                                    <InputGroup.Addon>
                                                        <Glyphicon glyph="user"/>
                                                    </InputGroup.Addon>
                                                    <FormControl type="text" name="username" placeholder="Username" pattern="^[a-zA-Z0-9]+(([ ][a-zA-Z])?[a-zA-Z]*)*$" required></FormControl>
                                                </InputGroup>
                                                <FormControl.Feedback/>
                                                <HelpBlock>
                                                    <ul>
                                                        { this.state.invalidResend? 
                                                            <span>
                                                                <li>Should not contain any special characters</li>
                                                                <li>After the space there will be no numbers</li>
                                                                <li>Must have at least 3 characters but no more than 20</li>  
                                                            </span>
                                                        : null} 
                                                    </ul>
                                                </HelpBlock>
                                            </FormGroup>
                                            <FormGroup>
                                                <Button bsStyle="danger" type="submit" className="pull-right">Resend activation link</Button>
                                            </FormGroup>
                                        </form>
                                    :null}
                                    <Fade in={this.state.resendFade}>
                                        <div>
                                            {this.state.resendFade?<Alert bsStyle="success" className="show-hide-message">{this.state.resendMsg}</Alert>:null}
                                        </div>
                                    </Fade>
                                    <Fade in={this.state.resendErrFade}>
                                        <div>
                                            {this.state.resendErrFade?<Alert bsStyle="danger" className="show-hide-message">{this.state.resendErrMsg}</Alert>:null}
                                        </div>
                                    </Fade>
                                </div>
                            </Fade>
                            <Fade in={this.state.invalidResend}>
                                <div>
                                    {this.state.invalidResend?<Alert bsStyle="danger" className="show-hide-message">Fill form properly</Alert>:null}
                                </div>
                            </Fade>
                        </Modal.Body>
                    </Modal>
                </div>
                
            )
        }

    }
}

export default Login