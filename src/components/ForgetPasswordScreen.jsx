import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Linking } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import styles, {color} from './style'
import LoadingModal from './LoadingModal'
import { supabase } from '../lib/supabase'

const schema = Yup.object({
  email: Yup.string().email().required()
})

export default function ForgetPasswrodScreen({navigation}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)


  const forgetPassword = async(value) => {
    setLoading(true)
    
    const linkReset = 'https:/jlnr.netlify.app/reset-password'

    let { error } = await supabase.auth.resetPasswordForEmail(
      value.email, {redirectTo: linkReset}
    )

    if(error) Alert.alert('error', error.message)
    if(!error) {
      setSuccess(true)
    }
    setLoading(false)
  }
  
  const form = useFormik({
      initialValues: {email: ''},
      validationSchema: schema,
      onSubmit: value => {
          forgetPassword(value)
      }
  })


  const invalid = form.values.email == '' && form.errors.email != undefined
  return (
    <>
      <LoadingModal visible={loading} message='send email...'/>
      <View style={[styles.container, styles.padding]}>
        <ScrollView>
          <Text style={[{color: color.primaryColor}]}>Enter the email registered with your account and we will send you an email to reset password.</Text>

          <View style={{paddingTop: 14}}>
            <Text>Email</Text>
            <TextInput
                maxLength={200}
                style={styles.input}
                onChangeText={form.handleChange('email')}
                onSubmitEditing={()=>form.handleSubmit()}
                autoFocus={true}
                value={form.values.email}
                returnKeyType='next'
            />
              { form.values.email != '' && form.errors.email ? (
                  <Text style={styles.errorInput}>{form.errors.email}</Text>
              ) : null }
              <TouchableOpacity 
                  style={ invalid ? [ styles.btnPrimary, styles.disableColor] : styles.btnPrimary} 
                  onPress={form.handleSubmit} 
                  disabled={invalid}>
                  <Text style={{color:'#fff'}}>Send Email</Text>
              </TouchableOpacity>
              { success ? <Text style={[{color: color.primaryColor}]}>Check your email inbox</Text> : null}
          </View>
        </ScrollView>
      </View>
    </>
  )
}