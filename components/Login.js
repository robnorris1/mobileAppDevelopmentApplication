import React, { Component } from 'react';

import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    Alert,
    ToastAndroid
} from 'react-native';

import {NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Profile from './Profile';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.sendLoginDetails = this.sendLoginDetails.bind(this);

        this.state = {
            email: "",
            password: ""
        }
    }

    async sendLoginDetails(email, password) {
        this.state.email = email;
        this.state.password = password;
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
            .then((response) => {
                console.log(response.status);
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    throw "wrong email and password";
                } else {
                    throw "something went wrong";
                }
            })
            .then((response) => {
                Alert.alert("Login Successful");
                return response;
            })
            .catch((error) => {
                console.log(error);
            })
            .then(async (response) => {
                console.log("async method : ")
                console.log(response);
                await AsyncStorage.setItem('@session_token',JSON.stringify(response.token));
                await AsyncStorage.setItem('@user_id', JSON.stringify(response.id));
                console.log(this.props.navigation);
                this.props.navigation.navigate('Profile');
            });
    }

    render() {
        return (
            <View>
                <Login navigation = {this.props.navigation}/>
                <TextInput placeholder="email..." onChangeText={(email) => this.setState({ email })} value={this.state.email} />
                <TextInput placeholder="password..." onChangeText={(password) => this.setState({ password })} value={this.state.password} />
            </View>
        );
    }
}
