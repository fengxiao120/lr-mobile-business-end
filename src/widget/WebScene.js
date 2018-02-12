import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, WebView, InteractionManager } from 'react-native'
import { color, NavigationItem, SpacingView, LRSpinner } from '../widget'
// create a component
class WebScene extends PureComponent {

    static navigationOptions = ({ navigation }) => ({
        headerStyle: { backgroundColor: 'white' },
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', color: color.theme, fontSize: 18, fontWeight: 'normal' },
        headerRight: (<View></View>),
        title: navigation.state.params.title || 'Loading',
    });

    state: {
        source: Object
    }

    constructor(props: Object) {
        super(props)
        this.state = {
            source: {}
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ source: { uri: this.props.navigation.state.params.url } })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    ref='webView'
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={this.state.source}
                    injectedJavaScript="window.postMessage(document.title)"
                    onMessage={this.onLoadEnd.bind(this)}
                    scalesPageToFit
                />
            </View>
        );
    }

    onLoadEnd(e: any) {
        if (e.nativeEvent.title.length > 0) {
            this.props.navigation.setParams({ title: e.nativeEvent.title })
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    webView: {
        flex: 1,
        backgroundColor: 'white',
    }
});

//make this component available to the app
export default WebScene;
