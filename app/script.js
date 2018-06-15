import React, { Component } from 'react'
import { AsyncStorage, Alert } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { backendURL } from '../app'

var script = {}

script.sessionExpired = navigation => {
  return new Promise(async resolve => {
    await script.destroy()
    Alert.alert('Error!', 'Session has expired. Please login again.', [
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
    ])
  })
}

script.destroy = () => {
  return new Promise(async resolve => {
    let [data] = await Promise.all([
      AsyncStorage.getItem('id'),
      AsyncStorage.clear()
    ])
    if (data) await fetch(backendURL + '/destroy/' + JSON.parse(data).id)
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
        body: await AsyncStorage.getItem('id')
      })).json()
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = script
