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
import { NavigationActions, StackActions } from 'react-navigation'
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
import script from '../../script'

export default class Grades extends Component {
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
      let data = await AsyncStorage.getItem('grades')
      this.setState({
        data: data ? { table: this._getTable(JSON.parse(data)) } : null,
        loading: false
      })
    } else {
      try {
        let res = await script.getData('grades')
        if (res.success === false) {
          script.sessionExpired(this.props.navigation)
        } else {
          this.setState({
            data: { table: this._getTable(res.data) },
            loading: false
          })
          await AsyncStorage.setItem('grades', JSON.stringify(res.data))
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
          textStyle={{ textAlign: 'center' }}
          style={{ backgroundColor: '#F7F6E7', minHeight: 40 }}
        />
        {body[headIndex].map((rowData, rowIndex) => (
          <Row
            key={rowIndex}
            data={rowData}
            flexArr={[1, 2, 1, 1]}
            textStyle={{
              textAlign: 'center',
              padding: 5
            }}
            style={{
              backgroundColor: rowIndex % 2 ? '#f4f4f4' : '#fff',
              minHeight: 40
            }}
          />
        ))}
      </TableWrapper>
    ))
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
                data={['SUBJECT CODE', 'DESCRIPTION', 'GRADE', 'UNITS']}
                flexArr={[1, 2, 1, 1]}
                textStyle={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
                style={{ backgroundColor: '#7CEBEB', minHeight: 40 }}
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
