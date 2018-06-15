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
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from 'react-native-table-component'
import Expo from 'expo'
import PTRView from 'react-native-pull-to-refresh'
import { url } from '../../../config'
import script from '../../script'

export default class Schedules extends Component {
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
      let data = await AsyncStorage.getItem('schedules')
      this.setState({
        data: data ? { table: this._getTable(JSON.parse(data)) } : null,
        loading: false
      })
    } else {
      try {
        let res = await script.getData('schedules')
        if (res.success === false) {
          script.sessionExpired()
        } else {
          this.setState({
            data: { table: this._getTable(res.data) },
            loading: false
          })
          await AsyncStorage.setItem('schedules', JSON.stringify(res.data))
        }
      } catch (err) {
        this.setState({
          data: null,
          loading: false
        })
      }
    }
  }

  _getTable (data) {
    var body = []
    for (var i = 0; i < data.length; i++) {
      body.push(Object.values(data[i]))
    }
    return <Rows data={body} textStyle={{ textAlign: 'center' }} />
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
      return (
        <PTRView onRefresh={() => this._getData()}>
          <ScrollView
            contentContainerStyle={{
              marginTop: Expo.Constants.statusBarHeight
            }}
          >
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
              <Row
                data={[
                  'SUBJECT CODE',
                  'SECTION',
                  'DAYS',
                  'TIME',
                  'ROOM',
                  'FACULTY'
                ]}
                textStyle={{
                  textAlign: 'center',
                  padding: 5,
                  color: '#fff',
                  fontWeight: 'bold'
                }}
                style={{ backgroundColor: '#7CEBEB' }}
              />
              {data.table}
            </Table>
          </ScrollView>
        </PTRView>
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
  }
})
