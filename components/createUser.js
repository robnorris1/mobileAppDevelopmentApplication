import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    Alert
} from 'react-native';

export default class CreateUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }

    };

    addItem(){
        let to_send = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        };

        return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            Alert.alert("user created");
        })
        .catch((error) => {
            console.log(error);
        })

    }

    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text 
                    style={{fontSize: 27}}>
                    Create User
                </Text>
                <TextInput 
                placeholder='First Name...'
                onChangeText={(first_name) => this.setState({first_name})}
                value={this.state.first_name}
                />
                <TextInput placeholder='Last Name...'
                onChangeText={(last_name) => this.setState({last_name})}
                value={this.state.last_name}
                />
                <TextInput placeholder='Email...' 
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                />
                <TextInput placeholder='Password...' 
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                />
                <View style={{margin:7}} />
                <Button 
                        title="Submit"
                          onPress={() => { 
                            this.setState({
                                isLoading : true});
                            this.addItem(this.state.first_name, this.state.last_name, this.state.email, this.state.password).then(this.setState({isLoading:false}))
                        }}
                      />
                  </ScrollView>
            )
    }
}
