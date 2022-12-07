<template>
    <div class="content">
      <div class="boiteblanche">
        <h1>Se connecter</h1>
        <div class="menu">
            <form @submit.prevent="submit" v-on:submit="SubmitForm(ClienEmail,Password)">
                <input v-model="ClienEmail" type="text" placeholder="Email EMSE" required><br>
                <input v-model="Password" type="password" placeholder="Mot de passe" required><br>
                <div class="submitpart">
                    <input class="boutonsubmit" type="submit" value="Se connecter" :style="{
                                color: submitClicked ? '#3694c6' : 'white' //when the button is clicked, we hide the connection button
                            }">
                    <div v-if="submitClicked" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </form>
            <p class="wrongEmail" v-if="this.incorrectPassword">L'email ou  le mot de passe saisit n'est pas correcte</p>
            <p class="ForgotPassword" @click="ForgotPassword">Mot de passe oublié</p>
        </div>
      </div>
      <div class="SignInButtonPart">
        <div class="bordure">
            <p>Je n'ai pas encore de compte</p>
            <button @click="SendToSignIn">S'inscrire</button>
        </div>
      </div>
      

      

  </div>

</template>

<script>
import axios from 'axios'; 
import {API_HOST,timeBetweenRefreshs} from "../config" //to get the API path
import VueJwtDecode from 'vue-jwt-decode'; //to decode Jwt token

export default {
  name: 'LogInPage',
  data: function() {
    return {
        ClienEmail: null,
        Password: null,
        incorrectPassword: false,
        submitClicked: false
    }
  },
  methods: {
    async SubmitForm(ClienEmail,password){
        if(!this.submitClicked){ //to prevent spamming
            this.submitClicked=true; //to display the loading animation
            var data = new FormData(); //so that the backend understand the data correctly 
            data.append('email', `${ClienEmail}`)
            data.append('password', `${password}`)
            
            //create a request to get acces and authentification tokens
            let response = await axios.post(`${API_HOST}/api/login`, data)
            this.submitClicked=true;
            const token=response.data.access_token;
            if (typeof(token) == "undefined"){ //it means that the serveur send the connexion page, which means that the password is wrong
                this.incorrectPassword=true;
                this.submitClicked=false;
            }
            else{
                let refresh_token =response.data.refresh_token;
                this.$store.commit('set', {token: `${token}`}) //set the value of the token to a global state
                this.$store.commit('setAuth', {auth: `${VueJwtDecode.decode(token).roles[0]}`}) //Set the role as a global variable
                this.$store.commit('setRefTok', {refresh_token: `${refresh_token}`}) ////Set the refresh token
                this.$router.push({ path: 'home', query: { token: `${token}`,refresh_token: `${refresh_token}` }}) //change path and add token to url
                this.$store.commit('setRefreshFunction', {refresh_token_function: setInterval(() => this.refreshToken(), timeBetweenRefreshs)}) //Set the function to periodicaly reset the token
            };
        }

        
    },
    SendToSignIn(){
      this.$router.push("/signin");
    },
    ForgotPassword(){
        this.$router.push("/forgetpw");
    },
    async refreshToken(){ //get a new tokens, update the url and global variables
        let response = await axios.get(`${API_HOST}/api/token/refresh`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.refreshToken}`}}); //get slots from the API
        this.$store.commit('set', {token: `${response.data.access_token}`}) //set the value of the token to a global state
        this.$store.commit('setRefTok', {refresh_token: `${response.data.refresh_token}`}) ////Set the refresh token
        this.$router.push({ path: 'home', query: { token: `${response.data.access_token}`,refresh_token: `${response.data.refresh_token}` }}) //change path and add token to url
        console.log("token mis à jour");
    }
  }
}
</script>

<style lang="scss" scoped>
    .content{
        //border: solid pink;
        margin: auto;
        align-items: center;
        width: 95%;

        .boiteblanche{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            //border: solid purple;

            h1{
                font-size: 35px;
                font-weight: 400;
            }
    

            .menu{
                //border: solid green;
                width: 100%;

                form{
                    display: flex;
                    flex-direction: column ;
                    align-items: stretch;


                    .submitpart{
                        display: flex;
                        flex-direction: column;
                        position: relative;

                        

                        input[type=submit]{
                            font-size: 14px;
                            //color: #eee;
                            font-weight: 600;
                            margin-top: 20px;
                            background-color: $secondColor;
                            border-radius: 84px;
                            
                            padding: 15px 15px 15px 15px;
                            cursor: pointer;
                        }

                        .lds-ellipsis{
                            position: absolute;
                            top: 8px;
                            left: 50%;
                            transform: translate(-50%);
                        }
                    }

                    input[type=text], input[type=password]{

                        font-size: 16px;
                        padding: 15px 15px 15px 15px;
                        border-radius: 10px;
                        border-color: $secondColor;

                        &:focus{
                            outline:solid #72ac51;
                        }

                        &:focus:invalid{
                            outline:solid red;
                        }

                        &:first-child{
                            margin-bottom: 20px;
                        }
                    }
                }

                .ForgotPassword{
                    color: rgb(74, 74, 74);
                    cursor: pointer;
                }

                .wrongEmail{
                    color:red;
                    font-weight: 600;
                }
            }
        }

        .SignInButtonPart{
            //border: solid rebeccapurple;
            margin: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            width: 200px;

            .bordure{

                border: solid $secondColor;
                padding: 5px 5px 5px 5px;
                border-radius: 20px;
                border-width: 5px;


                p{
                    font-size: 20px;
                    
                }

                button{
                background-color: $secondColor;
                border-radius: 90px;
                color: white;
                font-weight: 600;
                text-align: center;
                padding: 10px 20px 10px 20px;
                cursor: pointer;
                }

            }

                
        }
        
    }

    @media (min-width: 600px){
        .content{
            width: 45%;
            display: flex;
            margin-top: 10%;
            //border: solid blue;
        }

        .boiteblanche{
            margin-right:10%;
        }
    }
</style>