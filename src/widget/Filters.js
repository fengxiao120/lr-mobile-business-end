import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform, FlatList } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet'
import _ from 'lodash'
import { color, NavigationItem, SpacingView, LRSpinner } from '../widget'
const CANCEL_INDEX = 0
const options = ['Cancel', 'Take a photo', 'Choose from album']
const initState = {
    open: false,
    categoryOpen: false,
    areaOpen: false,
    rankingOpen: false,
    distanceOpen: false
}

export default class Filters extends Component {
    constructor() {
        super();
        this.state = {
            ...initState,
            rankingOptions: ['Score', 'Popularity', 'Most Reviewed', 'Price high to low', 'Price low to high'],
            distanceOptions: ['<1km', '<3km', '<5km', '<10km'],
            areaOptionsL1: [],
            areaOptionsL2: [],
            categoryOptionsL1: [],
            categoryOptionsL2: [],
            selectedCategoryL1: null,
            selectedAreaL1: null,
            selectedSub: null,
            selectedDistrict: null,
            selectedRanking: null,
            selectedDistance: null
        }
        this.open = this.open.bind(this)
    }
    open(item) {
        let state = {
            open: !this.state.open
        }
        if (this.state.open && !this.state[item + 'Open'])
            state = {
                open: true,
                categoryOpen: false,
                areaOpen: false,
                rankingOpen: false,
                distanceOpen: false
            }
        state[item + 'Open'] = !this.state[item + 'Open']
        this.setState(state)
    }
    renderPlainOption(data, attr) {
        return (<TouchableOpacity style={styles.option} onPress={
            () => {
                let state = { ...this.state, ...initState }
                state[attr] = data.item
                this.setState(state)
                this.props.callback(state)
            }
        }><Text style={{ color: "#868686" }}>{data.item}</Text></TouchableOpacity>)
    }
    renderAreaL1Option(data) {
        return (
            <TouchableOpacity onPress={() => {
                this.setState({
                    selectedAreaL1: data.item,
                    areaOptionsL2: this.props.districtOptions[data.item]
                })
            }} style={{ ...styles.option, backgroundColor: (this.state.selectedAreaL1 == data.item ? 'white' : color.background) }}>
                <Text style={{ color: "#868686" }}>{data.item}</Text>
            </TouchableOpacity>
        )
    }
    renderCategoryL1Option(data) {
        return (
            <TouchableOpacity onPress={() => {
                let subs = _.find(this.props.categories, (item) => { return item.name == data.item }).subs
                this.setState({
                    selectedCategoryL1: data.item,
                    categoryOptionsL2: subs
                })
            }} style={{ ...styles.option, backgroundColor: (this.state.selectedCategoryL1 == data.item ? 'white' : color.background) }}>
                <Text style={{ color: "#868686" }}>{data.item}</Text>
            </TouchableOpacity>
        )
    }
    renderDefaultOption(type) {
        switch (type) {
            case 'category':
                return (<TouchableOpacity style={styles.defaultOption} onPress={
                    () => {
                        let state = { ...this.state, ...initState, selectedCategoryL1: null, selectedSub: null }
                        this.setState(state)
                        this.props.callback(state)
                    }
                }><Text style={{ color: "#868686" }}>All Category</Text></TouchableOpacity>)
            case 'area':
                return (<TouchableOpacity style={styles.defaultOption} onPress={
                    () => {
                        let state = { ...this.state, ...initState, selectedAreaL1: null, selectedDistrict: null }
                        this.setState(state)
                        this.props.callback(state)
                    }
                }><Text style={{ color: "#868686" }}>All Area</Text></TouchableOpacity>)
            case 'ranking':
                return (<TouchableOpacity style={{ ...styles.defaultOption, backgroundColor: 'white' }} onPress={
                    () => {
                        let state = { ...this.state, ...initState, selectedRanking: null }
                        this.setState(state)
                        this.props.callback(state)
                    }
                }><Text style={{ color: "#868686" }}>Rank by default</Text></TouchableOpacity>)
            case 'distance':
                return (<TouchableOpacity style={{ ...styles.defaultOption, backgroundColor: 'white' }} onPress={
                    () => {
                        let state = { ...this.state, ...initState, selectedDistance: null }
                        this.setState(state)
                        this.props.callback(state)
                    }
                }><Text style={{ color: "#868686" }}>All Distance</Text></TouchableOpacity>)
        }
    }
    componentWillReceiveProps(nextProps) {
        let state = {}
        let hasUpdate = false
        if (!_.isEqual(this.props.districtOptions, nextProps.districtOptions)) {
            state.areaOptionsL1 = Object.keys(nextProps.districtOptions)
            let index = state.areaOptionsL1.indexOf('Popular')
            state.areaOptionsL1.splice(index, 1)
            state.areaOptionsL1.unshift("Popular")
            hasUpdate = true
        }
        if (!_.isEqual(this.props.categories, nextProps.categories)) {
            let selected = _.find(nextProps.categories, (item) => { return item.selected })
            state.categoryOptionsL1 = _.map(nextProps.categories, (item) => {
                return item && item.name
            })
            state.selectedCategoryL1 = selected && selected.name
            state.categoryOptionsL2 = selected && selected.subs
            state.selectedSub = selected && 'All'
            hasUpdate = true
        }
        if (hasUpdate)
            this.setState(state)
    }
    hide() {
        this.setState(initState)
    }
    getText(type) {
        switch (type) {
            case 'category':
                if (this.state.selectedSub) {
                    if (this.state.selectedSub == 'All')
                        return this.state.selectedCategoryL1
                    return this.state.selectedSub
                }
                return 'Category'
            case 'area':
                if (this.state.selectedDistrict) {
                    if (this.state.selectedDistrict == 'All')
                        return this.state.selectedAreaL1
                    return this.state.selectedDistrict
                }
                return 'Area'
            case 'ranking':
                switch (this.state.selectedRanking) {
                    // 'Score', 'Popularity', 'Most Reviewed', 'Price high to low', 'Price low to high'
                    case 'Score':
                        return 'Score';
                    case 'Popularity':
                        return 'Popularity';
                    case 'Most Reviewed':
                        return 'Reviews';
                    case 'Price high to low':
                        return 'Price';
                    case 'Price low to high':
                        return 'Price';
                    default:
                        return 'Ranking';
                }
            case 'distance':
                if (this.state.selectedDistance)
                    return this.state.selectedDistance
                return 'Distance'
        }
    }
    render() {
        return (
            <View style={{
                zIndex: 1, overflow: 'hidden', position: 'absolute', left: 0, width: '100%', height: (this.state.open ? 2000 : 50), backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }
            }>
                <View style={{ borderBottomWidth: 0.3, borderColor: "#AAA", height: 50, backgroundColor: 'white', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.touch} onPress={() => { this.open('category') }}>
                        <Text numberOfLines={1} style={styles.text}>{this.getText('category')} </Text><Text><FontAwesome name={this.state.categoryOpen ? 'caret-up' : 'caret-down'} color={'#868686'} size={15} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touch} onPress={() => { this.open('area') }}>
                        <Text numberOfLines={1} style={styles.text}>{this.getText('area')} </Text><Text><FontAwesome name={this.state.areaOpen ? 'caret-up' : 'caret-down'} color={'#868686'} size={15} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touch} onPress={() => { this.open('ranking') }}>
                        <Text numberOfLines={1} style={styles.text}>{this.getText('ranking')} </Text><Text><FontAwesome name={this.state.rankingOpen ? 'caret-up' : 'caret-down'} color={'#868686'} size={15} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touch} onPress={() => { this.open('distance') }}>
                        <Text numberOfLines={1} style={styles.text}>{this.getText('distance')} </Text><Text><FontAwesome name={this.state.distanceOpen ? 'caret-up' : 'caret-down'} color={'#868686'} size={15} /></Text>
                    </TouchableOpacity>
                </View>
                <View style={{ maxHeight: 500, width: '100%', overflow: 'hidden', backgroundColor: 'white' }}>
                    {
                        this.state.categoryOpen &&
                        <View>
                            {
                                this.renderDefaultOption('category')
                            }
                            <View style={styles.multiColFilter}>
                                <FlatList
                                    style={{ backgroundColor: color.background, flex: 1 }}
                                    keyExtractor={(item, index) => index}
                                    data={this.state.categoryOptionsL1}
                                    renderItem={this.renderCategoryL1Option.bind(this)}
                                />
                                <FlatList
                                    style={{ ...styles.optionList, flex: 1, height: this.state.categoryOptionsL1.length * 50, }}
                                    keyExtractor={(item, index) => index}
                                    data={this.state.categoryOptionsL2}
                                    renderItem={
                                        (data) => {
                                            return this.renderPlainOption(data, "selectedSub")
                                        }
                                    }
                                />
                            </View>
                        </View>
                    }
                    {
                        this.state.areaOpen &&
                        <View>
                            {
                                this.renderDefaultOption('area')
                            }
                            <View style={styles.multiColFilter}>
                                <FlatList
                                    style={{ backgroundColor: color.background, flex: 1 }}
                                    keyExtractor={(item, index) => index}
                                    data={this.state.areaOptionsL1}
                                    renderItem={this.renderAreaL1Option.bind(this)}
                                />
                                <FlatList
                                    style={{ ...styles.optionList, flex: 1, height: this.state.areaOptionsL1.length * 50, }}
                                    keyExtractor={(item, index) => index}
                                    data={this.state.areaOptionsL2}
                                    renderItem={
                                        (data) => {
                                            return this.renderPlainOption(data, "selectedDistrict")
                                        }
                                    }
                                />
                            </View>
                        </View>
                    }
                    {
                        this.state.rankingOpen &&
                        <View>
                            {
                                this.renderDefaultOption('ranking')
                            }
                            <FlatList
                                style={styles.optionList}
                                keyExtractor={(item, index) => index}
                                data={this.state.rankingOptions}
                                renderItem={
                                    (data) => {
                                        return this.renderPlainOption(data, "selectedRanking")
                                    }
                                }
                            />
                        </View>
                    }
                    {
                        this.state.distanceOpen &&
                        <View>
                            {
                                this.renderDefaultOption('distance')
                            }
                            <FlatList
                                style={styles.optionList}
                                keyExtractor={(item, index) => index}
                                data={this.state.distanceOptions}
                                renderItem={
                                    (data) => {
                                        return this.renderPlainOption(data, "selectedDistance")
                                    }
                                }
                            />
                        </View>
                    }
                </View>
                <TouchableOpacity onPress={this.hide.bind(this)} style={{ height: 1500 }}>

                </TouchableOpacity>
            </View >
        );
    }
}

const styles = {
    multiColFilter: {
        flexDirection: 'row'
    },
    touch: {
        height: 50,
        padding: 5,
        width: '25%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#868686',
        padding: 3,
        textAlign: 'center'
    },
    option: {
        width: '100%',
        height: 50,
        padding: 10,
        justifyContent: 'center'
    },
    defaultOption: {
        width: '100%',
        height: 50,
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    optionList: {
        backgroundColor: 'white'
    }
}