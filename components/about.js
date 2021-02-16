import React, { Component} from 'react';
import {View, TextInput } from 'react-native';

import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

class About extends Component{

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
        // AsyncStorage.getItem('@session_token').then((token) => {console.log("session id "+ token)});

        AsyncStorage.getItem('@session_token').then((token) => {
            this.setState({session_token : token})
        });
        return(
            <View>
                <TextInput placeholder="email..." onChangeText={this.handleEmailInput} value={this.state.email} />
                <TextInput placeholder="password..." onChangeText={this.handlePasswordInput} value={this.state.password} />
                </View>
        );
    }
}

export default About;