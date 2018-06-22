import React, { Component } from 'react'
import Expo from 'expo'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Image
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { MessageBarManager } from 'react-native-message-bar'
import fetch from 'react-native-fetch-polyfill'
import Spinner from 'react-native-loading-spinner-overlay'
import { backendURL, expo } from '../../app'

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sn: '',
      pass: '',
      logging: false,
      show: false
    }
  }

  async componentDidMount () {
    let data = await AsyncStorage.getItem('id')
    this.setState({ show: true }, () => {
      if (data) this._goToMain()
    })
  }

  _clearFields () {
    this.snInput.clear()
    this.passInput.clear()
  }

  _goToMain () {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Main'
          })
        ]
      })
    )
  }

  async _login () {
    let { sn, pass } = this.state
    if (!sn || !pass) return Alert.alert('Error!', 'Please fill up all fields.')
    this.setState({ logging: true })
    try {
      let res = await (await fetch(backendURL + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        body: JSON.stringify({ sn, pass })
      })).json()
      if (res.success) {
        await AsyncStorage.setItem('id', res.id)
        this.setState({ logging: false }, () => {
          this._goToMain()
        })
      } else {
        this.setState({ logging: false })
        Alert.alert(
          'Login failed!',
          'Invalid Student Number and/or Access Code'
        )
      }
    } catch (err) {
      Alert.alert('Error!', "Couldn't connect to server.", [
        {
          text: 'Retry',
          onPress: () => this._login()
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ])
      this.setState({ logging: false })
    }
  }

  render () {
    let channel
    if (!Expo.Constants.manifest.releaseChannel) channel = 'Dev'
    else if (Expo.Constants.manifest.releaseChannel == 'beta') channel = 'Beta'
    else channel = 'Official'

    return this.state.show ? (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <Spinner
          visible={this.state.logging}
          overlayColor='rgb(217,30,24)'
          textContent={'Logging in...'}
          textStyle={{ color: '#FFF' }}
          animation={'fade'}
        />
        <Image source={require('../images/logo.png')} style={styles.logo} />
        <TextInput
          ref={input => {
            this.snInput = input
          }}
          style={styles.input}
          placeholder='Student Number'
          onChangeText={sn => this.setState({ sn })}
          underlineColorAndroid='transparent'
          keyboardType='numeric'
          maxLength={11}
          returnKeyType='next'
          selectTextOnFocus
          clearButtonMode='while-editing'
          onSubmitEditing={() => this.passInput.focus()}
        />
        <TextInput
          ref={input => {
            this.passInput = input
          }}
          style={styles.input}
          placeholder='Access Code'
          onChangeText={pass => this.setState({ pass })}
          underlineColorAndroid='transparent'
          selectTextOnFocus
          clearButtonMode='while-editing'
          secureTextEntry
          onSubmitEditing={() => this._login()}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this._login()}
          disabled={this.state.logging}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text
          style={{
            position: 'absolute',
            bottom: 5,
            textAlign: 'center',
            color: '#fff'
          }}
          onPress={() => this._checkForUpdates()}
        >
          {channel} Build v{expo.version}
        </Text>
      </KeyboardAvoidingView>
    ) : (
      <Spinner
        visible={true}
        overlayColor='rgb(217,30,24)'
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
        animation={'fade'}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D91E18',
    paddingLeft: 40,
    paddingRight: 40
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 60,
    marginTop: -40
  },
  input: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#F03434',
    padding: 20,
    alignItems: 'center',
    elevation: 1
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'
  }
})
