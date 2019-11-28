import React from 'react'
import { WebView } from 'react-native-webview'

const User = ({ navigation }) => (
   <WebView source={{ uri: `https://github.com/${navigation.state.params.user.login}` }} />
)


User.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.user.name
})

export default User