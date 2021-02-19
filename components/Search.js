import React, { Component } from 'react';
import { View, TextInput, ActivityIndicator, Text, Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { Rating, AirbnbRating } from 'react-native-ratings';

class Search extends Component {

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
        
        console.log("value: " + value);
        console.log("url: " + url);
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            }
        })
            .then((response) => {
                console.log("first then");
                console.log(response);
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw 'Issues';
                }

            })
            .then((response) => {
                console.log("second then : " + response);
                this.setState({
                    isLoading: false,
                    locations: response
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    search = () => {
        let url = "http://10.0.2.2:3333/api/1.0.0/find?"

        console.log(this.state.q);
        console.log(this.state.overall_rating);

        if (this.state.q != '') {
            url += "q=" + this.state.q + "&";
        }
        if (this.state.q != '') {
            url += "overall_rating=" + this.state.overall_rating + "&";
        }

        this.getData(url);

    }

    ratingCompleted(rating, name) {
        let stateObject = () => {
            let returnObject = {};
            returnObject[name] = rating;
            return returnObject;
        };
        this.setState(stateObject);
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
                    <Text>Search </Text>
                    <TextInput
                        value={this.state.q}
                        onChangeText={(q) => this.setState({ q: q })}
                    />

                    <Text> Overall Rating </Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={0}
                        onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
                    />
                    <Button
                        title="Search"
                        onPress={() => { this.search() }}
                    />
                    <FlatList
                        data={this.state.locations}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10 }}>
                                <Text> ID: {item.location_id} </Text>
                                <Text> {item.location_name}</Text>
                                <Text> Rating: {item.avg_overall_rating}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.location_id.toString()}
                    />
                </View>
            )
        }
    }
}

export default Search;