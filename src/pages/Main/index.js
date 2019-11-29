import React, { Component } from 'react'
import { Button } from 'react-native'
import { Container, Form, Input, SubmitButton, List, User, Avatar, Name, Bio } from './styles'
//import Icon from 'react-native-vector-icons/MaterialIcons'
import { Keyboard } from 'react-native'
import api from '../../services/api'
import AsyncStorage from '@react-native-community/async-storage'

export default class Main extends Component{

    state = {
        newUser: '',
        users: [],
    }

    async componentDidMount() {
        const users = await AsyncStorage.getItem('users')
        if(users){
            this.setState({users: JSON.parse(users)})
        }
    }

    componentDidUpdate(_, prevState){
        const { users } = this.state

        if(prevState.users != users){
            AsyncStorage.setItem('users', JSON.stringify(users))
        }
    }


    handleAddUser = async () => {
        const { users, newUser } = this.state

        const response = await api.get(`/users/${newUser}`)

        console.log(response.data)

        //melhorar isso daqui
        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url,
        }

        console.log(data)

        this.setState({
            users: [...users, data],
            newUser: '',
        })

        Keyboard.dismiss()
    }

    handleDelete = user =>{
        const { users } = this.state;
        users.splice(users.indexOf(user),1) //retira o user do array
        this.setState({ users: users })
        this.componentDidUpdate('', users) //n sei se é o correto a se fazer, porém deu certo hahaha, aqui tá atualizando o storage pra refletir as exclusões quando o app for aberto novamente
        //console.log(users)
    }

    render(){
        const { users, newUser } = this.state

        return (
            <Container>
                <Form>
                    <Input 
                       autoCorrect={false}
                       autoCaptalize="none"
                       placeholder="Adicionar usuário"
                       value={newUser}
                       onChangeText={text => this.setState({ newUser: text })}
                       returnKeyType='send'
                       onSubmitEditing={this.handleAddUser}
                    />
                    <Button title="+" onPress={this.handleAddUser}>
                       {/* <Icon name='add' size={20} color="#fff" /> */}
                    </Button>
                </Form>
                <List 
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({ item }) => (
                        <User>
                            <Avatar source={{ uri: item.avatar }}/>
                            <Name>{item.name}</Name>
                            <Bio>{item.bio}</Bio>
                            <Button title="Excluir" onPress={() => this.handleDelete(item)}></Button>
                            <Button title='Ver Perfil' onPress={() => {
                                this.props.navigation.navigate('User', { user: item })
                            }} />
                        </User>
                    )}
                />
            </Container>
         )
    }
}

Main.navigationOptions = {
    title: 'Usuários'
}