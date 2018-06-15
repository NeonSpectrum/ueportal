import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ScrollView,
  Image,
  NetInfo,
  Linking
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
import script from '../../script'

export default class Lectures extends Component {
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
      let data = await AsyncStorage.getItem('lectures')
      this.setState({
        data: data ? { table: this._getTable(JSON.parse(data)) } : null,
        loading: false
      })
    } else {
      try {
        let res = await script.getData('lectures')
        if (res.success === false) {
          script.sessionExpired(this.props.navigation)
        } else {
          this.setState({
            data: { table: this._getTable(res.data) },
            loading: false
          })
          await AsyncStorage.setItem('lectures', JSON.stringify(res.data))
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
    let body = []
    let header = Object.keys(data)[0]
    data[header].forEach(x => {
      body.push(Object.values(x))
    })
    let headerData = (
      <Row
        data={[header]}
        textStyle={{
          textAlign: 'center',
          color: '#fff',
          fontWeight: 'bold'
        }}
        style={{
          backgroundColor: '#7CEBEB',
          minHeight: 40
        }}
      />
    )
    let bodyData = body.map((headerContentData, index) => {
      let x = (
        <Row
          key={index}
          data={headerContentData.slice(0, headerContentData.length - 1)}
          flexArr={[1, 0.5, 0.5, 1.2, 1, 2]}
          textStyle={{
            textAlign: 'center',
            padding: 2
          }}
          style={{
            backgroundColor: '#F7F6E7',
            minHeight: 40
          }}
        />
      )
      let y = headerContentData[headerContentData.length - 1].map(
        (tableData, tableIndex) => {
          let { link } = tableData
          tableData.link = (
            <Text
              style={{
                color: 'blue',
                textAlign: 'center',
                padding: 2
              }}
              onPress={() => Linking.openURL(link)}
            >
              Download
            </Text>
          )
          return (
            <Row
              key={tableIndex}
              data={Object.values(tableData)}
              flexArr={[1, 2, 1]}
              textStyle={{
                textAlign: 'center',
                padding: 2
              }}
              style={{
                backgroundColor: tableIndex % 2 ? '#f4f4f4' : '#fff',
                minHeight: 40
              }}
            />
          )
        }
      )
      return (
        <TableWrapper key={index}>
          {x}
          {y}
        </TableWrapper>
      )
    })
    return (
      <TableWrapper>
        {headerData}
        {bodyData}
      </TableWrapper>
    )
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
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>{data.table}</Table>
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
