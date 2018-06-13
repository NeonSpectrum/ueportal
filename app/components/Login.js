import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Image,
  ToastAndroid
} from 'react-native'
import { url } from '../../config'

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

  componentWillMount () {
    this._loadInitialState().done()
  }

  async _loadInitialState () {
    var value = await AsyncStorage.getItem('id')
    if (value) {
      var json = await (await fetch(url + '/id/' + JSON.parse(value).id)).json()
      if (json.success) this.props.navigation.navigate('Main')
    }
    this.setState({ show: true })
  }

  clearFields () {
    this.snInput.clear()
    this.passInput.clear()
  }

  login () {
    this.setState({ logging: true })
    let credentials = JSON.stringify({
      sn: this.state.sn,
      pass: this.state.pass
    })
    fetch(url + '/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: credentials
    })
      .then(res => res.json())
      .then(async res => {
        if (res.success) {
          await AsyncStorage.setItem('id', JSON.stringify({ id: res.id }))
          this.clearFields()
          Alert.alert(
            'Login Successfully!',
            'You will now redirect to student information.',
            [
              {
                text: 'OK',
                onPress: () => this.props.navigation.navigate('Main')
              }
            ]
          )
        } else {
          Alert.alert(
            'Login failed!',
            'Invalid Student Number and/or Access Code'
          )
        }
        this.setState({ logging: false })
      })
      .catch(err => {
        Alert.alert('Error!', "Couldn't connect to server.", [
          {
            text: 'Retry',
            onPress: () => this.login()
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ])
        this.setState({ logging: false })
      })
  }

  render () {
    return this.state.show ? (
      <View style={styles.container}>
        <Image source={require('../images/logo.png')} style={styles.logo} />
        <TextInput
          ref={input => {
            this.snInput = input
          }}
          style={styles.input}
          placeholder='Student Number'
          onChangeText={sn => this.setState({ sn })}
          underlineColorAndroid='transparent'
        />
        <TextInput
          ref={input => {
            this.passInput = input
          }}
          style={styles.input}
          placeholder='Access Code'
          onChangeText={pass => this.setState({ pass })}
          underlineColorAndroid='transparent'
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.login()}
          disabled={this.state.logging}
        >
          <Text style={styles.buttonText}>
            {this.state.logging ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    ) : null
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
    marginBottom: 60
  },
  input: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 18
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
