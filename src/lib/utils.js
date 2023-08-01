import * as Yup from 'yup'

export const registerSchema = Yup.object({
    name: Yup.string().min(4).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(8),
    confirmPassword: Yup.string().test('passwords-match', 'Passwords must match', function(value){
        return this.parent.password === value
    }),
})

export const typeRegister = {
    name:"",
    email:"",
    password:"",
    confirmPassword: ""
}

export const typeProfile = {
    auth_id: "",
    name: "",
    email: "",
    url_img: ""
  }


export const loginSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required()
})


export const profileSchema = Yup.object({
    username: Yup.string().min(4).required(),
    email: Yup.string().email()
})

export const isValidUrl = urlString => {
    try { 
        return Boolean(new URL(urlString)); 
    }
    catch(e){ 
        return false; 
    }
}

export const stringToUuid = (str) => {
    str = str.replace('-', '');
    return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c, p) {
        return str[p % str.length];
    });
}