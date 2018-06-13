import React, { Component } from 'react'
import { Text, AsyncStorage, Alert } from 'react-native'
import { createBottomTabNavigator, TabBarBottom } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import Login from './tabs/Home'
import Home from './tabs/Home'
import Grades from './tabs/Grades'
import Schedules from './tabs/Schedules'

const Tabs = createBottomTabNavigator(
  {
    Home: { screen: Home },
    Grades: { screen: Grades },
    Schedules: { screen: Schedules },
    Logout: {
      screen: () => {
        return null
      },
      navigationOptions: ({ navigation }) => ({
        tabBarOnPress: (scene, jumpToIndex) => {
          Alert.alert('Logout', 'Are you sure do you want to logout?', [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.removeItem('credentials')
                navigation.navigate('Login')
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ])
        }
      })
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`
        } else if (routeName === 'Grades') {
          iconName = `ios-create${focused ? '' : '-outline'}`
        } else if (routeName === 'Schedules') {
          iconName = `ios-calendar${focused ? '' : '-outline'}`
        } else if (routeName === 'Logout') {
          iconName = `ios-exit${focused ? '' : '-outline'}`
        }
        return <Icon name={iconName} size={25} color={tintColor} />
      }
    }),
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'gray'
    },
    swipeEnabled: true
  }
)

export default Tabs
