import {StyleSheet} from 'react-native'

export const color = {
    statusBarColor: '#999',
    borderColor: '#aaa',
    primaryColor: 'rgb(0,100,0)',
    disableColor: 'rgba(0,100,0,.5)',
    errorColor: 'rgb(200,0,0)',
    dangerColor: 'rgb(160,0,0)',
}

const styles = StyleSheet.create({
    backgroundWhite:{
        backgroundColor: '#fff'
    },
    btnPrimary: {
        alignItems: 'center',
        backgroundColor: color.primaryColor,
        padding: 10,
        marginVertical: 4,
        width: 'auto',
        borderRadius: 10,
        borderWidth: 0,
    },
    container:{
        flex: 1,
        backgroundColor:'#fff',
    },
    centerHorizontally: {
        alignItems: 'center'
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disableColor: {
        backgroundColor: color.disableColor,
        borderColor: color.disableColor
    },
    errorColor: {
        color: color.errorColor,
    },
    errorInput: {
        color: color.errorColor,
        marginBottom: 4
    },
    imgProfile:{
        height: 60,
        width: 60,
        margin: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 600
    },
    input: {
        height: 42,
        width: 'auto',
        marginVertical: 6,
        borderWidth: 1,
        padding: 10,
        color: '#000',
        borderColor: color.borderColor,
        borderRadius: 5
    },
    logoLoginText:{
        height: 40,
        width: 200,
        resizeMode: 'stretch'
    },
    logoLogin: {
        width:80,
        height: 80
    },
    padding: {
        padding: 15
    },
    tabBottom: {
        position: 'absolute',
        flex: 1,
        bottom: 100,
        height: 40,
        backgroundColor: color.primaryColor
    },
    text: {
        color: 'rgb(0,100,0)', //'#000',
        fontSize: 24
    },
});

export default styles
