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
  NetInfo
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
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

  async componentDidMount () {
    var [value, isConnected] = await Promise.all([
      AsyncStorage.getItem('id'),
      NetInfo.isConnected.fetch()
    ])
    if (value) {
      if (isConnected) {
        try {
          let json = await (await fetch(
            url + '/id/' + JSON.parse(value).id
          )).json()
          if (!json.success) return this.setState({ show: true })
        } catch (err) {
          // ignore no connection
        }
      }
      this.setState({ show: true }, () => {
        this._goToMain()
      })
    } else {
      this.setState({ show: true })
    }
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
    this.setState({ logging: true })
    let credentials = JSON.stringify({
      sn: this.state.sn,
      pass: this.state.pass
    })
    try {
      let res = await (await fetch(url + '/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: credentials
      })).json()
      if (res.success) {
        await AsyncStorage.setItem('id', JSON.stringify({ id: res.id }))
        this._clearFields()
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
      Alert.alert('Error!', "Couldn't connect to server." + err, [
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
    return this.state.show ? (
      <View style={styles.container}>
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
          onSubmitEditing={() => this._login()}
        />
        <TextInput
          ref={input => {
            this.passInput = input
          }}
          style={styles.input}
          placeholder='Access Code'
          onChangeText={pass => this.setState({ pass })}
          underlineColorAndroid='transparent'
          onSubmitEditing={() => this._login()}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this._login()}
          disabled={this.state.logging}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
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
