import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import LoadingModal from "../LoadingModal"
import styles, {color} from "../style"
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from "../../lib/supabase"
import { DataTable } from 'react-native-paper'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

const searchHandle = async (result,value, setResult, setMessage) => {
  if(value === '')return

  setMessage('please wait...')
  let { data: users, error } = await supabase.from('users').select('id,name').ilike('name', `%${value}%`)
  if(error){
    setResult([])
  }
  setResult(users)
  setMessage('')
}


function UserScreen({id}){
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [myId, setMyId] = useState()
  const [visitedId, setVisitedId] = useState()
  const [canfollow, setCanfollow] = useState()
  const [isFollowing, setIsFollowing] = useState()

  useEffect(()=>{
    (async function(){
      if(!id)return

      const {data: {user}} = await supabase.auth.getUser()
      setMyId(user.id)

      let { data, error } = await supabase.from('users').select("*").eq('id', id)
      if(error){
        return console.log(error)
      }
      
      let {data: follower, error: error2} = await supabase.from('followers').select('following_id')
      .eq('following_id', data[0].id).eq('follower_id', user.id)

      if(follower.length != 0) setIsFollowing(true)
      else setIsFollowing(false)

      setData(data[0])
      setVisitedId(data[0].id)
      setCanfollow(user.id != data[0].id)
    })()
  },[])

  const unFollowUserHandle = async() => {
    setLoading(true)
    try{
      let { data, error } = await supabase.from('followers').delete()
      .eq('following_id', visitedId).eq('follower_id', myId)

      let {data: follower, error: error2} = await supabase.from('followers').select('following_id')
      .eq('following_id', visitedId).eq('follower_id', myId)
      
      if(follower.length != 0) setIsFollowing(true)
      else setIsFollowing(false)
    }catch(e){
      console.log(e)
    }
    setLoading(false)
  }

  const followUserHandle = async() => {
    setLoading(true)
    try{
      let { error } = await supabase.from('followers').insert([
        {follower_id : myId, following_id: visitedId },
      ]).select()

      if(error){console.log(error)}

      let {data: follower, error: error2} = await supabase.from('followers').select('following_id')
      .eq('following_id', visitedId).eq('follower_id', myId)

      
      if(follower.length != 0) setIsFollowing(true)
      else setIsFollowing(false)
      
      setLoading(false)
    }catch(e){
      console.log('error follow',e)
      setLoading(false)
    }
  }

  const imageDefault = data?.url_img ? {uri:data.url_img} : require('../../assets/anon.png')

  return <>
  <LoadingModal visible={loading} />
  <View style={[styles.container, {padding: 10}]}>
    {data ? 
      <View style={{alignItems: "center"}}>
        <View style={{justifyContent: 'center', flexDirection: 'row'}} onPress={()=>pickImageAsync(setLoading)}>
            <Image source={imageDefault} style={[styles.imgProfile, {borderColor: color.primaryColor, borderWidth: 2}]} />
        </View>
        <Text>{data.name}</Text>
        { canfollow ?
          isFollowing ? 
          <Button style={{marginTop: 4}} textColor={color.primaryColor} mode="outlined" onPress={unFollowUserHandle}>
            <Text>Unfollow</Text>
          </Button> :
          <Button style={{marginTop: 4}} textColor={color.primaryColor} mode="outlined" onPress={followUserHandle}>
            <Text>Follow</Text>
          </Button> : null
        }
      </View> : null
    }
  </View>
  </>
}

function SearchScreen({setVisitUser}){
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([])
  const [message, setMessage] = useState('')
  const navigation = useNavigation()

  return (
    <View style={[styles.container, {padding: 10}]}>
      <LoadingModal visible={loading} />
      <TextInput
          maxLength={200}
          style={styles.input}
          onChangeText={setSearch}
          onSubmitEditing={()=>searchHandle(result,search, setResult, setMessage)}
          value={search}
          placeholder="Search user"
      />

      {message 
      ? <Text>{message}</Text>
      : result?.length === 0 ? null 
      : <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>No</DataTable.Title>
              <DataTable.Title>Username</DataTable.Title>
            </DataTable.Header>
            {result.map((e, idx)=><>
              <TouchableOpacity key={idx} onPress={()=>{
                setVisitUser({id:e.id,active:true})
                navigation.navigate('VisitedTab')
              }}>
                <DataTable.Row  key={idx}>
                      <DataTable.Cell  key={idx+1}>{idx+1}</DataTable.Cell>
                      <DataTable.Cell  key={idx+2}>{e.name}</DataTable.Cell>
                </DataTable.Row>
              </TouchableOpacity>
            </>)}
        </DataTable>
      </ScrollView>
      }
    </View>
  )
}

function Screen({session}){
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [result, setResult] = useState([])
    const [message, setMessage] = useState('')
    const [visitUser, setVisitUser] = useState({id:null, active:false})

    
    return (
      <Tab.Navigator>
          <Tab.Screen name='SearchTab' options={{tabBarLabel: 'Search'}} >
            {(props) => <SearchScreen {...props} key={Math.random()} setVisitUser={setVisitUser} /> }
          </Tab.Screen>
          <Tab.Screen name='VisitedTab'  options={{tabBarLabel: 'Visited'}} >
            {(props) => <UserScreen {...props} key={Math.random()} id={visitUser?.id} /> }
          </Tab.Screen>
      </Tab.Navigator>
    )
  }

  export default Screen