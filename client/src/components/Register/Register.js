import React from 'react';
import './Register.css';
import {
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    InputGroup,
    Glyphicon,
    Button,
    HelpBlock,
    Alert,
    Fade
} from 'react-bootstrap'
import { register } from '../Auth/AuthService'
class Register extends React.Component {

    constructor(props){
        super(props);
        this.handleShowRegister = this.handleShowRegister.bind(this);
        this.handleCloseRegister = this.handleCloseRegister.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkForm = this.checkForm.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleConfirmPassord = this.handleConfirmPassord.bind(this);
        this.state = {
            show: false,
        }
        this.validateInput = null;
    }

    handleShowRegister(){
        this.setState({ show: true })
    }
    handleCloseRegister() {
        this.setState({ show: false })
    }
    checkForm(e) {
        let name = e.target.name;
        let valid = e.target.checkValidity();
        let length = e.target.value.length;
        let required = e.target.required;

        if(valid && length !== 0){
            this.setState({
                [name]: 'success'
            })
        } else if(length === 0 && valid){
            this.setState({
                [name]: null
            })
        } else if(length === 0 && !valid){
            this.setState({
                [name]: 'error',
                required: true,
            })
        } else {
            this.setState({
                [name]: 'error',
                required: false,
            })
        }
    }
    handleSubmit(event){
        event.preventDefault();
        let children = Array.from(event.target.children);
        children.pop();
        let data = new FormData(event.target);

        for(let pair of data.entries()){
            data[pair[0]] = pair[1]
        }
        if(event.target.checkValidity() && data.password === data.confirmPassword){
            register(data).then(parsedData => {
                console.log(parsedData)
                if(parsedData.success === true){
                    this.setState({ 
                        regMsg: parsedData.message,
                        openFade: true,
                        regErrMsg: null,
                     })
                     setTimeout(()=>{
                        children.forEach(element => {
                            element.children[1].lastChild.value = '';
                            let name = element.children[1].lastChild.name;
                            this.setState({
                                regMsg: null,
                                openFade: false,
                                [name]: null
                            })        
                        });
                   }, 4000)
                } else {
                    this.setState({ 
                        regErrMsg: parsedData.message,
                        openErrFade: true,
                        regMsg: null
                     })
                     setTimeout(()=>{
                         this.setState({
                             regErrMsg: null,
                             openErrFade: false
                        })
                    }, 2000)
                }
            })    
        } else {
            children.forEach(element => {
                let name = element.children[1].lastChild.name;
                let validChild = element.children[1].lastChild.checkValidity();
                let lengthVal = element.children[1].lastChild.value.length;
                if(!validChild && lengthVal === 0){
                    this.setState({
                        [name]: 'error',
                        required: true,
                    })
                } else if(!validChild && lengthVal !== 0){
                    this.setState({
                        [name]: 'error',
                        required: false,
                    })
                }
            });
        }
    }
    handlePasswordInput(e){
        this.setState({
            passwordVal: e.target.value
        })
        let valid = e.target.checkValidity();
        let length = e.target.value.length;
        let required = e.target.required;

        if(valid && length !== 0){
            this.setState({
                password: 'success'
            })
        } else if(length === 0 && valid){
            this.setState({
                password: null
            })
        } else if(length === 0 && !valid){
            this.setState({
                password: 'error',
                required: true,
            })
        } else {
            this.setState({
                password: 'error',
                required: false,
            })
        }
    }
    handleConfirmPassord(e){
        let valid = e.target.checkValidity();
        let length = e.target.value.length;
        let required = e.target.required;
    
        if(valid && length !== 0 && (this.state.passwordVal === e.target.value)){
            this.setState({
                confirmPassword: 'success'
            })
        } else if(length === 0 && valid){
            this.setState({
                confirmPassword: null
            })
        } else if(length === 0 && !valid){
            this.setState({
                confirmPassword: 'error',
                required: true,
            })
        } else {
            this.setState({
                confirmPassword: 'error',
                required: false,
            })
        }
    }

    render(){
        return(
            <div className="registerModal">
                <Modal show={this.state.show} onHide={this.handleCloseRegister}>
                    <Modal.Header closeButton>
                        <Modal.Title>Register</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmit} className="registerForm" noValidate>
                            <FormGroup controlId="name" validationState={this.state.name}>
                                <ControlLabel>Name</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="user"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="text" name="name" pattern="^(([a-zA-Z]{3,30})+[ ]+([a-zA-Z]{3,30})+)+$" placeholder="Please write your name" onChange={this.checkForm}></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                {this.state.name === 'error'? <HelpBlock>
                                    <ul>
                                        <li>Must be space between name and surname</li>
                                        <li>Should not contain any special characters</li>
                                        <li>Should not contain any numbers</li>
                                        <li>Must have at least 3 characters but no more than 30</li>
                                    </ul>
                                </HelpBlock> :null}  
                            </FormGroup>
                            <FormGroup controlId="username" validationState={this.state.username}>
                                <ControlLabel>Username</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="pencil"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="text" name="username" placeholder="Please write your username" pattern="^[a-zA-Z0-9]+(([ ][a-zA-Z])?[a-zA-Z]*)*$" onChange={this.checkForm} required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                {this.state.username === 'error'? <HelpBlock>
                                    <ul>
                                        { !this.state.required? 
                                            <span>
                                                <li>Should not contain any special characters</li>
                                                <li>After the space there will be no numbers</li>
                                                <li>Must have at least 3 characters but no more than 20</li>  
                                            </span>
                                        : null} 
                                        { this.state.required? 
                                            <li>Username is required</li>
                                        : null} 
                                    </ul>
                                </HelpBlock> :null} 
                            </FormGroup>
                            <FormGroup controlId="email" validationState={this.state.email}>
                                <ControlLabel>Email</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>@</InputGroup.Addon>
                                    <FormControl type="email" name="email" placeholder="Please write your email address" pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$" onChange={this.checkForm} required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                {this.state.email === 'error'?
                                    <HelpBlock>
                                        <ul>
                                            { !this.state.required ? 
                                                <span>
                                                    <li>Must contain "@"</li>
                                                    <li>Must have at least 3 characters but no more than 30</li>    
                                                </span>
                                            :null} 
                                            { this.state.required?
                                                <li>Email address is required</li> 
                                            :null} 
                                        </ul>
                                    </HelpBlock> 
                                :null} 
                            </FormGroup>
                            <FormGroup controlId="password" validationState={this.state.password}>
                                <ControlLabel>Password</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="edit"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="password" name="password" placeholder="Please enter the password" pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])[0-9a-zA-Z].{7,34}$" onChange={this.handlePasswordInput} required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                { this.state.password === 'error'?
                                    <HelpBlock>
                                        <ul>
                                            { !this.state.required? 
                                                <span>
                                                    <li>Must contain at least one capital letter</li>
                                                    <li>Must contain at least one small letter</li>
                                                    <li>Must contain at least one number</li>
                                                    <li>Must have at least 8 characters but no more than 35</li>    
                                                </span>
                                            :null} 
                                            { this.state.required? 
                                                <li>Password is required</li>
                                            :null}
                                        </ul>
                                    </HelpBlock> 
                                :null } 
                            </FormGroup>
                            <FormGroup controlId="confirmPassword" validationState={this.state.confirmPassword}>
                                <ControlLabel>Confirm password</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="ok"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="password" name="confirmPassword" placeholder="Please repeat your password" onChange={this.handleConfirmPassord} pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])[0-9a-zA-Z].{7,34}$" required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                { this.state.confirmPassword === 'error'?
                                    <HelpBlock>
                                        <ul>
                                            { !this.state.required? 
                                                <li>The passwords do not match</li>
                                            :null}
                                            { this.state.required? 
                                                <li>Confirm password is required</li>
                                            :null}
                                        </ul>
                                    </HelpBlock> 
                                :null }
                            </FormGroup>
                            <FormGroup>
                                <Button bsStyle="danger" type="submit" className="pull-right">Register</Button>
                            </FormGroup>                           
                        </form>
                        <Fade in={this.state.openFade}>
                            <div>
                                {this.state.openFade?<Alert bsStyle="success" className="show-hide-message">{this.state.regMsg}</Alert>:null}
                            </div>
                        </Fade>
                        <Fade in={this.state.openErrFade}>
                            <div>
                                {this.state.openErrFade?<Alert bsStyle="danger" className="show-hide-message">{this.state.regErrMsg}</Alert>:null}
                            </div>
                        </Fade>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default Register