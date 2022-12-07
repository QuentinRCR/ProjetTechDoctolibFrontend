<template>
    <div class="content">
      <div class="boiteblanche">
        <h1>Mot de passe oublié</h1>
        <div class="menu">
            <form @submit.prevent="submit" v-on:submit="SubmitForm">
                <p>Entrez l’email auquel vous voulez recevoir un lien pour réinitialiser votre mot de passe :</p>
                <input v-model="ClienEmail" type="text" placeholder="Email EMSE" pattern="[a-z0-9._%+-]+@[a-z0-9.-]*emse\.fr$" required><br>
                <input class="boutonsubmit" type="submit" value="Confirmer">
            </form>
            <p class="messageEmail" v-if="mailSent">Un mail vous a été envoyé pour que vous changiez votre mot de passe. Consultez votre boite mail étudiante.</p>
            <p class="toLogin" @click="ToLogIn">Retour à la page de connection</p>
        </div>
      </div>
      
      
  </div>

</template>

<script>
export default {
  name: 'LogInPage',
  data: function() {
    return {
        ClienEmail: null,
        Password: null,
        mailSent: false
    }
  },
  methods: {
    SubmitForm(name,password){
      console.log("vérifier que l'authentification est bonne");
      this.$router.push("/home");
    },
    SendToSignIn(){
      this.$router.push("/signin");
    },
    SubmitForm(){
        console.log("faire la récupération de mot de passes");
        this.mailSent=true
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