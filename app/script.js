import React, { Component } from 'react'
import { AsyncStorage, Alert } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { url } from '../config'

var script = {}

script.sessionExpired = () => {
  return new Promise(async resolve => {
    await script.destroy()
    Alert.alert('Error!', 'Session has expired. Please login again.', [
      {
        text: 'OK',
        onPress: () => {
          this.props.navigation.dispatch(
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
      }
    ])
  })
}

script.destroy = () => {
  return new Promise(async resolve => {
    let [data] = await Promise.all([
      AsyncStorage.getItem('id'),
      AsyncStorage.clear()
    ])
    if (data) await fetch(url + '/destroy/' + JSON.parse(data).id)
    resolve()
  })
}

script.getData = category => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await (await fetch(url + '/' + category, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: await AsyncStorage.getItem('id')
      })).json()
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = script
