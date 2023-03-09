<template>
  <div class="wrappingDiv">

    <div class="content">
      <div class="fillInDiv"></div>
      <div class="boiteblanche">
        <h1>Se connecter</h1>
        <div class="menu">
          <form @submit.prevent="submit" v-on:submit="SubmitForm(ClienEmail, Password)">
            <input class="email" v-model="ClienEmail" type="text" placeholder="Email EMSE" required><br>
            <div class="passwordPart">
              <input id="passwordField" v-model="Password" type="password" placeholder="Mot de passe" required>
              <div class="eyeIconContainer">
                <img @click="togglePasswordView" id="EyeIcon" src="/src/assets/eye.png"
                                                 alt="eye icon">
                <div class="crossOnEye" v-if="!passwordViewToggled"></div>
              </div>
            </div>
            <div class="submitpart">
              <input class="boutonsubmit roundButton" type="submit" value="Se connecter" :style="{
                            color: submitClicked ? '#3694c6' : 'white' //when the button is clicked, we hide the connection button
                        }">
              <div v-if="submitClicked" class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </form>
          <p class="wrongEmail" v-if="this.incorrectPassword">L'email ou le mot de passe saisi n'est pas correct
          </p>
          <p class="ForgotPassword" @click="ForgotPassword">Mot de passe oublié</p>
        </div>
      </div>
      <div class="SignInButtonPart">
        <div class="bordure">
          <p>Je n'ai pas encore de compte</p>
          <button class="roundButton" @click="SendToSignIn">S'inscrire</button>
        </div>
      </div>


    </div>
    <p class="legalNotice" @click="legalNotice">Mention légales</p>
  </div>
</template>

<script>
import axios from 'axios';
import {timeBetweenRefreshs} from "../config" //to get the API path
import VueJwtDecode from 'vue-jwt-decode'; //to decode Jwt token

export default {
  name: 'LogInPage',
  data: function () {
    return {
      ClienEmail: null,
      Password: null,
      incorrectPassword: false,
      submitClicked: false,
      passwordViewToggled: false
    }
  },
  methods: {
    async SubmitForm(ClienEmail, password) {
      if (!this.submitClicked) { //to prevent spamming
        this.submitClicked = true; //to display the loading animation
        var data = new FormData(); //so that the backend understand the data correctly
        data.append('email', `${ClienEmail}`)
        data.append('password', `${password}`)
        this.submitClicked = true; //add the loading annimation
        try {
          //create a request to get acces and authentification tokens
          let response = await axios.post(`${import.meta.env.VITE_APP_API_HOST}/api/login`, data)
          const token = response.data.access_token;

          let refresh_token = response.data.refresh_token;
          this.$store.commit('set', {token: `${token}`}) //set the value of the token to a global state
          this.$store.commit('setAuth', {auth: `${VueJwtDecode.decode(token).roles[0]}`}) //Set the role as a global variable
          this.$store.commit('setRefTok', {refresh_token: `${refresh_token}`}) ////Set the refresh token
          this.$router.push({path: 'home', query: {token: `${token}`, refresh_token: `${refresh_token}`}}) //change path and add token to url
          this.$store.commit('setRefreshFunction', {refresh_token_function: setInterval(() => this.refreshToken(), timeBetweenRefreshs)}) //Set the function to periodicaly reset the token
        } catch (error) {
          this.incorrectPassword = true;
          this.submitClicked = false;
        }
        ;
      }


    },
    SendToSignIn() {
      this.$router.push("/signin");
    },
    ForgotPassword() {
      this.$router.push("/forgetpw");
    },
    async refreshToken() { //get a new tokens, update the url and global variables
      let response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/token/refresh`, {headers: {'AUTHORIZATION': `Bearer ${this.$store.state.refreshToken}`}}); //get slots from the API
      this.$store.commit('set', {token: `${response.data.access_token}`}) //set the value of the token to a global state
      this.$store.commit('setRefTok', {refresh_token: `${response.data.refresh_token}`}) ////Set the refresh token
      this.$router.push({
        path: 'home',
        query: {token: `${response.data.access_token}`, refresh_token: `${response.data.refresh_token}`}
      }) //change path and add token to url
      console.log("token mis à jour");
    },
    legalNotice() {
      this.$router.push("/legalNotice");
    },
    //toggles the possibility to see the password or not
    togglePasswordView() {
      this.passwordViewToggled = !this.passwordViewToggled
      if (this.passwordViewToggled) {
        document.getElementById("passwordField").type = "text"; //use vanilla js because of an issue with :type="[object Object]"
      } else {
        document.getElementById("passwordField").type = "password";
      }

    }
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 600px) { //for desktop format
  .content {

    display: flex;
    flex-direction: row !important;
    justify-content: center;
    margin-top: 10%;

    .SignInButtonPart {
      margin-left: 70px;
      margin-right: 10px;
    }
  }

  .boiteblanche {
    width: 500px !important;
  }

  .fillInDiv {
    width: 180px;
    margin-right: 80px; // to compensate the margin left and right on the sign in button part
  }

  .legalNotice {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
  }


}


@media (min-width: 600px) and (max-width: 920px) { //intermediary format
  .content {
    flex-direction: column !important;
  }

  .legalNotice {
    position: relative !important;
  }

  .fillInDiv {
    display: none;
  }

  .SignInButtonPart {
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
}


//phone format
.wrappingDiv {
  position: absolute;
  height: 100%
}

.content {
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: column;

  .boiteblanche {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;

    h1 {
      font-size: 35px;
      font-weight: 400;
    }


    .menu {
      width: 100%;

      form {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .passwordPart {
          display: flex;
          align-items: center;
          border-radius: 10px;
          border: solid $secondColor;

          &:focus-within {
            outline: solid $secondColorDarker;
          }

          #passwordField {
            //left: 0;
            //right: 0;
            width: 100%;
            font-size: 16px;
            height: 100%;
            padding: 15px 15px 15px 15px;
            border: none;
            border-radius: 15px; //to prevent weird visual existent border

            &:focus {
              outline: none;
            }
          }

          .eyeIconContainer{
            position: relative;
            display: flex;
            align-items: center;

            #EyeIcon {
              margin-right: 15px;
              cursor: pointer;
            }

            .crossOnEye{
              position: absolute;
              //top:0;
              bottom: 14px;
              left:0;
              right: 15px;
              height: 2.5px;
              background-color: #0a0a0a;
              transform: rotate(-45deg);
              pointer-events: none; //prevents any interaction with the pointer
            }
          }


        }

        .email {

          font-size: 16px;
          padding: 15px 15px 15px 15px;
          border-radius: 10px;
          border: solid $secondColor;

          &:first-child {
            margin-bottom: 20px;
          }

          &:focus {
            outline: solid $secondColorDarker;
          }
        }

        .submitpart {
          display: flex;
          position: relative;
          flex-direction: column;

          input[type=submit] {
            margin-top: 20px;
          }

          .lds-ellipsis {
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translate(-50%);
          }
        }
      }

      .ForgotPassword {
        color: rgb(74, 74, 74);
        cursor: pointer;
      }

      .wrongEmail {
        color: red;
        font-weight: 600;
      }
    }
  }

  .SignInButtonPart {
    text-align: center;
    width: 180px;
    margin-top: 40px;;

    .bordure {

      border: solid $secondColor;
      padding: 5px 5px 5px 5px;
      border-radius: 20px;
      border-width: 5px;


      p {
        font-size: 20px;

      }

      button {
      }

    }


  }

}

.legalNotice {
  margin-top: 50px;
  text-align: center;
  color: #444;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}


</style>