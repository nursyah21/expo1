import { View, Text, TouchableOpacity, Image, TextInput, Alert } from "react-native"
import { useState, useEffect, useRef } from "react"
import LoadingModal from "../LoadingModal"
import styles, { color } from "../style"
import { supabase } from "../../lib/supabase"
import { isValidUrl, profileSchema, stringToUuid, typeProfile } from "../../lib/utils"
import { useFormik } from "formik"
import * as ImagePicker from 'expo-image-picker';
import imageToBase64 from 'image-to-base64/browser'

const fetchUser = async (setData, form) => {
  const {data: {user}} = await supabase.auth.getUser()

  if(user == null)return
  
  let { data, error } = await supabase.from('users')
  .select("*").eq('id', user.id)
  
  if(error) return console.log(error.details)
  setData({auth_id: user.id, name:data[0]?.name, email: user.email, url_img: data[0]?.url_img})
  if(!form.values.username)form.values.username = data[0]?.name
}

const pickImageAsync = async (setLoading) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    base64: true,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setLoading(true)
    const base64 = 'data:image/png;base64,'+result.base64
    const {data: {user}} = await supabase.auth.getUser()
    await supabase.from('users').update({url_img: base64}).eq('id', user.id)
    setLoading(false)
    
  } else {
    alert('You did not select any image.');
  }
}

function SettingsScreen({session}){
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('Please wait...')
    const [editProfile, setEditProfile] = useState(false)
    const [data, setData] = useState(typeProfile)
    const [messageError, setMessageError] = useState('')
    
    useEffect(()=>{
      (async function() {
        setLoading(true)
        await fetchUser(setData, form)
        setLoading(false)
      })()
    }, [])

    const signOut = async () => {
      setLoading(true)
      await supabase.auth.signOut()
      setLoading(false)
    }

    const cancelEdit = () => {
      setEditProfile(false)
    }


    const deleteUser = async () => {
      setLoadingMessage("delete account...")
      setLoading(true)
      const {data: {user}} = await supabase.auth.getUser()

      const { data, error } = await supabase.auth.admin.deleteUser(user.id)
      
      if(error) {
        Alert.alert('error', error.message)
      }
      
      await supabase.auth.signOut()

      setLoading(false)
      setLoadingMessage("Please wait...")
    }

    const promptDelete = () => Alert.alert('Warning', 'Do you want to delete this account', [
      {text: 'yes', onPress: () => deleteUser()},
      {text: 'No',onPress: () => console.log('Cancel Pressed')}
    ]);

    const handleUpdate = async (value) => {
      setLoading(true)
      const {data: checkUser} = await supabase.from('users').select('*').eq('name',value.username)
      if(checkUser.length != 0){
        console.log(checkUser)
        Alert.alert('fail', `${value.username} already exists`)
        return setLoading(false)
      }
      const {data: {user}} = await supabase.auth.getUser() 
      let { data, error } = await supabase.from('users').update({name: value.username}).eq('id', user.id)
      if(error)console.log(error)
      setEditProfile(false)
      await fetchUser(setData, form)
      setLoading(false)
    }

    const form = useFormik({
      initialValues: {username: ''},
      validationSchema: profileSchema,
      onSubmit: value => handleUpdate(value)
    })

    const imageDefault = data.url_img ? {uri:data.url_img} : require('../../assets/anon.png')
    
    return (
      <View style={[styles.container, {padding: 10}]}>
        <LoadingModal visible={loading} message={loadingMessage} />
        <View>
          
          { editProfile ?
                <View style={{alignItems: "center"}}>
                  <TouchableOpacity style={{justifyContent: 'center', flexDirection: 'row'}} onPress={()=>pickImageAsync(setLoading)}>
                      <Image source={imageDefault} style={[styles.imgProfile, {borderColor: color.primaryColor, borderWidth: 2}]} />
                  </TouchableOpacity>
                  <Text>Tap to change</Text>
                </View>
            : <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                <Image source={imageDefault} style={styles.imgProfile} />
              </View>
          }
          { editProfile ?
            <View style={{gap:2}}>
              <Text>Username</Text>
              <TextInput
                maxLength={200}
                style={styles.input}
                onChangeText={form.handleChange('username')}
                value={form.values.username}/>
                {form.errors.username ? <Text>{form.errors.username}</Text> : null}
                {messageError ? <Text>{messageError}</Text> : null}
            </View>
            :
            <View style={{gap:2}}>
              <Text>Username</Text>
              <View style={{marginVertical: 5, borderWidth: .6, padding: 6, borderRadius: 6}}>
                <Text>{data.name}</Text>
              </View>

              <Text>Email</Text>
              <View style={{marginVertical: 5, borderWidth: .6, padding: 6, borderRadius: 6}}>
                <Text>{data.email}</Text>
              </View>
            </View>
            }

        </View>
        
        <TouchableOpacity style={styles.btnPrimary} onPress={()=> editProfile ? form.handleSubmit() : setEditProfile(!editProfile)}>
          <Text style={{color: 'white'}}>
            {editProfile ? "Submit" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnPrimary} onPress={editProfile ? cancelEdit : signOut}>
          <Text style={{color: 'white'}}>
          { editProfile ? "Cancel" : "Logout" }
          </Text>
        </TouchableOpacity>
        {
          !editProfile ? <TouchableOpacity style={[styles.btnPrimary, {backgroundColor: color.dangerColor}]} onPress={promptDelete}>
          <Text style={{color: 'white'}}>Delete Account</Text>
        </TouchableOpacity> : null
        }
      </View>
    )
  }

  export default SettingsScreen