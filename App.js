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
    this._checkForUpdates()
  }

  _messageBarAlert (params) {
    MessageBarManager.showAlert({
      shouldHideOnTap: false,
      messageStyle: { color: 'white', fontSize: 12, textAlign: 'center' },
      ...params
    })
  }

  async _checkForUpdates () {
    this._messageBarAlert({
      message: 'Checking for updates...',
      shouldHideAfterDelay: false
    })
    Expo.Updates.checkForUpdateAsync()
      .then(update => {
        if (update.isAvailable) {
          Alert.alert('New Update', 'An update is available. Download now?', [
            {
              text: 'Download',
              onPress: () => {
                Expo.Updates.fetchUpdateAsync({
                  eventListener: event => {
                    if (
                      event.type === Expo.Updates.EventType.DOWNLOAD_STARTED
                    ) {
                      this._messageBarAlert({
                        message: 'Downloading...',
                        shouldHideAfterDelay: false
                      })
                    } else if (
                      event.type === Expo.Updates.EventType.DOWNLOAD_FINISHED
                    ) {
                      MessageBarManager.hideAlert()
                      Alert.alert(
                        'Restart',
                        'Done installing the update. Restart now?',
                        [
                          {
                            text: 'Restart',
                            onPress: () => {
                              Expo.Updates.reloadFromCache()
                            }
                          },
                          {
                            text: 'Cancel',
                            style: 'cancel'
                          }
                        ]
                      )
                    }
                  }
                })
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ])
        } else {
          this._messageBarAlert({
            message: 'You are on the latest version.',
            alertType: 'success'
          })
        }
      })
      .catch(() => {
        this._messageBarAlert({
          message: 'There was an error checking for updates.',
          alertType: 'error'
        })
      })
  }
  render () {
    return [<Application key='1' />, <MessageBar ref='alert' key='2' />]
  }
}
