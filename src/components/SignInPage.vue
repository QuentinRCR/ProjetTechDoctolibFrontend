<template>
    <div class="content">
      <div class="boiteblanche">
        <h1>S'inscrire</h1>
        <div class="menu">
            <form @submit.prevent="submit" v-on:submit="SubmitForm(ClienEmail,ClientFirstName,ClientLastName,Password,PasswordConfirmation,PhoneNumber,SkypeAccount,Campus)">
                <input v-model="ClienEmail" type="text" placeholder="Email EMSE" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.emse.fr$" required><br>
                <input v-model="ClientFirstName" type="text" placeholder="Prénom" required><br>
                <input v-model="ClientLastName" type="text" placeholder="Nom" required><br>
                <input v-model="Password" type="password" placeholder="Mot de passe" required><br>
                <input v-model="PasswordConfirmation" type="password" placeholder="Confirmation de mot de passe" required><br>
                <input v-model="PhoneNumber" type="text" placeholder="Numéro de téléphone" required><br>
                <input v-model="SkypeAccount" type="text" placeholder="Compte Skype"><br>
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
    SubmitForm(ClienEmail,ClientFirstName,ClientLastName,Password,PasswordConfirmation,PhoneNumber,SkypeAccount,Campus){
      console.log("faire l'authentification"); 
      this.formSubmited=true;
    },
    SendToLogIn(){
      this.$router.push("/");
    }
  }
}
</script>

<style lang="scss" scoped>

    .content{
        display: flex;
        justify-content: center;

        .boiteblanche{
            background-color: white;
            width: 570px;

            h1{
                font-size: 50px;
                font-weight: 400;
                padding-left: 60px;
                margin-left: 100px;
            }
        }

        .menu{
            padding-left: 60px;

            form{
                display: flex;
                flex-direction: column ;
                width: 450px;

                input[type=submit]{
                    margin-top: 20px;
                    background-color: $secondColor;
                    border-radius: 84px;
                    height: 42px;
                    font-size: 14px;
                    color: #eee;
                    font-weight: 600;
                }

                input[type=text], input[type=password], select{

                    height: 45px;
                    font-size: 16px;
                    border-radius: 10px;
                    border-color: black;
                    margin-bottom: 10px;
                    padding-left: 10px;

                    &:focus{
                        outline:solid #72ac51;
                    }

                    &:focus:invalid{
                        outline:solid red;
                    }
                }
            }

            p{
                color: green;
                font-weight: 600;
                font-size: 20px;
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
                margin-top: 80px;
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
