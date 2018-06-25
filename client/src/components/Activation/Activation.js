import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Activation.css';
import rabbit from './rabbit.svg'
import {
    Alert,
    Grid,
    Row,
    Fade
} from 'react-bootstrap';

class Activation extends React.Component {
    constructor(props){
        super(props)
        this.token = props.match.params.id
        this.state = {
            fadeOn: false,
            activationIsComplete: false,
        }
    }
    componentDidMount(){
        fetch('/api/activate/' + this.token, {
            method: 'PUT'
        }).then((response) => response.json())
        .then((message)=>{
            if(message.success){
                this.setState({
                    fadeOn: true,
                    msg: message.message,
                });
                setTimeout(()=>{
                    this.setState({
                        activationIsComplete: true,
                    });
                },2000)
            } else {
                this.setState({
                    fadeOn: true,
                    errMsg: message.message,
                    activationIsComplete: false,
                })  
            }
        })
    }

    render(){
        if(this.state.activationIsComplete){
            return <Redirect to="/"/>
        } else {
            return (
                <Grid>
                    <Row>
                        <img className="rabbit" src={rabbit}/>
                        <Fade in={this.state.fadeOn}>
                            {this.state.msg?
                                <Alert bsStyle="success" className="activeAlert">{this.state.msg}</Alert>
                                :
                                <Alert bsStyle="danger" className="activeAlert">{this.state.errMsg}</Alert> 
                            }
                        </Fade>
                    </Row>                           
                </Grid>        
            )
        }
    }
}

export default Activation