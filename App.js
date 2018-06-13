import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import Login from './app/components/Login'
import Main from './app/components/Main'
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
])

const Application = createStackNavigator(
  {
    Login: { screen: Login },
    Main: { screen: Main }
  },
  {
    navigationOptions: {
      header: null
    }
  }
)
export default Application
