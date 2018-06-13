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
    Button
} from 'react-bootstrap';


class Login extends React.Component {
    constructor(props, context){
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        }
    }

    handleShow() {
        this.setState({ show: true })
    }
    handleClose(){
        this.setState({ show: false })
    }

    render() {
    
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Zaloguj się</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup controlId="username" validationState={null}>
                                <ControlLabel>Username</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="user"/>
                                    </InputGroup.Addon>
                                    <FormControl type="text" placeholder="Nazwa użytkownika" required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback/>
                            </FormGroup>
                            <FormGroup controlId="password" validationState={null}>
                                <ControlLabel>Hasło</ControlLabel>
                                <InputGroup>
                                    <InputGroup.Addon>
                                        <Glyphicon glyph="pencil"/>
                                    </InputGroup.Addon>
                                    <FormControl type="password" placeholder="Hasło" required></FormControl>
                                </InputGroup>
                                <FormControl.Feedback/>
                            </FormGroup>
                            <FormGroup>
                                <Button bsStyle="info" type="submit" className="pull-right">Zaloguj się</Button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
            
        )
    }
}

export default Login