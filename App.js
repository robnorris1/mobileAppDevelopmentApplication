import 'react-native-gesture-handler';

import React, { Component } from'react';
import {NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './components/home';
import About from './components/about';
import Contact from './components/contact';
import CreateUser from './components/createUser';

const Tab = createBottomTabNavigator();

class App extends Component{
  
  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'About') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Contact'){
                iconName = focused ? 'send' : 'send-outline';
              } 

              return <Ionicons name={iconName} size={size} color={color} />;
                
              },
            })}
            tabBarOptions={{
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            }}

          >
            <Tab.Screen name = "Home" component={Home} />
            <Tab.Screen name = "About" component={About} />
            <Tab.Screen name = "Contact" component={Contact} />
            <Tab.Screen name = "CreateUser" component={CreateUser} options={({route})=>({tabBarButton: () => null})} />
            
          </Tab.Navigator>
        </NavigationContainer>
    );
  }
}

export default App; 
