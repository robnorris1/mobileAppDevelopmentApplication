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

export default class UpdateInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }

    };

    getAuthCode = async () => {
        let value = (await AsyncStorage.getItem('@session_token')).replace(/"/g, "");
        let valueID = (await AsyncStorage.getItem('@user_id'));

        return [value, valueID];
    }

    addItem(){
        let to_send = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        };

        this.getAuthCode().then((values) => {
            let value = values[0];
            let valueID = values[1];

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + valueID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            Alert.alert("Updated user info");
        })
        .catch((error) => {
            console.log(error);
        })
    })
    }
    

    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text 
                    style={{fontSize: 27}}>
                    UpdateInfo
                </Text>
                <TextInput 
                placeholder='First Name...'
                onChangeText={(first_name) => this.setState({first_name : first_name})}
                value={this.state.first_name}
                />
                <TextInput placeholder='Last Name...'
                onChangeText={(last_name) => this.setState({last_name : last_name})}
                value={this.state.last_name}
                />
                <TextInput placeholder='Email...' 
                onChangeText={(email) => this.setState({email : email})}
                value={this.state.email}
                />
                <TextInput placeholder='Password...' 
                onChangeText={(password) => this.setState({password : password})}
                value={this.state.password}
                />
                <View style={{margin:7}} />
                <Button 
                        title="Submit"
                          onPress={() => { 
                            this.setState({
                                isLoading : true});
                            this.addItem()
                        }}
                      />
                  </ScrollView>
            )
    }
}