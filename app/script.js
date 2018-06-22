import React, { Component } from 'react'
import { AsyncStorage, Alert } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import fetch from 'react-native-fetch-polyfill'
import { backendURL } from '../app'

var script = {}
var sessionExpiredExecuted = false

script.sessionExpired = navigation => {
  return new Promise(async resolve => {
    if (!sessionExpiredExecuted) {
      await script.destroy()
      Alert.alert(
        'Error!',
        'Session has expired. Please login again.',
        [
          {
            text: 'OK',
            onPress: () => {
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
          }
        ],
        { cancelable: false }
      )
      sessionExpiredExecuted = true
      setTimeout(() => {
        sessionExpiredExecuted = false
      }, 3000)
    }
  })
}

script.destroy = () => {
  return new Promise(async resolve => {
    let [data] = await Promise.all([
      AsyncStorage.getItem('id'),
      AsyncStorage.clear()
    ])
    if (data) {
      await fetch(backendURL + '/destroy/' + data, {
        method: 'POST',
        timeout: 5000
      })
    }
    resolve()
  })
}

script.getData = params => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await (await fetch(backendURL + '/' + params, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        body: JSON.stringify({ id: await AsyncStorage.getItem('id') })
      })).json()
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = script
