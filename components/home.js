import React, { Component } from 'react';
import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import About from './about';
import Contact from './contact';
import CreateUser from './createUser';

import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    Alert
} from 'react-native';

export default class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: ""
        }

    };

    addItem(){
        let to_send = {
            email: this.state.email,
            password: this.state.password
        };

        console.log("something");

        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            Alert.alert("Login Successful");
            this.getData();
        })
        .catch((error) => {
            console.log(error);
        })

    }

    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text 
                    style={{fontSize: 27}}>
                    Login
                </Text>
                <TextInput placeholder='Email...' 
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                />
                <TextInput placeholder='Password...' 
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                />
                <View style={{margin:7}} />
                <Button 
                        title="Submit"
                        onPress={() => this.addItem()} 
                      />

                 <Button
                        title="Create New User"
                        onPress={()=>this.props.navigation.navigate('CreateUser')}
                 />
                  </ScrollView>
            )
    }
}
