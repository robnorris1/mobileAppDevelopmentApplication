import React, { Component } from 'react';
import { View, TextInput, ActivityIndicator, Text, Button, TouchableOpacity, Alert, ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import Locations from './Locations';



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

    getAuthKey = async () => {
        return (await AsyncStorage.getItem('@session_token')).replace(/"/g, "");
    }

    getData = async (url) => {
        let value = (await this.getAuthKey());

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

    search = () => {
        let url = "http://10.0.2.2:3333/api/1.0.0/find?"

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

    favouriteALocation(location_id) {
        this.getAuthKey().then((value) => {

            fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': value
                }
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson.json();
                    } else {
                        throw 'Issues';
                    }
                })
                .then((responseJson) => {
                    this.setState({
                        isLoading: false,
                        location: responseJson
                    });
                })

                .catch((error) => {
                });

            Alert.alert("Favourite Location");
        });
    }

    UnfavouriteALocation(location_id) {
        this.getAuthKey().then((value) => {
            fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': value
                }
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson.json();
                    } else {
                        throw 'Issues';
                    }
                })
                .then((responseJson) => {
                    this.setState({
                        isLoading: false,
                        location: responseJson
                    });
                })

                .catch((error) => {
                });

            Alert.alert("Unfavourite Location");
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
                <ScrollView>
                    <View style= {{padding:20}}>
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Locations", { location_id: item.location_id })}>
                                <View style={{ padding: 10 }}>
                                    <Text> ID: {parseInt(item.location_id)} </Text>
                                    <Text> {item.location_name}</Text>
                                    <Text> Rating: {item.avg_overall_rating}</Text>
                                    <Button
                                        title="Favourite a location"
                                        onPress={() => this.favouriteALocation(item.location_id)}
                                    />

                                    <Button
                                        title="Unfavourite a location"
                                        onPress={() => this.UnfavouriteALocation(item.location_id)}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.location_id.toString()}
                    />
                    </View>
                </ScrollView>
            )
        }
    }
}

export default Search;