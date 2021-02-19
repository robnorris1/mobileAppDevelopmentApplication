import 'react-native-gesture-handler';

import React, { Component } from'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './components/LoginScreen';
import Search from './components/Search';
import CreateUser from './components/createUser';
import Login from './components/Login';
import Logout from './components/Logout';
import Profile from './components/Profile';
import Camera from './components/Camera';

const Tab = createBottomTabNavigator();

class App extends Component{
  
  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'LoginScreen') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Search') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Camera'){
                iconName = focused ? 'send' : 'send-outline';
              } else if (route.name === 'Profile'){
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
            <Tab.Screen name = "LoginScreen" component={LoginScreen} />
            <Tab.Screen name = "Search" component={Search} />
            <Tab.Screen name = "Camera" component={Camera} />
            <Tab.Screen name = "Profile" component={Profile} />
            <Tab.Screen name = "CreateUser" component={CreateUser} options={({route})=>({tabBarButton: () => null})} />
            <Tab.Screen name = "Login" component={Login} options={({route})=>({tabBarButton: () => null})} />
            <Tab.Screen name = "Logout" component={Logout} options={({route})=>({tabBarButton: () => null})} />
          </Tab.Navigator>
        </NavigationContainer>
    );
  }
}
export default App; 
