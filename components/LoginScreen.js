import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Search from './Search';
import CreateUser from './createUser';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import Camera from './Camera';

import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    Alert,
    ToastAndroid
} from 'react-native';

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            listData: []
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener(() => {
            this.checkLoggedIn();
        })
        this.getData();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    

    getData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/find", {
            'headers': {
                'X-Authorization': value
            }
        })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    listData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
                ToastAndroid.show(error, ToastAndroid.SHORT);
            })
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    }

    render() {
        let login = new Login(this.props);
        let logout = new Logout(this.props);
        if (!this.state.isLoading) {
            return (
                <ScrollView style={{ padding: 20 }}>
                    <Text
                        style={{ fontSize: 27 }}>
                        Login
                </Text>
                    <TextInput placeholder='Email...'
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                    />
                    <TextInput placeholder='Password...'
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                    />
                    <View style={{ margin: 7 }} />
                    <Button
                        title="Submit"
                        onPress={() => {
                            this.setState({
                                isLoading: true
                            });
                            login.sendLoginDetails(this.state.email, this.state.password).then(this.setState({ isLoading: false }))
                        }}
                    />

                    <Button
                        title="Logout"
                        onPress={() => {
                            this.setState({
                                isLoading: false
                            });
                            logout.logout();
                        }}
                    />

                    <Button
                        title="Create New User"
                        onPress={() => this.props.navigation.navigate('CreateUser')}
                    />
                </ScrollView>
            )
        }
        return (
            <View>
                <Ionicons name="hourglass-outline" size={30} />
            </View>
        )
    }
}
