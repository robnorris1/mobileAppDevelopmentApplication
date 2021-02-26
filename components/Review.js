import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default class Review extends Component {
    constructor(props) {
        super(props);

        this.sendReview = this.sendReview.bind(this);

        this.state = {
            AuthCode: "",
            overall_rating: null,
            price_rating: null,
            quality_rating: null,
            clenliness_rating: null,
            review_body: "",
            location_id: 0           
        }

    }

    async sendReview(overall_rating, price_rating, quality_rating, clenliness_rating, review_body) {
        let review = {"overall_rating" : parseInt(overall_rating,10) , "price_rating" : parseInt(price_rating,10),"quality_rating" : parseInt(quality_rating,10),"clenliness_rating" : parseInt(clenliness_rating,10),"review_body" : review_body};
        let {location_id} = this.props.route.params;
        this.state.location_id = location_id;

        let value = (await AsyncStorage.getItem('@session_token')).replace(/"/g,"");

        fetch ("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
            body: JSON.stringify(review)
        })
        
            
            .then((response) => {
                console.log("REQUEST HERE!!!!!!! : " + JSON.stringify(review));
                console.log(response.status);
                if (response.status === 201) {
                    return response;
                } else if (response.status === 400) {
                    throw "bad request";
                } else {
                    throw "something went wrong";
                }
            })
            .then((response) => {
                Alert.alert("Review Sent");
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <View>
                <TextInput placeholder="overall rating..." onChangeText={(overall_rating) => this.setState({ overall_rating })} value={this.state.overall_rating} />
                <TextInput placeholder="price rating..." onChangeText={(price_rating) => this.setState({ price_rating })} value={this.state.price_rating} />
                <TextInput placeholder="quality rating..." onChangeText={(quality_rating) => this.setState({ quality_rating })} value={this.state.quality_rating} />
                <TextInput placeholder="clenliness rating..." onChangeText={(clenliness_rating) => this.setState({ clenliness_rating })} value={this.state.clenliness_rating} />
                <TextInput placeholder="review..." onChangeText={(review_body) => this.setState({ review_body })} value={this.state.review_body} />
                <View style={{ margin: 7 }} />
                    <Button
                        title="Submit"
                        onPress={() => {
                            this.setState({
                                isLoading: true
                            });
                            this.sendReview(this.state.overall_rating, this.state.price_rating, this.state.quality_rating, this.state.clenliness_rating, this.state.review_body).then(this.setState({ isLoading: false }))
                        }}
                    />
            </View>
        );
    }

}