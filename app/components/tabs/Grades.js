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

export default class Grades extends Component {
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
        let data = await AsyncStorage.getItem('grades')
        this.setState({
          data: data ? { table: this._getTable(JSON.parse(data)) } : null,
          loading: false
        })
      } else {
        fetch(url + '/grades', {
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
              this.setState({
                data: { table: this._getTable(res.data) },
                loading: false
              })
              AsyncStorage.setItem('grades', JSON.stringify(res.data))
            }
            resolve()
          })
          .catch(() => {
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
    var head = Object.keys(data)
    var body = []
    for (var i = 0; i < head.length; i++) {
      body.push(data[head[i]].map(x => Object.values(x)))
    }
    return head.map((headData, headIndex) => (
      <TableWrapper key={headIndex}>
        <Row
          key={headIndex}
          data={[headData]}
          textStyle={{ textAlign: 'center', padding: 10 }}
        />
        {body[headIndex].map((rowData, rowIndex) => (
          <Row
            key={rowIndex}
            data={rowData}
            textStyle={{ textAlign: 'center' }}
          />
        ))}
      </TableWrapper>
    ))
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
        <PTRView onRefresh={() => this._getData()}>
          <ScrollView>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row
                data={['Subject Code', 'Subject Name', 'Grade', 'Units']}
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
