import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, FlatList } from "react-native"
import { useEffect, useState } from "react"
import LoadingModal from "../LoadingModal"
import styles, {color} from "../style"
import { supabase } from "../../lib/supabase"
import { Button } from "react-native-paper"
import { StyleSheet } from "react-native"
import { useFormik } from "formik"
// import RNPickerSelect from "react-native-picker-select"
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from "yup"
import { exampleImage } from "../../assets/example-img"
import Ionicons from '@expo/vector-icons/Ionicons'
import { AntDesign, EvilIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const mysytle = StyleSheet.create(
  {
    outline:{marginTop: 2, borderColor: color.primaryColor, marginBottom: 2},
    image:{borderRadius: 10,borderColor: color.primaryColor, borderWidth: 1, height: 240,width: '100%'}
  }
)

const pickImageAsync = async (setLoading, setUrlImg) => {
  setLoading(true)
  let result = await ImagePicker.launchImageLibraryAsync({
    base64: true,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const base64 = 'data:image/png;base64,'+result.base64
    setUrlImg(base64)
  }

  setLoading(false)
}

// 
const NewMessage = ({setMewMessage, setRefresh}) => {
  const [urlImg, setUrlImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [emission, setEmission] = useState(0)
  
  const handleSubmit = async(data) => {
    setLoading(true)
    try {
      let {error} = await supabase.from('posts').insert([data]).select()
      if(error)throw error
      setRefresh(true)
      setMewMessage(false)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const form = useFormik({
    initialValues:{
      description:'',location:'',distance:0
    },
    validationSchema: Yup.object({
      description: Yup.string().required().max(120),
      location: Yup.string().required().max(120),
      distance: Yup.number().required().positive(),
    }),
    onSubmit: value => {
      const data = {
        url_img:urlImg, 
        content:value.description, 
        location: value.location, 
        carbon_footprint: emission * value.distance,
        like_count: 0,
        comment_count: 0
      }
      handleSubmit(data)
    }
  })

  const imageDefault = urlImg ? {uri:urlImg} : null

  return <View style={[styles.container, {padding: 10}]}>
    <ScrollView>
      <LoadingModal visible={loading} />
      <View style={{alignItems: "center"}}>
          <TouchableOpacity style={{justifyContent: 'center', flexDirection: 'row'}} onPress={()=>pickImageAsync(setLoading, setUrlImg)}>
              <Image source={imageDefault} style={mysytle.image} />
          </TouchableOpacity>
          <Text>Tap to upload / change image</Text>
      </View>
      {
        urlImg ? 
        <Button buttonColor={color.dangerColor} mode="contained" style={[mysytle.outline, {marginBottom: 6}]} onPress={()=>setUrlImg(null)} >Delete image</Button> : null
      }

      <View style={{rowGap:12, marginVertical: 6}}>
        <View>
          <Text>Description</Text>
          <TextInput
            maxLength={200}
            style={styles.input}
            onChangeText={form.handleChange('description')}
            placeholder="Description"
            value={form.values.description}/>
          {form.errors.description ? <Text>{form.errors.description}</Text> : null}
        </View>

        <View>
          <Text>Location</Text>
          <TextInput
            maxLength={200}
            style={styles.input}
            onChangeText={form.handleChange('location')}
            placeholder="Location"
            value={form.values.location}/>
          {form.errors.location ? <Text>{form.errors.location}</Text> : null}
        </View>
        
        <View>
          <Text>Select transportation</Text>
          <View style={{borderColor: color.borderColor,borderRadius: 5, borderWidth: 1, marginVertical: 6}}>
          <Picker
            selectedValue={emission}
            onValueChange={setEmission}>
            <Picker.Item label="Airplane" value={0.19} />
            <Picker.Item label="Car" value={0.22} />
            <Picker.Item label="Motorcycle / Cycling" value={0.11} />
            <Picker.Item label="Walking / Cycling" value={0} />
          </Picker>
          </View>
        </View>
        
        <View>
          <Text>Distance (km)</Text>
          <TextInput
            maxLength={200}
            style={styles.input}
            onChangeText={form.handleChange('distance')}
            placeholder="10"
            value={form.values.distance}/>
          {form.errors.distance ? <Text>{form.errors.distance}</Text> : null}
        </View>

      </View>

      <Button buttonColor={color.primaryColor} mode="contained" style={[mysytle.outline, {marginBottom: 6}]} onPress={form.handleSubmit} >Submit</Button>
      <Button textColor={color.primaryColor} mode="outlined" style={mysytle.outline} onPress={()=>setMewMessage(false)} >Cancel</Button>
    </ScrollView>
  </View>
}

const HomeScreen = ({session}) => {
    const [loading, setLoading] = useState(false)
    const [newMessage, setMewMessage] = useState(false)
    const [paginate, setPaginate] = useState(0)
    const [data, setData] = useState()
    const [userData, setUserData] = useState(null)
    const [refresh, setRefresh] = useState(false)

    const updateData = async () => {
      try{
        let { data:count_post } = await supabase.from('posts').select('id')
        if(count_post.length == paginate)return

        let { data:posts, error } = await supabase.from('posts').select('*').range(paginate, paginate+4)
        setPaginate(posts.length)
        
        let userdata = []
        const {data:users, erros} = await supabase.from('users').select('name,url_img')
        userdata = users
        // setUserData(users)
        
        let temp = []
        posts.forEach(p=>{
          temp.push({
            id: p.id,
            username: userdata.find(e=>e.id == p.user_id).name,
            img_profile: userdata.find(e=>e.id == p.user_id).url_img,
            img_post: p.url_img,
            content: p.content,
            location: p.location,
            footprint: p.carbon_footprint,
            like: p.like_count,
            comment: p.comment_count
          })
        })
        temp = [...data, ...temp]
        if(temp.length > count_post.length) return
        setData(temp)
      }catch(e){
        console.log(e)
      }
    }

    const handleAllData = async () => {
      setLoading(true)
      try{
        // let { data:count_post } = await supabase.from('posts').select('id')
        if(paginate != 0)return
        
        let { data:posts, error } = await supabase.from('posts').select('*').range(0, 3)
        setPaginate(posts.length)

        let userdata = []
        const {data:users, erros} = await supabase.from('users').select('name,url_img')
        userdata = users
        setUserData(users)
        let temp = []
        posts.forEach(p=>{
          let user = userdata.find(e=>e.id == p.user_id)

          temp.push({
            id: p.id,
            username: user.name,
            img_profile: user.url_img,
            img_post: p.url_img,
            content: p.content,
            location: p.location,
            footprint: p.carbon_footprint,
            like: p.like_count,
            comment: p.comment_count
          })
        })
        
        setData(temp)
      }catch(e){
        console.log(e)
      }
      setLoading(false)
    }

    const Post = ({data}) => {
      const profileImage = data.img_profile ? {uri:data.img_profile} : require('../../assets/anon.png')

      return <View style={{marginBottom: 12}}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image 
              source={profileImage} 
              style={[styles.imgProfile, {height:20,width:20, marginBottom: 1}]} />
              <Text style={{fontWeight: 'bold'}}>{data.username}</Text>
          </View>
          <Text style={{fontSize: 12, color: color.grayColor, marginHorizontal: 5}}>at - {data.location}</Text>
        </View>
      <View style={styles.boxContent}>
        {
          data.img_post ? 
          <Image 
            source={{uri:data.img_post}}
            style={[styles.imgProfile, {height:240,width:'auto', borderRadius: 15}]}
          /> : null
        }
        <Text>{data.content}</Text>
        <View style={{borderTopWidth: 1, marginTop: 6, borderColor: color.borderColor, paddingVertical: 3, flexDirection: 'row'}}>
          <TouchableOpacity style={{flexDirection:'row', alignItems: 'center'}}>
            <Text style={{marginHorizontal: 2, fontWeight: 'bold'}}>{data.like}</Text>
            <AntDesign name="like2" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row', alignItems: 'center', marginHorizontal: 6}}>
            <Text style={{marginHorizontal: 2, fontWeight: 'bold'}}>{data.comment}</Text>
            <FontAwesome name="comment-o" size={24} color="black" />
          </TouchableOpacity>
          <View style={{flexDirection:'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="foot-print" size={24} color="black" />
            <Text style={{marginHorizontal: 2, fontWeight: 'bold'}}>{data.footprint}/co2</Text>
          </View>
        </View>
      </View>
    </View>
    }

    useEffect(()=>{
      handleAllData()
    },[refresh])

    return <>
      { newMessage ? <NewMessage setMewMessage={setMewMessage} setRefresh={setRefresh}/> : 
      <View style={[styles.container, {padding: 10}]}>
          {
            loading ? null : <View style={{position: 'absolute', bottom: 12, right: 5, zIndex: 100}}>
              <Button buttonColor={color.primaryColor} mode="contained" onPress={()=>setMewMessage(true)} >Create post</Button>
            </View>
          }
          {
            loading ? <Text>please wait...</Text> :
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              style={{marginBottom: 4, paddingBottom: 100}}
              data={data}
              renderItem={({item})=> <Post data={item} key={item.id} /> }
              keyExtractor={item => item.id}    
              onEndReachedThreshold={0.2}
              onEndReached={updateData}
              ListFooterComponent={()=><View style={{width:10,height:30}}></View>}
              />
          }
      </View>
      }
    </>
  }

  export default HomeScreen