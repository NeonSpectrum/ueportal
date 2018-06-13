import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ScrollView,
  Image
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
      fetch(url + '/schedules', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: await AsyncStorage.getItem('credentials')
      })
        .then(res => res.json())
        .then(res => {
          if (this.state.mounted) {
            var body = []
            for (var i = 0; i < res.data.length; i++) {
              body.push(Object.values(res.data[i]))
            }
            let table = <Rows data={body} textStyle={{ textAlign: 'center' }} />
            this.setState({
              data: { table },
              loading: false
            })
          }
          resolve()
        })
        .catch(err => {
          if (this.state.mounted) {
            this.setState({ data: err, loading: false })
          }
          reject()
        })
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
              Cannot connect to server.
            </Text>
          </View>
        </PTRView>
      )
    } else {
      return (
        <ScrollView>
          <PTRView onRefresh={() => this._getData()}>
            <View style={styles.container} />
          </PTRView>
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
