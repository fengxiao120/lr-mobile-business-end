//import liraries
import React, { PureComponent } from 'react'
import {
    View, Text, StyleSheet, ScrollView,
    FlatList, ListView, Image, TextInput, Picker, TouchableOpacity, Alert, Platform
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import { Heading1, Heading2, Paragraph } from '../../widget/Text'
import { color, NavigationItem, RefreshListView, RefreshState, SpacingView, LRSpinner, Avatar } from '../../widget'
import { screen, system, tool } from '../../common'
import UserApi from '../../api/user'
import { CheckBox } from 'react-native-elements'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Storage from '../../common/storage'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import _ from 'lodash'
import CONFIG from '../../config'
import { Button } from 'react-native-elements';
import Bus from '../../common/bus'
import ImageApi from '../../api/image'
const CANCEL_INDEX = 0
const options = ['Cancel', 'Take a photo', 'Choose from album']

class EditProfileImageScene extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: "Profile Photo",
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight: 'normal' },
        headerRight: (<View></View>),
        headerRight: (
            <TouchableOpacity onPress={navigation.state.params && navigation.state.params.submit}>
                <Text style={{ backgroundColor: '#0abab5', color: 'white', padding: 5, marginRight: 10 }}>Submit</Text>
            </TouchableOpacity>
        )
    })
    constructor(props: Object) {
        super(props)
        this.state = {
            loading: false
        }
        this.props.navigation.setParams({
            submit: this.submit.bind(this)
        })

    }
    async submit() {
        let data = this.state.user
        data.pictureUuid = data.picture && data.picture.uuid
        this.setState({ loading: true })
        let json = await UserApi.updateProfile(data)
        this.setState({ loading: false })
        if (json.success) {
            Storage.set("user", json.data)
            Bus.emit("USER_UPDATED")
            ___toast('Successfully Updated')
            this.props.navigation.state.params.callback(json.data)
            this.props.navigation.goBack()
        }
    }
    componentWillMount() {
        this.getUser()
    }
    async getUser() {
        let user = await Storage.get("user")
        this.setState({ user: user })
    }
    clear() {
        this.setState({
            value: null
        })
    }
    upload(photo) {
        let ref = this;
        const data = new FormData();
        data.append('photo', {
            uri: photo.path,
            type: Platform.OS == 'ios'?photo.type:'image/jpeg',
            name: 'photo'
        });
        ImageApi.upload(data).then(json => {
            let user = _.clone(this.state.user)
            user.picture = { uuid: json.data }
            ref.setState({
                user: user
            })
        }, (error) => {
            ref.setState({
                loading: false
            })
        })
    }

    pickSingleWithCamera = () => {
        ImagePicker.openCamera({
            cropping: false,
            compressImageMaxWidth: 1024,
            compressImageMaxHeight: 1024,
            compressImageQuality: 0.75
        }).then(photo => {
            this.upload(photo);
        }).catch(
            e => console.log(e)
            );
    }
    handlePress(i) {
        if (i == 1)
            this.pickSingleWithCamera()
        if (i == 2)
            this.openPicLib()
    }
    openPicLib = () => {
        if (Platform.OS === 'ios') {
            ImagePicker.openPicker({
                multiple: false,
                waitAnimationEnd: false,
                compressImageMaxWidth: 1024,
                compressImageMaxHeight: 1024,
                compressImageQuality: 0.75
            }).then(photo => {
                this.upload(photo);
            }).catch(e =>
                e => console.log(e)
                );

        } else {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: false,
                cropperCircleOverlay: false,
                compressImageMaxWidth: 1024,
                compressImageMaxHeight: 1024,
                compressImageQuality: 0.75,
                mediaType: 'photo',
                compressVideoPreset: 'MediumQuality'
            }).then(photo => {
                this.upload(photo);
            }).catch(e => {
                Alert.alert(e.message
                    ? e.message
                    : e);
            });
        }
    }
    render() {
        return (
            <View style={{ backgroundColor: 'white', padding: 10, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                {

                    this.state.user && this.state.user.picture ?
                        (<TouchableOpacity onPress={this.editProfileImage}>
                            <Image style={styles.avatar} source={{ uri: CONFIG.IMAGE_HOST + this.state.user.picture.uuid }} />
                        </TouchableOpacity>) :
                        (<TouchableOpacity onPress={this.editProfileImage}>
                            <Image style={styles.avatar} source={require('../../img/Me/avatar.png')} />
                        </TouchableOpacity>)
                }
                <Button onPress={() => {
                    this.ActionSheet.show();
                }} color="#0abab5" backgroundColor="white" borderRadius={5} containerViewStyle={{ borderWidth: 1, borderColor: "#0abab5", width: '80%', marginTop: 60 }} title="Upload New Photo" />
                <LRSpinner visible={this.state.loading} />
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    onPress={this.handlePress.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    avatar: {
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 2,
        borderColor: '#51D3C6',
    }
});

export default EditProfileImageScene


