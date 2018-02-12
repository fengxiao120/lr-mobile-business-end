import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ListView, Image, StatusBar } from 'react-native'
import { color, Button, NavigationItem, RefreshListView, RefreshState } from '../../widget'
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { screen, system, tool } from '../../common'
import shopApi from '../../api/shop'
import ShopCell from '../Shop/ShopCell'
import _ from 'lodash'
import { calcDistance } from '../../common/tool'

// create a component
class NearbyListScene extends PureComponent {

    listView: ListView

    state: {
        dataSource: ListView.DataSource,
        typeIndex: number
    }

    constructor(props: Object) {
        super(props)

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.state = {
            dataList: [],
            initialLoading: true,
            dataSource: ds.cloneWithRows([])
        }
    }

    componentDidMount() {
        this.listView.startHeaderRefreshing();
    }

    componentWillReceiveProps(props) {
        this.requestData()
    }


    async requestData() {
        if (!___location)
            return
        try {
            let json = await shopApi.nearby({ categoryName: this.props.tabLabel, coordinates: { X: ___location.coords.latitude, Y: ___location.coords.longitude } })
            let shops = json.data
            _.each(shops, (shop) => {
                shop.distance = calcDistance(shop.coordinateX, shop.coordinateY, true)
            })
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(shops), initialLoading: false
            })
            setTimeout(() => {
                this.listView.endRefreshing(RefreshState.NoMoreData)
            }, 500);
        } catch (error) {
            this.listView.endRefreshing(RefreshState.Failure)
        }
    }

    render() {
        return (
            <RefreshListView
                ref={(e) => this.listView = e}
                refreshing={this.state.initialLoading}
                dataSource={this.state.dataSource}
                renderRow={(shop) =>
                    <ShopCell
                        navigation={this.props.navigation}
                        shop={shop}
                    />
                }
                onHeaderRefresh={() => this.requestData()}
            />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default NearbyListScene;
