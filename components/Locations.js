import React, { Component } from 'react';
import { View, TextInput, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

import Review from './Review';


class Locations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            locationId: 0,
            location: null,
            isLoading: true,
            location: {},
            AuthCode: ""
        }
    }

    checkLocationId() {
        let { location_id } = this.props.route.params;
        console.log("checking location : " + location_id);
        if (location_id != this.state.location_id) {
            this.setState({ locationId: location_id })
            this.getData();
        }
    }

    getAuthCode = async () => {

        this.state.AuthCode = (await AsyncStorage.getItem('@session_token')).replace(/"/g, "");
    }

    componentDidMount() {
        this.idChange = this.props.navigation.addListener('focus',() => {
            this.checkLocationId();
        })
        this.getData();
    }

    getData(){
        this.setState({ isLoading: true });
        console.log("Im here!!!!!!!")
        let { location_id } = this.props.route.params;
        this.state.locationId = location_id;
        this.getAuthCode();
        console.log("location id: " + location_id);
        fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.AuthCode
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
    }





    render() {
        if (this.state.isLoading) {
            return (<Text> Loading </Text>)
        } else {
            return (
                <View style={{ padding: 10 }}>
                    <Text> ID: {this.state.locationId} </Text>
                    <Text> Location Name: {this.state.location.location_name} </Text>
                    <Text> Location Town: {this.state.location.location_town} </Text>
                    <Text> Average Overall Rating: {this.state.location.avg_overall_rating} </Text>
                    <Text> Average Price Rating: {this.state.location.avg_price_rating} </Text>
                    <Text> Average Quality Rating: {this.state.location.avg_quality_rating} </Text>
                    <Text> Average Clenliness Rating: {this.state.location.avg_clenliness_rating} </Text>
                    <Text> Location Reviews: </Text>
             
                         <FlatList
                        data={this.state.location.location_reviews}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10 }}>

                                <Text> Review id : {item.review_id}</Text>
                                <Text> Overall Rating: {item.overall_rating}</Text>
                                <Text> Price Rating: {item.price_rating}</Text>
                                <Text> Quality Rating: {item.quality_rating}</Text>
                                <Text> Clenliness Rating: {item.clenliness_rating}</Text>
                                <Text> Review : {item.review_body}</Text>
                                <Text> Likes : {item.likes}</Text>
                               
                            </View>
                        )}
                    />

                    <Button
                        title="Add Review"
                        onPress={() => this.props.navigation.navigate('Review', { location_id: this.state.location_id })}

                    />

                </View>
            );
        }
    }
}


export default Locations;