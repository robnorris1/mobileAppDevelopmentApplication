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

export default class Logoout extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);

        this.state = {
            token: ''
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus',() => {
            this.checkLoggedIn();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value !== null) {
            this.setState({token:value})
        }else{
            this.props.navigation.navigate('Login');
        }
    }

    getData = async() => {
        try {
            await AsyncStorage.removeItem('@session_token')
        } catch(e) {
            console.log(e)
        }
    }

    logout = async () => {
        let token = (await AsyncStorage.getItem('@session_token')).replace(/"/g,"");
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
            method: 'POST',
            headers: {
                'X-Authorization': token
            }
        })
            .then((response) => {
                this.props.navigation.navigate('Profile');
                if(response.status === 200){
                    this.getData();
                    this.props.navigation.navigate("Profile");
                }else if(response.status === 401){
                    this.props.navigation.navigate("Profile");
                }else{
                    throw 'Something went wrong';
                }
            })
            .catch((error) => {
                console.log(error);
                ToastAndroid.show(error, ToastAndroid.SHORT);
            })
    }

   
}