<template>
    <div class="content">
      <div class="boiteblanche">
        <h1>Se connecter</h1>
        <div class="menu">
            <form @submit.prevent="submit" v-on:submit="SubmitForm(ClienEmail,Password)">
                <input v-model="ClienEmail" type="text" placeholder="Email EMSE" required><br>
                <input v-model="Password" type="password" placeholder="Mot de passe" required><br>
                <input class="boutonsubmit" type="submit" value="Se connecter">
            </form>
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
import {API_HOST} from "../config" //to get the API path

export default {
  name: 'LogInPage',
  data: function() {
    return {
        ClienEmail: null,
        Password: null
    }
  },
  methods: {
    async SubmitForm(ClienEmail,password){
        let response = await axios.get(`${API_HOST}/api/creneaux`)
        
        /*let response = await axios.post(`${API_HOST}/api/registration`, //Send the resquest to the api with values defined above
        {
  campus: "string",
  email: "dssssssssseee",
  nom: "string",
  password: "string",
  phonenumber: "string",
  prenom: "string",
  skypeAccount: "string"
})*/
        /*let response = await axios.post(`${API_HOST}/api/login`, //Send the resquest to the api with values defined above
        {
            email: `${ClienEmail}`,
            password: `${password}`,
            
            })*/
      let slots = response.data;
      this.slots = slots;
      console.log(this.slots);
      console.log("vérifier que l'authentification est bonne");
      this.$router.push("/home");
    },
    SendToSignIn(){
      this.$router.push("/signin");
    },
    ForgotPassword(){
        this.$router.push("/forgetpw");
    }
  }
}
</script>

<style lang="scss" scoped>
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;

        .boiteblanche{
            display: flex;
            flex-direction: column;
            align-items: center;

            h1{
                font-size: 35px;
                font-weight: 400;
            }
    

            .menu{

                form{
                    display: flex;
                    flex-direction: column ;
                    align-items: center;

                    input[type=submit]{
                        margin-top: 20px;
                        background-color: $secondColor;
                        border-radius: 84px;
                        font-size: 14px;
                        color: #eee;
                        font-weight: 600;
                        padding: 15px 15px 15px 15px;
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
            }
        }

        .SignInButtonPart{
            //border: solid rebeccapurple;
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
                height: 45px;
                border-radius: 90px;
                color: white;
                font-weight: 600;
                text-align: center;
                padding: 10px 20px 10px 20px;
                }

            }

                
        }
        
    }

</style>
cd