import React, { Component } from 'react'
import { AsyncStorage, Alert } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { backendURL } from '../app'

var script = {}

script.sessionExpired = navigation => {
  return new Promise(async resolve => {
    await script.destroy()
    const { sessionExpiredExecuted } = navigation.state.params
    if (!sessionExpiredExecuted) {
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
      navigation.setParams({ sessionExpiredExecuted: true })
    }
  })
}

script.destroy = () => {
  return new Promise(async resolve => {
    let [data] = await Promise.all([
      AsyncStorage.getItem('id'),
      AsyncStorage.clear()
    ])
    if (data) await fetch(backendURL + '/destroy/' + data, { timeout: 5000 })
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
        timeout: 5000,
        body: await AsyncStorage.getItem('id')
      })).json()
      resolve(res)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = script
