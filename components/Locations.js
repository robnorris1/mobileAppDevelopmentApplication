import React, { Component } from 'react';
import { View, TextInput, Text, Button, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

import Review from './Review';
import Camera from './Camera';
import GetCameraReview from './GetCameraReview';


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
        if (location_id != this.state.location_id) {
            this.setState({ locationId: location_id })
            this.getData();
        }
    }

    getAuthCode = async () => {

        let value = (await AsyncStorage.getItem('@session_token')).replace(/"/g, "");

        return value;
    }

    componentDidMount() {
        this.idChange = this.props.navigation.addListener('focus', () => {
            this.checkLocationId();
        })
        this.getData();
    }

    getData() {
        this.setState({ isLoading: true });
        let { location_id } = this.props.route.params;
        this.state.locationId = location_id;
        this.getAuthCode().then((authCode) => {
            fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': authCode
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
        })
    }

    likeAReview(review_id) {
        let { location_id } = this.props.route.params;
        this.state.locationId = location_id;
        this.getAuthCode().then((authCode) => {
            fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/like", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': authCode
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

            Alert.alert("Liked Review");

        })
    }

    UnlikeAReview(review_id) {
        let { location_id } = this.props.route.params;
        this.state.locationId = location_id;
        this.getAuthCode().then((authCode) => {
        fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/like", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authCode
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

        Alert.alert("Unliked Review");

    })
}

    DeleteAReview(review_id) {
        let { location_id } = this.props.route.params;
        this.state.locationId = location_id;
        this.getAuthCode().then((authCode) => {
        fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authCode
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

        Alert.alert("Deleted Review");

    })
    }

    render() {
        if (this.state.isLoading) {
            return (<Text> Loading </Text>)
        } else {
            return (
                <View style={{ padding: 10, paddingBottom: 200 }}>
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
                            <ScrollView>
                                <View style={{ padding: 10 }}>
                                    <Text> Review id : {item.review_id}</Text>
                                    <Text> Overall Rating: {item.overall_rating}</Text>
                                    <Text> Price Rating: {item.price_rating}</Text>
                                    <Text> Quality Rating: {item.quality_rating}</Text>
                                    <Text> Clenliness Rating: {item.clenliness_rating}</Text>
                                    <Text> Review : {item.review_body}</Text>
                                    <Text> Likes : {item.likes}</Text>

                                    <Button
                                        title="Delete Review"
                                        onPress={() => this.DeleteAReview(item.review_id)}
                                    />
                                    <Button
                                        title="Like A Review"
                                        onPress={() => this.likeAReview(item.review_id)}
                                    />
                                    <Button
                                        title="Unlike A Review"
                                        onPress={() => this.UnlikeAReview(item.review_id)}
                                    />

                                    <Button
                                        title="Add Photo Review"
                                        onPress={() => this.props.navigation.navigate('Camera', { review_id: item.review_id, location_id: this.state.locationId })}
                                    />

                                    <Button
                                        title="Get Photo Review"
                                        onPress={() => this.props.navigation.navigate('GetCameraReview', { review_id: item.review_id, location_id: this.state.locationId })}
                                    />

                                    <Button
                                        title="Delete A Photo Review"
                                        onPress={() => this.props.navigation.navigate('DeleteCameraReview', { review_id: item.review_id, location_id: this.state.locationId })}
                                    />

                                </View>
                            </ScrollView>
                        )}
                    />
                    <Button
                        title="Add Review"
                        onPress={() => this.props.navigation.navigate('Review', { location_id: this.state.locationId })}
                    />
                </View>
            );
        }
    }
}
export default Locations;