import {ScrollView,  View, Image, Text, TextInput, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import styles, {color} from './style'
import {useFormik} from 'formik'
import { supabase } from '../lib/supabase'
import { loginSchema } from '../lib/utils'
import LoadingModal from './LoadingModal'

const width = Dimensions.get('screen').width * .85

const FormLogin = ({navigation}) => {
    const [loading, setLoading] = useState(false)
    const passwordRef = useRef()    


    const form = useFormik({
        initialValues: {email: '', password: ''},
        validationSchema: loginSchema,
        onSubmit: value => {
            signIn(value.email, value.password)
        }
    })
    
    const invalid = (form.values.email === '' || form.values.password === ''
    || form.errors.email  != undefined|| form.errors.password != undefined) 

    const signIn = async (email, password) => {
        if(invalid) return
        console.log('process')
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        }) 
        setLoading(false)
        
        if (error) Alert.alert('error','your email and password didn\'t match')
    }


    return (
        <View>
            <LoadingModal visible={loading} />

            <Text>Email</Text>
            <TextInput
                maxLength={200}
                style={styles.input}
                onChangeText={form.handleChange('email')}
                onSubmitEditing={()=>passwordRef.current.focus()}
                value={form.values.email}
                returnKeyType='next'
            />
            { form.errors.email ? (
                <Text style={styles.errorInput}>{form.errors.email}</Text>
            ) : null }
            <Text>Password</Text>
            <TextInput
                maxLength={200}
                style={[styles.input, {width: width}]}
                onChangeText={form.handleChange('password')}
                value={form.values.password}
                onSubmitEditing={form.handleSubmit}
                secureTextEntry
                ref={passwordRef}
            />
            { form.errors.password ? (
                <Text style={styles.errorInput}>{form.errors.password}</Text>
            ) : null }
            <TouchableOpacity 
                style={ invalid ? [ styles.btnPrimary, styles.disableColor] : styles.btnPrimary} 
                onPress={form.handleSubmit} 
                disabled={invalid ? true : false}>
                <Text style={{color:'#fff'}}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[ styles.btnPrimary, 
                    {borderColor: color.primaryColor, backgroundColor: '#fff', borderWidth: 1}]} 
                onPress={()=>navigation.navigate('Register')} >
                <Text style={{color:color.primaryColor}}>Register</Text>
            </TouchableOpacity>

            <View style={{alignItems:'center', flexDirection: 'row', justifyContent: 'center'}}>
                <Text>Forget your password? </Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Forget Password')}>
                   <Text style={{color: color.primaryColor, fontWeight: 'bold'}}> Reset Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function LoginScreen({navigation}) {
    const logoLogin = require('../assets/logoLogin.png')    
    const logoLoginText = require('../assets/pejalanHijau.png')

    return (
        <View style={[styles.center, styles.backgroundWhite]}>
            <View style={[styles.centerHorizontally]}>
                <Image source={logoLoginText} style={styles.logoLoginText} />
                <Image source={logoLogin} style={styles.logoLogin}/>
            </View>
            <FormLogin navigation={navigation}/>
        </View>
    )
}