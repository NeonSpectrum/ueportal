import React, { Component } from 'react'
import { Text, AsyncStorage, Alert } from 'react-native'
import {
  createBottomTabNavigator,
  NavigationActions,
  StackActions
} from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import Spinner from 'react-native-loading-spinner-overlay'
import Home from './tabs/Home'
import Grades from './tabs/Grades'
import Schedules from './tabs/Schedules'
import Logout from './tabs/Logout'
import { url } from '../../config'

const Tabs = createBottomTabNavigator(
  {
    Home: { screen: Home },
    Grades: { screen: Grades },
    Schedules: { screen: Schedules },
    Logout: { screen: Logout }
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
    lazy: false
  }
)

export default Tabs
