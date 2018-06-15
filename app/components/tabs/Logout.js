import React, { Component } from 'react'
import { AsyncStorage, Alert } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import script from '../../script'

export default class Logout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
    this.loading = this.loading.bind(this)
  }

  componentDidMount () {
    this.props.navigation.setParams({
      loading: this.loading
    })
  }

  loading (x) {
    this.setState({ show: x })
  }

  static navigationOptions = ({ navigation }) => ({
    tabBarOnPress: (scene, jumpToIndex) => {
      const { params = {} } = navigation.state
      Alert.alert('Logout', 'Are you sure do you want to logout?', [
        {
          text: 'OK',
          onPress: async () => {
            params.loading(true)
            await script.destroy()
            params.loading(false)
            navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'Login'
                  })
                ]
              })
            )
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ])
    }
  })

  render () {
    return this.state.show ? (
      <Spinner
        visible={true}
        overlayColor='rgb(217,30,24)'
        textContent={'Logging out...'}
        textStyle={{ color: '#FFF' }}
        animation={'fade'}
      />
    ) : null
  }
}
