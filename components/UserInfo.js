import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Search from './Search';
import CreateUser from './createUser';
import Login from './Login';
import Logout from './Logout';
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

export default class UserInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: []
        }
    }

    getAuthCode = async () => {
        let value = (await AsyncStorage.getItem('@session_token')).replace(/"/g, "");
        let valueID = (await AsyncStorage.getItem('@user_id'));

        console.log("session token userinfo: " + value)
        console.log("user id userinfo: " + valueID)

        return [value, valueID];
    }

    componentDidMount() {
        this.getAuthCode().then((values) => {
            let value = values[0];
            let valueID = values[1];
            fetch("http://10.0.2.2:3333/api/1.0.0/user/" + valueID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': value
                }
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson.json();
                    } else {
                        console.log(responseJson.status);
                        throw 'Issues';
                    }

                })
                .then((responseJson) => {
                    console.log("LOOOK HERE ");
                    this.setState({
                        isLoading: false,
                        data: responseJson
                    });
                })
                .catch((error) => {
                    throw error;
                });
        })
    }



    render() {
        if (this.state.isLoading) {
            return (<Text> Loading </Text>)
        } else {
            console.log(this.state.data);
            console.log(this.state.data.email);
            console.log(this.state.data.first_name);

            return (
                <View>
                    <Text> first name: {this.state.data.first_name}</Text>
                    <Text> last name: {this.state.data.last_name}</Text>
                    <Text> email: {this.state.data.email}</Text>
                    <FlatList
                        data={this.state.data.reviews}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10 }}>

                                <Text> Reviews: </Text>
                                <Text> Review id : {item.review.review_id}</Text>
                                <Text> Overall Rating: {item.review.overall_rating}</Text>
                                <Text> Review : {item.review.review_body}</Text>
                                <Text> Likes : {item.review.likes}</Text>
                                <Text> Location name : {item.location.location_name}</Text>
                                <Text> Location Town : {item.location.location_town}</Text>

                            </View>
                        )}
                    />

                    <FlatList
                        data={this.state.data.favourite_locations}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10 }}>
                                <Text> Location id : {item.location_id}</Text>
                                <Text> Location name : {item.location_name}</Text>
                                <Text> Location town : {item.location_town}</Text>
                                <Text> Overall Rating: {item.favourite_locations.overall_rating}</Text>
                            </View>
                        )}

                    />
                </View>



            );
        }
    }
}

//<Text> ID: {parseInt(item.user_id)} </Text>
//<Text> {item.first_name}</Text>