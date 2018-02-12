import React, { PureComponent } from 'react'
import { StatusBar } from 'react-native'
import { StackNavigator, TabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';

import color from './widget/color'
import { screen, system, tool } from './common'
import TabBarItem from './widget/TabBarItem'

import HomeScene from './scene/Home/HomeScene'
import NotificationScene from './scene/Home/NotificationScene'
import Wishlist from './scene/Wishlist/Wishlist'

import MeScene from './scene/Me/MeScene'

import WebScene from './widget/WebScene'

import ListScene from './scene/List/ListScene'
import ShopScene from './scene/Shop/ShopScene'
import ProductScene from './scene/Product/ProductScene'
import OfferScene from './scene/Offer/OfferScene'
import ReviewScene from './scene/Review/ReviewScene'
import WriteReviewScene from './scene/Review/WriteReviewScene'
import LoginScene from './scene/Auth/LoginScene'
import ResetPasswordScene from './scene/Auth/ResetPasswordScene'
import SignupScene from './scene/Auth/SignupScene'
import OpeningHoursScene from './scene/Shop/OpeningHoursScene'

import MyReviewsScene from './scene/Me/MyReviewsScene'
import RecentScene from './scene/Me/RecentScene'
import BusinessScene from './scene/Me/BusinessScene'
import AboutScene from './scene/Me/AboutScene'
import ContactScene from './scene/Me/ContactScene'
import RecommendScene from './scene/Me/RecommendScene'
import ProfileScene from './scene/Me/ProfileScene'
import SettingScene from './scene/Me/SettingScene'
import EditProfileScene from './scene/Me/EditProfileScene'
import EditProfileImageScene from './scene/Me/EditProfileImageScene'
import EditSettingScene from './scene/Me/EditSettingScene'

import Storage from './common/storage'

const lightContentScenes = ['Home', 'Nearby', 'Wishlist', 'Me']

function getCurrentRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

let loggedIn = false
// create a component
class RootScene extends PureComponent {
    constructor() {
        super()
        console.log('root scene is called again')
        this.state = {
            user: null,
        }
        // Storage.remove('user') //debug
        // Storage.remove('access_token') //debug
        StatusBar.setBarStyle('light-content')
    }

    componentWillMount = async () => {
        let user = await Storage.get('user')
        if (user) {
            loggedIn = true
            this.setState({ user: user })
        }
    }

    render() {
        console.log('root scene render is called ')
        return (<Navigator onNavigationStateChange={
            (prevState, currentState) => {
                const currentScene = getCurrentRouteName(currentState);
                const previousScene = getCurrentRouteName(prevState);
                if (previousScene !== currentScene) {
                    if (lightContentScenes.indexOf(currentScene) >= 0) {
                        StatusBar.setBarStyle('light-content')
                    } else {
                        StatusBar.setBarStyle('dark-content')
                    }
                }
            }
        }
            screenProps={{ user: this.state.user }}
        />
        );
    }
}

const Tab = TabNavigator({
    Home: {
        screen: HomeScene,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'My Shop',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabBarItem tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./img/tabbar/pfb_tabbar_homepage.png')}
                    selectedImage={require('./img/tabbar/pfb_tabbar_homepage_selected.png')}
                />
            )
        }),
    },

    Wishlist: {
        screen: Wishlist,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: async () => {
                if(__userStatusChanged){
                    __userStatusChanged = false
                    let loggedIn = await ___login(navigation, 'Me')
                    if (loggedIn) {
                        navigation.navigate('Wishlist', { date: new Date() })
                    }
                }
                else
                    navigation.navigate('Wishlist')
            },
            tabBarLabel: 'My Offers',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabBarItem tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./img/tabbar/pfb_tabbar_order.png')}
                    selectedImage={require('./img/tabbar/pfb_tabbar_order_selected.png')}
                />
            )
        }),
    },

    Me: {
        screen: MeScene,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: async () => {
                let loggedIn = await ___login(navigation, 'Me')
                if (loggedIn) {
                    navigation.navigate('Me', { date: new Date() })
                }
            },
            tabBarLabel: 'Account',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabBarItem tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./img/tabbar/pfb_tabbar_mine.png')}
                    selectedImage={require('./img/tabbar/pfb_tabbar_mine_selected.png')}
                />
            )
        }),
    },
}, {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        lazy: true,
        tabBarOptions: {
            activeTintColor: color.theme,
            inactiveTintColor: '#979797',
            style: { backgroundColor: '#ffffff' },
        },
    }

);

const Navigator = StackNavigator({
    Tab: { screen: Tab },
    Web: { screen: WebScene },
    List: { screen: ListScene },
    Shop: { screen: ShopScene },
    OpeningHours: { screen: OpeningHoursScene },
    Offer: { screen: OfferScene },
    Product: { screen: ProductScene },
    Review: { screen: ReviewScene },
    WriteReview: { screen: WriteReviewScene },
    Login: { screen: LoginScene },
    Signup: { screen: SignupScene },
    ResetPassword: { screen: ResetPasswordScene },
    MyReviews: { screen: MyReviewsScene },
    Recent: { screen: RecentScene },
    Business: { screen: BusinessScene },
    Contact: { screen: ContactScene },
    About: { screen: AboutScene },
    Recommend: { screen: RecommendScene },
    Profile: { screen: ProfileScene },
    Setting: { screen: SettingScene },
    EditProfile: { screen: EditProfileScene },
    EditProfileImage: { screen: EditProfileImageScene },
    EditSetting: { screen: EditSettingScene },
    Notification: { screen: NotificationScene },
}, {
        navigationOptions: {
            elevation: 0,
            shadowOpacity: 0,
            headerStyle: {
                shadowOpacity: 0,
                shadowColor: 'transparent',
                elevation: 0,
                borderBottomWidth: 0,
                backgroundColor: color.theme
            },
            headerBackTitle: null,
            headerTintColor: '#0abab5',
            headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'normal' },
            showIcon: true,
        },
    });

const navigateOnce = (getStateForAction) => (action, state) => {
    const { type, routeName } = action;
    let block = true
    if (state &&
        type === NavigationActions.NAVIGATE) {
        if (routeName == 'Shop' && state.routes[state.routes.length - 1].routeName == 'Shop')
            if (action.params.shop.id != state.routes[state.routes.length - 1].params.shop.id)
                block = false
    }
    return (
        state &&
        type === NavigationActions.NAVIGATE &&
        routeName === state.routes[state.routes.length - 1].routeName && block
    ) ? null : getStateForAction(action, state);
    // you might want to replace 'null' with 'state' if you're using redux (see co mments below)
};

Navigator.router.getStateForAction = navigateOnce(Navigator.router.getStateForAction);

//make this component available to the app
export default RootScene;