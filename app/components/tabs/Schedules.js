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
import PTRView from 'react-native-pull-to-refresh'
import { url } from '../../../config'

export default class Schedules extends Component {
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
        let data = await AsyncStorage.getItem('schedules')
        this.setState({
          data: data ? { table: this._getTable(JSON.parse(data)) } : null,
          loading: false
        })
      } else {
        fetch(url + '/schedules', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: await AsyncStorage.getItem('id')
        })
          .then(res => res.json())
          .then(async res => {
            if (this.state.mounted) {
              this.setState({
                data: { table: this._getTable(res.data) },
                loading: false
              })
              AsyncStorage.setItem('schedules', JSON.stringify(res.data))
            }
            resolve()
          })
          .catch(err => {
            alert(err)
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
              Cannot connect to server.
            </Text>
          </View>
        </PTRView>
      )
    } else {
      return (
        <PTRView onRefresh={() => this._getData()}>
          <ScrollView>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row
                data={[
                  'Subject Code',
                  'Section',
                  'Units',
                  'Days',
                  'Time',
                  'Room',
                  'Faculty'
                ]}
                textStyle={{ textAlign: 'center' }}
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
    padding: 40
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20
  }
})
