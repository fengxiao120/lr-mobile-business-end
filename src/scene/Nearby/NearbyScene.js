import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ListView, Image } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, Button, NavigationItem, RefreshListView, RefreshState, SpacingView } from '../../widget'
import { screen, system, tool } from '../../common'
import api from '../../api'
import NearbyListScene from './NearbyListScene'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// create a component
class NearbyScene extends PureComponent {

    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params ? navigation.state.params.headerTitle : null,
        headerRight: (
            <NavigationItem
                icon={'bell'}
                color={'white'}
                size={20}
                style={{ alignSelf: 'center', marginRight: screen.width / 18 }}
                onPress={() => {
                    navigation.navigate('Notification')
                }}
            />
        ),
        headerLeft: (
            <Text style={{ color: 'white', fontSize: 18, paddingLeft: screen.width / 18 }}>SG</Text>
        ),
        headerStyle: {
            shadowOpacity: 0,
            elevation: 0,
            borderBottomColor: color.theme,
            backgroundColor: color.theme
        }
    })

    componentDidMount() {
        this.props.navigation.setParams({
            headerTitle: (
                <TouchableOpacity style={styles.searchBar}>
                    <Image source={require('../../img/Home/search_icon.png')} style={styles.searchIcon} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                        <TextInput
                            ref={input => { this.textInput = input }}
                            onChangeText={(text) => {
                                this.setState({
                                    keyword: text
                                })
                            }}
                            onSubmitEditing={() => {
                                this.props.navigation.navigate("List", { keyword: this.state.keyword })
                            }
                            }
                            style={{ fontSize: 14, flex: 1, height: 40 }} placeholder='Search for shop name or area' underlineColorAndroid="transparent"></TextInput>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                keyword: ""
                            })
                            this.textInput.clear()
                        }}>
                            <Text
                                style={{ fontSize: 15, backgroundColor: "rgba(0,0,0,0)", paddingRight: 10 }} >
                                <FontAwesome name={'times-circle'} color={'#CCCCCC'} size={16} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    render() {
        let titles = ['Food', 'Leisure', 'Beauty', 'Fitness']

        return (
            <ScrollableTabView
                style={styles.container}
                tabBarBackgroundColor='white'
                tabBarActiveTextColor='#0abab5'
                tabBarInactiveTextColor='#555555'
                tabBarTextStyle={styles.tabBarText}
                tabBarUnderlineStyle={styles.tabBarUnderline}
            >
                {titles.map((title, i) => (
                    <NearbyListScene
                        tabLabel={titles[i]}
                        key={i}
                        navigation={this.props.navigation} />
                ))}
            </ScrollableTabView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background
    },
    searchBar: {
        width: screen.width * 0.7,
        height: 30,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 3,
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 5,
        width: 14,
        height: 14,
    },
    tabBarText: {
        fontSize: 14,
        marginTop: 13,
    },
    tabBarUnderline: {
        backgroundColor: '#0abab5'
    },
});

//make this component available to the app
export default NearbyScene;
