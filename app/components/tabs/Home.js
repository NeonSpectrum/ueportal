import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ScrollView,
  Image,
  NetInfo
} from 'react-native'
import Expo from 'expo'
import PTRView from 'react-native-pull-to-refresh'
import { url } from '../../../config'
import script from '../../script'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      data: null
    }
  }

  async componentDidMount () {
    this._getData()
  }

  async _getData () {
    this.setState({ loading: true })
    let isConnected = await NetInfo.isConnected.fetch()
    if (!isConnected) {
      let data = await AsyncStorage.getItem('info')
      this.setState({
        data: data ? JSON.parse(data) : null,
        loading: false
      })
    } else {
      try {
        let res = await script.getData('info')
        if (res.success === false) {
          script.sessionExpired()
        } else {
          this.setState({ data: res.data, loading: false })
          await AsyncStorage.setItem('info', JSON.stringify(res.data))
        }
      } catch (err) {
        this.setState({
          data: null,
          loading: false
        })
      }
    }
  }

  render () {
    const { data, loading } = this.state
    if (loading) {
      return (
        <PTRView
          onRefresh={() => this._getData()}
          contentContainerStyle={styles.container}
        >
          <Image source={require('../../images/loading.gif')} />
        </PTRView>
      )
    } else if (!data) {
      return (
        <PTRView
          onRefresh={() => this._getData()}
          contentContainerStyle={styles.container}
        >
          <Image
            source={require('../../images/error.png')}
            style={styles.logo}
          />
          <Text style={{ fontSize: 36, textAlign: 'center' }}>
            Couldn't connect to server.
          </Text>
        </PTRView>
      )
    } else {
      let { url, logo, no, name, course, yearLevel, college, campus } = data
      return (
        <ScrollView>
          <PTRView
            onRefresh={() => this._getData()}
            contentContainerStyle={styles.container}
          >
            <Image source={{ uri: url }} style={styles.logo} />
            <Text style={styles.no}>{no}</Text>
            <Text style={styles.info}>
              <Text style={styles.bold}>Name</Text>:{` ${name}\n\n`}
              <Text style={styles.bold}>Course</Text>:{` ${course}\n\n`}
              <Text style={styles.bold}>Year Level</Text>:{` ${yearLevel}\n\n`}
              <Text style={styles.bold}>College</Text>:{` ${college}\n\n`}
              <Text style={styles.bold}>Campus</Text>:{` ${campus}`}
            </Text>
          </PTRView>
        </ScrollView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: Expo.Constants.statusBarHeight
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  no: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  info: {
    fontSize: 20
  },
  bold: {
    fontWeight: 'bold'
  }
})
