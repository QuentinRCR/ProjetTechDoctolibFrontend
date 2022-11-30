<template>
    <div class="content">
      <div class="boiteblanche">
        <h1>S'inscrire</h1>
        <div class="menu">
            <form @submit.prevent="submit" v-on:submit="SubmitForm(ClienEmail,ClientFirstName,ClientLastName,Password,PasswordConfirmation,PhoneNumber,SkypeAccount,Campus)">
                <input v-model="ClienEmail" type="text" placeholder="Email EMSE" pattern="[a-z0-9._%+-]+@[a-z0-9.-]*emse\.fr$" required><br> <!--match a emse adress-->
                <input v-model="ClientFirstName" type="text" placeholder="Prénom" required><br>
                <input v-model="ClientLastName" type="text" placeholder="Nom" required><br>
                <input v-model="Password" type="password" placeholder="Mot de passe" required><br>
                <input :pattern="Password" v-model="PasswordConfirmation" type="password" placeholder="Confirmation de mot de passe" required><br> <!--The patern is to verify that the confiramtion is equal to the original password-->
                <input v-model="PhoneNumber" type="text" placeholder="Numéro de téléphone" required><br>
                <input v-model="SkypeAccount" type="text" placeholder="Pseudo Skype         ex: live:.cd.4d256a842e696f6" pattern="live:[a-z0-9._%+-]+"><br>
                <select v-model="Campus" >
                    <option :value="null" disabled>Campus</option>
                    <option>Saint Etienne</option>
                    <option>Gardanne</option>
                </select><br>
                <input class="boutonsubmit" type="submit" value="S'inscrire">
            </form>
            <p v-if="formSubmited">Vous devez avoir reçu un mail. Veillez confirmer votre compte</p>
        </div>
      </div>
      <div class="SignInButtonPart">
        <div class="bordure">
            <p>J'ai déjà un compte</p>
            <button @click="SendToLogIn">Se connecter</button>
        </div>
      </div>
  </div>

</template>

<script>
import axios from 'axios'; 
import {API_HOST} from "../config" //to get the API path
export default {
  name: 'SignInPage',
  data: function() {
    return {
        ClientFirstName: null,
        ClientLastName: null,
        Password: null,
        PasswordConfirmation: null,
        PhoneNumber: null,
        SkypeAccount: null,
        Campus: null,
        ClienEmail:null ,
        formSubmited: false   
    }
  },
  methods: {
    async SubmitForm(ClienEmail,ClientFirstName,ClientLastName,Password,PasswordConfirmation,PhoneNumber,SkypeAccount,Campus){
      console.log("faire l'authentification"); 
      let response = await axios.post(`${API_HOST}/api/registration`,
            {
        campus: `${Campus}`,
        email: `${ClienEmail}`,
        nom: `${ClientLastName}`,
        password: `${Password}`,
        phonenumber: `${PhoneNumber}`,
        prenom: `${ClientFirstName}`,
        skypeAccount: `${SkypeAccount}`
        })
        console.log(response.data);
      this.formSubmited=true; //To display the message saying that the person received a mail to confirm its account
    },
    SendToLogIn(){
      this.$router.push("/"); //go to the login page
    }
  }
}
</script>

<style lang="scss" scoped>
    .content{
        //border: solid pink;
        margin-left: auto;
        margin-right: auto;
        align-items: center;

        .boiteblanche{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            margin-bottom: 40px;
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

                    input[type=text], input[type=password], select{

                        font-size: 16px;
                        padding: 15px 15px 15px 15px;
                        border-radius: 10px;
                        border-color: $secondColor;
                        margin-bottom: 20px;

                        &:focus{
                            outline:solid #72ac51;
                        }

                        &:focus:invalid{
                            outline:solid red;
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
                padding: 10px 10px 10px 10px;
                cursor: pointer;
                }

            }

                
        }
        
    }

    @media (min-width: 600px){
        .content{
            width: 45%;
            display: flex;
            //border: solid blue;
        }

        .boiteblanche{
            margin-right:10%;
        }
    }

</style>
