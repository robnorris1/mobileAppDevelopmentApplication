import React, { Component } from 'react';
import { View, TextInput, Text, Button, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera'

class Camera extends Component {

    constructor(props) {
        super(props);

        this.state = {
            review_id: 0,
            location_id: 0,
            location: null,
            isLoading: true,
            location: {},
            AuthCode: ""
        }
    }

    getAuthCode = async () => {

        let value = (await AsyncStorage.getItem('@session_token')).replace(/"/g, "");

        return value;
    }

    takePicture = async () => {
        const options = { quality: 0.5, base64: true }
        const data = await this.camera.takePictureAsync(options);
        let { review_id } = this.props.route.params;
        this.state.review_id = review_id;
        let { location_id } = this.props.route.params;
        this.state.location_id = location_id;
        this.getAuthCode().then((value) => {
            if (this.camera) {

                fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/photo", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'image/jpeg',
                        'X-Authorization': value
                    },
                    body: data
                })

                    .then((response) => {
                        if (response.status === 200) {
                            Alert.alert("Picture Added")
                            return response.json();
                        } else {
                            throw error;
                        }

                    })
                    .catch((error) => {
                    });
            }
        })
    }

    render() {
        return (
            <View style={{ flex: 1, width: '100%' }}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref
                    }}
                    style={{
                        flex: 1,
                        width: '100%'
                    }}
                />
                <Button title="Take Photo" onPress={() => { this.takePicture() }} />
            </View>
        )
    }
}

export default Camera;