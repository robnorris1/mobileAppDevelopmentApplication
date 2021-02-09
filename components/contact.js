import React, { Component} from 'react';
import {View, TextInput } from 'react-native';

class Contact extends Component{

    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    handleEmailInput = (email) => {
        this.setState({email: email})
    }

    
    handlePasswordInput = (password) => {
        this.setState({password: password})
    }

    render(){
        return(
            <View>
                <TextInput placeholder="email..." onChangeText={this.handleEmailInput} value={this.state.email} />
                <TextInput placeholder="password..." onChangeText={this.handlePasswordInput} value={this.state.password} />
                </View>
        );
    }
}

export default Contact;