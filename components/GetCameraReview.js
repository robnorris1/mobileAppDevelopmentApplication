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
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                data: null
            })
            this.getPhotoReview();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getPhotoReview = async () => {
        let { review_id } = this.props.route.params;
        this.state.review_id = review_id;
        let { location_id } = this.props.route.params;
        this.state.location_id = location_id;
        this.getAuthCode().then((authCode) => {
            return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/photo", {
                method: 'GET',
                headers: {
                    'Content-Type': 'image/jpeg',
                    'X-Authorization': authCode
                },
            })
                .then((result) => {
                    if (result.status === 200) {
                        this.setState({
                            data: result.url
                        })
                    } else {
                        this.setState({
                            data: null
                        })
                    }
                })
        })
    }



    render() {
        if (this.state.data === null) {
            return (
                <View>
                    <Text> Oops no photo found </Text>
                </View>
            )
        }
        return (
            <View style={{ flex: 1, width: '100%' }}>

                <Image
                    source={{
                        uri: this.state.data
                    }}
                    style={{ width: 400, height: 400 }}
                />




            </View>
        )
    }
}

export default GetCameraReview;