import React, { Component } from 'react';
import { View, TextInput, Text, Button, Alert, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera'

class GetCameraReview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            review_id: 0,
            location_id: 0,
            location: null,
            isLoading: true,
            location: {},
            AuthCode: "",
            data: null
        }
    }

    getAuthCode = async () => {

        let value = (await AsyncStorage.getItem('@session_token')).replace(/"/g, "");

        return value;
    }

    componentDidMount() {
        this.DeleteCameraReview();
    }

    DeleteCameraReview = async () => {
        let { review_id } = this.props.route.params;
        this.state.review_id = review_id;
        let { location_id } = this.props.route.params;
        this.state.location_id = location_id;
        this.getAuthCode().then((authCode) => {
            fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/photo", {
                method: 'DELETE',
                headers: {
                    'X-Authorization': authCode
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        Alert.alert("Deleted Photo Review");
                    } else {
                        Alert.alert("No photo to be deleted");
                    }

                })
        })
    }

    render() {
        return (
            <View style={{ flex: 1, width: '100%' }}>

            </View>
        )
    }
}

export default GetCameraReview;