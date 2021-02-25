import React, { Component } from 'react';
import { View, TextInput, ActivityIndicator, Text, Button,  TouchableOpacity} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { Rating, AirbnbRating } from 'react-native-ratings';

import Locations from './Locations';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            locations: null,
            q: '',
            overall_rating: 0
        }
    }

    componentDidMount() {
        this.getData("http://10.0.2.2:3333/api/1.0.0/find");
    }
    getData = async (url) => {
        let value = (await AsyncStorage.getItem('@session_token')).replace(/"/g,"");

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw 'Issues';
                }

            })
            .then((response) => {
                this.setState({
                    isLoading: false,
                    locations: response
                });
            })
            .catch((error) => {
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            )
        } else {
            return (
                <View>
                    <FlatList
                        data={this.state.locations}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Locations" , {location_id: item.location_id})}>
                            <View style={{ padding: 10 }}>
                                <Text> ID: {parseInt(item.location_id)} </Text>
                                <Text> {item.location_name}</Text>
                                <Text> Rating: {item.avg_overall_rating}</Text>
                            </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.location_id.toString()}
                    />
                </View>
            )
        }
    }
}

export default Home;