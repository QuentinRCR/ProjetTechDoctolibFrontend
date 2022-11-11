<template>
    <div class="content">
      <div class="boiteblanche">
        <h1>Mot de passe oublié</h1>
        <div class="menu">
            <form @submit.prevent="submit" v-on:submit="SubmitForm">
                <p>Entrez l’email auquel vous voulez recevoir un lien pour réinitialiser votre mdp :</p>
                <input v-model="ClienEmail" type="text" placeholder="Email EMSE" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.emse.fr$" required><br>
                <input class="boutonsubmit" type="submit" value="Confirmer">
            </form>
            <p class="messageEmail" v-if="mailSent">Un mail vous a été envoyé pour que vous changiez votre mot de passe. Consultez votre boite mail étudiante</p>
            <button @click="ToLogIn">Retour à la page de connection</button>
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
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -65%);
        display: flex;

        .boiteblanche{
            //border: solid red;
            background-color: white;
            width: 570px;

            h1{
                font-size: 50px;
                font-weight: 400;
                padding-left: 60px;
                margin-left: 10px;
            }
    

            .menu{
                padding-left: 60px;
                width: 450px;
                display: flex;
                flex-direction: column;

                form{
                    display: flex;
                    flex-direction: column ;
                    

                    p{
                        font-size: 20px;
                    }

                    input[type=submit]{
                        margin-top: 20px;
                        background-color: $secondColor;
                        border-radius: 84px;
                        height: 42px;
                        font-size: 14px;
                        color: #eee;
                        font-weight: 600;
                    }

                    input[type=text], input[type=password]{

                        height: 45px;
                        font-size: 16px;
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
                    font-size: 20px;
                    color: red;
                    text-align: center;
                }

                button{
                    margin-top: 70px;
                    background-color: $secondColor;
                    color: white;
                    font-size: 20px;
                    border-radius: 20px;
                    padding: 10px 10px 10px 10px ;
                    justify-content: center;
                }
            }
        }

        
    }

</style>
cd