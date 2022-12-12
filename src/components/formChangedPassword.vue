<template>
    <div class="content">
      <div class="boiteblanche">
        <h1>Mot de passe oublié</h1>
        <div class="menu">
            <form @submit.prevent="submit" v-on:submit="SubmitForm(Password)">
                <p>Renseigner votre nouveau mot de passec ci dessous:</p>
                <input v-model="Password" type="password" placeholder="Mot de passe" required><br>
                <input :pattern="Password" v-model="PasswordConfirmation" type="password" placeholder="Confirmation de mot de passe" required><br> <!--The patern is to verify that the confiramtion is equal to the original password-->
                <input class="boutonsubmit" type="submit" value="Confirmer">
            </form>
            <p class="messageEmail" v-if="passwordChanged">Votre mot de passe a bien été changé</p>
            <p class="toLogin" @click="ToLogIn">Retour à la page de connection</p>
        </div>
      </div>
      
      
  </div>

</template>

<script>
import axios from 'axios'; 
import {API_HOST} from "../config" //to get the API path
export default {
  name: 'formChangedPassword',
  data: function() {
    return {
        ClienEmail: null,
        Password: null,
        PasswordConfirmation:null,
        passwordChanged: false,
        token:null
    }
  },
  created: async function(){
    this.token= this.$route.query.token; //we get the token back from the url
    console.log(this.token);
    let response = await axios.get(`${API_HOST}/api/forgotten_password/confirm?token=${this.token}`) //give feedback to the programme that the link was clicked
    },
  methods: {
    async SubmitForm(password){
        console.log(password);
        let response = await axios.post(`${API_HOST}/api/forgotten_password/passwordReinitialisation`,
        {
            password: `${password}`,
            token: `${this.token}`
        }) //git feedback to the programme that the link was clicked
        console.log("faire la récupération de mot de passes");
        this.passwordChanged=true
        setTimeout(() => {
            this.$router.push("/");
        }, 2000);
    },
    ToLogIn(){
        this.$router.push("/");
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
        //border: solid pink;
        font-size: 18px;
        margin: auto;
        align-items: center;
        width: 90%;

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

                    input[type=submit]{
                        margin-top: 20px;
                        background-color: $secondColor;
                        border-radius: 84px;
                        font-size: 14px;
                        color: #eee;
                        font-weight: 600;
                        padding: 15px 15px 15px 15px;
                        cursor: pointer;
                    }

                    input[type=text], input[type=password]{
                        margin-top:20px;
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

                .messageEmail{
                    font-weight: 600;
                    color: rgb(1, 100, 1);
                    text-align: center;
                }

                .toLogin{
                    font-weight: 600;
                    margin-top: 50px;
                    text-align: center;
                    cursor: pointer;
                    border: solid $secondColor;
                    border-radius: 20px;
                    padding: 10px 10px 10px 10px;
                }
            }
        }
    }


    @media (min-width: 600px){
        .content{
            width: 30%;
            display: flex;
            margin-top: 7%;
            //border: solid blue;
        }
    }

</style>
cd