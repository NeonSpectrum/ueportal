import React, { Component } from 'react'
import Sentry from 'sentry-expo'
import { AsyncStorage } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { MessageBarManager, MessageBar } from 'react-native-message-bar'
import Login from './app/components/Login'
import Main from './app/components/Main'
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
])

Sentry.enableInExpoDevelopment = true

Sentry.config(
  'https://e04b9eada20d4f5187c663b035eec8a2@sentry.io/1228125'
).install()

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

export default class App extends Component {
  componentDidMount () {
    MessageBarManager.registerMessageBar(this.refs.alert)
  }
  render () {
    return [<Application key='1' />, <MessageBar ref='alert' key='2' />]
  }
}
