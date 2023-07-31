import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, {useState, useRef} from 'react'
import styles, {color} from './style'
import { useFormik } from 'formik'
import LoadingModal from './LoadingModal'
import { supabase } from '../lib/supabase'
import { registerSchema, typeRegister } from '../lib/utils'

export default function RegisterScreen({navigation}) {
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()

  const logoLogin = require('../assets/logoLogin.png')    
  const logoLoginText = require('../assets/pejalanHijau.png')

  const signUp = async (value=typeRegister) => {
      setLoading(true)
      setLoadingMessage('creating account')
      

      const {data: dataSignUp, error: errorSignUp} =  await supabase.auth.signUp({
        email: value.email,
        password: value.password
      })

      if (errorSignUp){
        setLoading(false)
        console.log('error1', errorSignUp.message)
        Alert.alert('error', errorSignUp.message)
        return
      } 
      
      const {error} = await supabase.from('users').insert([
        { id: dataSignUp.user.id, name: value.name }
      ])

      if (error){
        setLoading(false)
        Alert.alert('error', error.message)
        return
      }
      
      setLoading(false)
      setLoadingMessage()
  }

  const form = useFormik({
    initialValues: {name: '', email: '', password: '', confirmPassword: ''},
    validationSchema: registerSchema,
    onSubmit: value => {
          signUp(value)
    }
  })

  const invalid = form.values.name === '' || form.values.email === ''
    || form.values.password === '' || form.values.confirmPassword == ''
    || form.errors.name != undefined || form.errors.email != undefined
    || form.errors.password != undefined || form.errors.confirmPassword != undefined

  const validColorButton = [styles.btnPrimary, {borderColor: color.primaryColor, backgroundColor: '#fff', borderWidth: 1}]
  const invalidColorButton = [styles.btnPrimary, {borderColor: color.disableColor, backgroundColor: '#eee'}]
  let colorButton = invalid ? invalidColorButton : validColorButton
  
  return (
    <>
      <LoadingModal visible={loading} message={loadingMessage} />
      <View style={[styles.container, styles.padding]}>
        <ScrollView style={ {marginVertical: 15}}>
          <View style={[styles.centerHorizontally]}>
              <Image source={logoLoginText} style={styles.logoLoginText} />
              <Image source={logoLogin} style={styles.logoLogin}/>
          </View>
          <Text>Username</Text>
          <TextInput
              maxLength={200}
              style={styles.input}
              onChangeText={form.handleChange('name')}
              onSubmitEditing={()=>emailRef.current.focus()}
              value={form.values.name}
              autoFocus={true}
              returnKeyType='next'
          />

          {form.values.name != '' && form.errors.name ? (
             <Text style={styles.errorInput}>{form.errors.name}</Text>
            ) : null }
          <Text>Email</Text>
          <TextInput
              maxLength={200}
              style={styles.input}
              onChangeText={form.handleChange('email')}
              onSubmitEditing={()=>passwordRef.current.focus()}
              value={form.values.email}
              ref={emailRef}
              returnKeyType='next'
          />
          {form.values.email != '' && form.errors.email ? (
             <Text style={styles.errorInput}>{form.errors.email}</Text>
            ) : null }

          <Text>Password</Text>
          <TextInput
              maxLength={200}
              style={styles.input}
              onChangeText={form.handleChange('password')}
              onSubmitEditing={()=>passwordConfirmRef.current.focus()}
              value={form.values.password}
              ref={passwordRef}
              secureTextEntry
              returnKeyType='next'
          />
          {form.values.password != '' && form.errors.password ? (
             <Text style={styles.errorInput}>{form.errors.password}</Text>
            ) : null }

          <Text>Confirm Password</Text>
          <TextInput
              maxLength={200}
              style={styles.input}
              onChangeText={form.handleChange('confirmPassword')}
              onSubmitEditing={()=>form.handleSubmit()}
              value={form.values.confirmPassword}
              ref={passwordConfirmRef}
              secureTextEntry
              returnKeyType='next'
          />
          {form.values.confirmPassword != '' && form.errors.confirmPassword ? (
             <Text style={styles.errorInput}>{form.errors.confirmPassword}</Text>
            ) : null }

          <View style={{marginTop: 10}}>
            <TouchableOpacity 
                style={colorButton} 
                onPress={form.handleSubmit} 
                disabled={invalid ? true : false}>
                <Text style={{color:color.primaryColor}}>Register</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </>
  )
}