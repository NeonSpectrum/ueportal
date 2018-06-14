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
import PTRView from 'react-native-pull-to-refresh'
import { url } from '../../../config'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      mounted: true,
      data: null
    }
  }

  async componentDidMount () {
    this.setState({ mounted: true })
    this._getData()
  }

  componentWillUnmount () {
    this.setState({ mounted: false })
  }

  _getData () {
    return new Promise(async (resolve, reject) => {
      this.setState({ loading: true })
      let isConnected = await NetInfo.isConnected.fetch()
      if (!isConnected) {
        let data = await AsyncStorage.getItem('info')
        this.setState({
          data: data ? JSON.parse(data) : null,
          loading: false
        })
      } else {
        fetch(url + '/info', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: await AsyncStorage.getItem('id')
        })
          .then(res => res.json())
          .then(res => {
            if (this.state.mounted) {
              this.setState({ data: res.data, loading: false })
              AsyncStorage.setItem('info', JSON.stringify(res.data))
            }
            resolve()
          })
          .catch(err => {
            if (this.state.mounted) {
              this.setState({
                data: null,
                loading: false
              })
            }
            reject()
          })
      }
    })
  }

  render () {
    const { data, loading } = this.state
    if (loading) {
      return (
        <View style={styles.container}>
          <Image source={require('../../images/loading.gif')} />
        </View>
      )
    } else if (!data) {
      return (
        <PTRView onRefresh={() => this._getData()}>
          <View style={styles.container}>
            <Image
              source={require('../../images/error.png')}
              style={styles.logo}
            />
            <Text style={{ fontSize: 36, textAlign: 'center' }}>
              Couldn't connect to server.
            </Text>
          </View>
        </PTRView>
      )
    } else {
      return (
        <ScrollView>
          <PTRView onRefresh={() => this._getData()}>
            <View style={styles.container}>
              <Image source={{ uri: data.url }} style={styles.logo} />
              <Text style={styles.no}>{data.no}</Text>
              <Text style={styles.info}>
                <Text style={styles.bold}>Name</Text>:{` ${data.name}\n\n`}
                <Text style={styles.bold}>Course</Text>:{` ${data.course}\n\n`}
                <Text style={styles.bold}>Year Level</Text>:{` ${
                  data.yearLevel
                }\n\n`}
                <Text style={styles.bold}>College</Text>:{` ${
                  data.college
                }\n\n`}
                <Text style={styles.bold}>Campus</Text>:{` ${data.campus}`}
              </Text>
            </View>
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
    padding: 40
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
