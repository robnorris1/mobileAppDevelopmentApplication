import React, { Component} from 'react';
import {View, TextInput, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Locations extends Component{

    constructor(props){
        super(props);

        this.state = {
            location_id: 0,
            location: null,
            isLoading: true,
            locations: [],
            AuthCode: ""
        }
    }

    getAuthCode = async () => {
        
        this.state.AuthCode = (await AsyncStorage.getItem('@session_token')).replace(/"/g,"");
    }

    componentDidMount(){
        let {location_id} = this.props.route.params;
        this.state.location_id = location_id;
        this.getAuthCode();
        console.log("location id: " + location_id);
        fetch ("http://10.0.2.2:3333/api/1.0.0/location/" + location_id, {
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
                locations: responseJson
            });
        })
        .catch((error) => {
        });
}



    render(){
        if(this.state.isLoading){
            return(<Text> Loading </Text>)
        }else{
        return(
            <View style={{ padding: 10 }}>
                <Text> ID: {this.state.location_id} </Text>
                <Text> Location Name: {this.state.locations.location_name} </Text>
                <Text> Location Town: {this.state.locations.location_town} </Text>
                <Text> Average Overall Rating: {this.state.locations.avg_overall_rating} </Text>
                <Text> Average Price Rating: {this.state.locations.avg_price_rating} </Text>
                <Text> Average Quality Rating: {this.state.locations.avg_quality_rating} </Text>
                <Text> Average Clenliness Rating: {this.state.locations.avg_clenliness_rating} </Text>
                <Text> Location Reviews: </Text>
                <Text> Review ID: {this.state.locations.location_reviews[0].review_id} </Text>
                <Text> Overall Rating: {this.state.locations.location_reviews[0].overall_rating} </Text>
                <Text> price_rating: {this.state.locations.location_reviews[0].price_rating} </Text>
                <Text> quality_rating: {this.state.locations.location_reviews[0].quality_rating} </Text>
                <Text> clenliness_rating: {this.state.locations.location_reviews[0].clenliness_rating} </Text>
                <Text> review_body: {this.state.locations.location_reviews[0].review_body} </Text>
                <Text> likes: {this.state.locations.location_reviews[0].likes} </Text>
                </View>
        );
    }
}
}


export default Locations;