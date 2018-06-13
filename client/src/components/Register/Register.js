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
    HelpBlock
} from 'react-bootstrap'

class Register extends React.Component {

    constructor(props){
        super(props);
        this.handleShowRegister = this.handleShowRegister.bind(this);
        this.handleCloseRegister = this.handleCloseRegister.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkForm = this.checkForm.bind(this)
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
        console.log(children)
        children.forEach(element => {
            console.log(element.lastChild.lastChild.checkValidity());
        });
        let data = new FormData(event.target);
        for(let pair of data.entries()){
            data[pair[0]] = pair[1]
        }
        
        fetch('/api/register/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data)
        }).then(response => response.json())
          .then(parsedData => {
              if(parsedData.success === true){
                  this.setState({ validForm: 'success' })
              } else {
                  this.setState({ validForm: 'error' })
              }
          })
     
    }
    
    render(){
        return(
            <div className="registerModal">
                <Modal show={this.state.show} onHide={this.handleCloseRegister}>
                    <Modal.Header closeButton>
                        <Modal.Title>Rejestracja</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmit} className="registerForm" noValidate>
                            <FormGroup controlId="name" validationState={this.state.name}>
                                <ControlLabel>Imię i nazwisko</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="user"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="text" name="name" pattern="^(([a-zA-Z]{3,30})+[ ]+([a-zA-Z]{3,30})+)+$" placeholder="Imię i Nazwisko" onChange={this.checkForm}></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                {this.state.name === 'error'? <HelpBlock>
                                    <ul>
                                        <li>Musi być przerwa między imieniem a nazwiskiem</li>
                                        <li>Nie może zawierać żadnych znaków specjalnych</li>
                                        <li>Nie może zawierać liczb</li>
                                        <li>Muszą być co najmniej 3 znaki, lecz nie więcej niż 30</li>
                                    </ul>
                                </HelpBlock> :null}  
                            </FormGroup>
                            <FormGroup controlId="username" validationState={this.state.username}>
                                <ControlLabel>Nazwa użytkownika</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="pencil"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="text" name="username" placeholder="Nazwa użytkownika" pattern="^[a-zA-Z0-9]+(([ ][a-zA-Z])?[a-zA-Z]*)*$" onChange={this.checkForm} required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                {this.state.username === 'error'? <HelpBlock>
                                    <ul>
                                        { !this.state.required? 
                                            <span>
                                                <li>Nie może zawierać żadnych znaków specjalnych</li>
                                                <li>Po przerwie nie mogą występować cyfry</li>
                                                <li>Musi zawierać co najmniej 3 znaki, lecz nie więcej niż 20</li>  
                                            </span>
                                        : null} 
                                        { this.state.required? 
                                            <li>Nazwa użytkownika jest wymagana</li>
                                        : null} 
                                    </ul>
                                </HelpBlock> :null} 
                            </FormGroup>
                            <FormGroup controlId="email" validationState={this.state.email}>
                                <ControlLabel>Email</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>@</InputGroup.Addon>
                                    <FormControl type="email" name="email" placeholder="Adres email" pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$" onChange={this.checkForm} required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                {this.state.email === 'error'?
                                    <HelpBlock>
                                        <ul>
                                            { !this.state.required ? 
                                                <span>
                                                    <li>Musi zawierać "@"</li>
                                                    <li>Muszą być co najmniej 3 znaki, lecz nie więcej niż 30</li>    
                                                </span>
                                            :null} 
                                            { this.state.required?
                                                <li>Adres email jest wymagany</li> 
                                            :null} 
                                        </ul>
                                    </HelpBlock> 
                                :null} 
                            </FormGroup>
                            <FormGroup controlId="password" validationState={this.state.password}>
                                <ControlLabel>Hasło</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="edit"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="password" name="password" placeholder="Hasło" pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])[0-9a-zA-Z].{7,34}$" onChange={this.checkForm} required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                { this.state.password === 'error'?
                                    <HelpBlock>
                                        <ul>
                                            { !this.state.required? 
                                                <span>
                                                    <li>Musi zawierać co najmniej jedną dużą literę</li>
                                                    <li>Musi zawierać co najmniej jedną małą literę</li>
                                                    <li>Musi zawierać co najmniej jedną cyfrę</li>
                                                    <li>Musi zawierać co najmniej 8 znaków, lecz nie więcej niż 35</li>    
                                                </span>
                                            :null} 
                                            { this.state.required? 
                                                <li>Hasło jest wymagane</li>
                                            :null}
                                        </ul>
                                    </HelpBlock> 
                                :null } 
                            </FormGroup>
                            <FormGroup controlId="confirmPassword" validationState={this.state.confirmPassword}>
                                <ControlLabel>Potwierdź hasło</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="ok"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="password" name="confirmPassword" placeholder="Potwierdź hasło" onChange={this.checkForm} required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback></FormControl.Feedback>
                                { this.state.confirmPassword === 'error'?
                                    <HelpBlock>
                                        <ul>
                                            { this.state.required? 
                                                <li>Potwierdzenie hasła jest wymagane</li>
                                            :null}
                                        </ul>
                                    </HelpBlock> 
                                :null }
                            </FormGroup>
                            <FormGroup>
                                <Button bsStyle="danger" type="submit" className="pull-right">Zarejestruj się</Button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default Register