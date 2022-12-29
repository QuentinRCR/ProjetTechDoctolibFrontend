<template>
  <div>
    <div class="StudentArea">
      <h1 v-if="!this.viewInfoOthers">Mes informations</h1>
      <h1 v-if="this.viewInfoOthers">Informations {{StudentData.firstName}} {{StudentData.lastName}} </h1>
      <div class="mainContent">
        <div v-if="!viewInfoOthers" class="fillInDiv"></div>
        <form  class="personalInfos" @submit.prevent="submit" v-on:submit="SubmitForm(lastName,firstName,campus,phoneNumber,skypeAccount,Password)"> <!--form used in modify mode-->
          <div class="infoItem">
            <p  class="descrition">Nom</p>
            <p class="info" v-if=!isInModifyMod>{{StudentData.lastName}}</p> <!--When not in modify mode, the name is simply displayed-->
            <input v-model="lastName" v-if=isInModifyMod type="text" required> <!--When in modify mode, use inputs prefilled-->
          </div>
          <div class="infoItem">
            <p class="descrition">Prénom</p>
            <p class="info" v-if=!isInModifyMod>{{StudentData.firstName}}</p>
            <input v-model="firstName" v-if=isInModifyMod type="text" required>
          </div>
          <div class="infoItem">
            <p class="descrition">Email</p> <!--Email can't be changed so no input form-->
            <p class="info" >{{StudentData.email}}</p>
          </div>
          <div class="infoItem">
            <p class="descrition">Campus</p>
            <p class="info" v-if=!isInModifyMod>{{StudentData.campus}}</p>
            <select selected={{StudentData.campus}} id="updateCampus" v-model="campus" v-if=isInModifyMod>
              <option>Saint Etienne</option>
              <option>Gardanne</option>
            </select>
          </div>
          <div class="infoItem">
            <p class="descrition">Numéro de téléphone</p>
            <p class="info" v-if=!isInModifyMod>{{StudentData.phoneNumber}}</p>
            <input v-model="phoneNumber" pattern="^(?:(?:\+|00)[1-9][1-9]|0)\s*[1-9](?:[\s.-]*\d{2}){4}$" v-if=isInModifyMod type="text" required>
          </div>
          <div class="infoItem">
            <p class="descrition">Compte Skype</p>
            <p class="info" v-if=!isInModifyMod>{{StudentData.skypeAccount}}</p>
            <input v-model="skypeAccount" v-if=isInModifyMod type="text" placeholder="Pseudo Skype         ex: live:.cd.4d256a842e696f6 ou bob36">
          </div>
          <div class="infoItem" v-if="this.modifyPasswordMod">
            <p class="descrition">Nouveau mot de passe</p>
            <input v-model="Password" type="password" required>
          </div>
          <div class="infoItem" v-if="this.modifyPasswordMod">
            <p class="descrition">Confirmation de mot de passe</p>
            <input :pattern="Password" v-model="PasswordConfirmation" type="password" required>
          </div>
          <input v-if=isInModifyMod class="boutonsubmit" type="submit" value="Enregistrer"> <!--to submit the form in modify mode-->
        </form>
        <button class="modifyInfos" v-if="(!isInModifyMod && !this.viewInfoOthers)" @click="toggleModifyMod">Modifier mes informations</button>
        <button class="modifyPw" @click="toogleModifyPwMode" v-if=isInModifyMod >{{ modifyPasswordMod ? 'Ne pas modifier mon mot de passe' : 'Modifier mon mot de passe' }}</button>
      </div>
      <button class="deleteAcount" v-if="((!isInModifyMod) && (!this.viewInfoOthers) && !(this.$store.state.auth == 'ADMIN'))" @click="toggleAccountPopup">Supprimer mon compte</button>
    </div>

    <div v-if="enableDeleteAccountPopup" class="ConfirmationDelete"> <!--popup to delete the account-->
      <div>&#0202tes-vous sûr de vouloir supprimer votre compte. Cette action est irréversible. Vos informations personnelles et tous vos rendez-vous seront supprimés</div>
      <div class="buttons">
        <div @click="deleteAccount" class="deletebutton">Supprimer</div>
        <div @click="toggleAccountPopup" class="cancelbutton">Annuler</div>
      </div>
    </div>
  </div>
  
      
</template>

<script>
import {API_HOST} from "../config" //to get the API path
import axios from 'axios';

export default {
    name: 'StudentArea',
    props:['studentInfos'],
    created: async function(){ //to be able to assign the fetched data to the fields
      if(this.studentInfos!=null){ //if it is used to display infos of a student
        this.viewInfoOthers=true;
      }

      let response;
      if(this.viewInfoOthers){  //if is used to view datas of others
        response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/users/admin/submit/${this.studentInfos}`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}}); //get front the API
        this.$emit('reset_studentInfos') //to put studentInfos to 0 again
      }
      else{ //if in normal mod
        response = await axios.get(`${import.meta.env.VITE_APP_API_HOST}/api/users/user/getbyId`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}}); //get front the API
      }
      this.StudentData = response.data; //assign the data
      this.lastName=this.StudentData.lastName //update values for the form mod
      this.firstName=this.StudentData.firstName,
      this.campus=this.StudentData.campus,
      this.phoneNumber=this.StudentData.phoneNumber,
      this.skypeAccount=this.StudentData.skypeAccount
    },
    data: function() {
      return {
        StudentData: { 
          id: 1, //json containing student datas before real data is loaded
          firstName: "firstName",
          lastName: "lastName",
          email: "email@etu.emse.fr",
          phoneNumber: "0659862879",
          campus: "Saint Etienne",
          skypeAccount: ""
        },
        isInModifyMod: false, //true when in modify mode -> paragraphes are replaced by inputs
        lastName : null, //values used in the v-model for the form
        firstName : null,
        email: null,
        campus: null,
        phoneNumber: null,
        skypeAccount: null,
        PasswordConfirmation: null,
        Password: null,
        modifyPasswordMod: false,
        viewInfoOthers: false, //when admin view the infos of a user
        enableDeleteAccountPopup: false
      }
    },
    methods: {
      toggleModifyMod(){
        this.isInModifyMod = !this.isInModifyMod
      },
      async SubmitForm(lastName,firstName,campus,phoneNumber,skypeAccount,Password){
        let newUser = await axios.post(`${import.meta.env.VITE_APP_API_HOST}/api/users/user/modify`, //Send the resquest to the api with values defined above
        {
          lastName: `${lastName}`,
          firstName: `${firstName}`,
          email: null, //not handled in the backend
          phoneNumber: `${phoneNumber}`,
          skypeAccount: `${skypeAccount}`,
          user_role: null, //not handled in the backend
          campus: `${campus}`,
          id: null,
          password: `${Password}`
        },{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}})
        console.log("update user datas"); //post the data to the api
        this.StudentData.lastName=lastName; //assign to studentdata in order to have the visual effect without needing to fectch again
        this.StudentData.firstName=firstName;
        this.StudentData.campus=campus;
        this.StudentData.phoneNumber=phoneNumber;
        this.StudentData.skypeAccount=skypeAccount;
        this.modifyPasswordMod=false;
        this.toggleModifyMod()
      },
      toogleModifyPwMode(){
        this.modifyPasswordMod = !this.modifyPasswordMod
      },
      async deleteAccount(){
        await axios.delete(`${import.meta.env.VITE_APP_API_HOST}/api/users/user`,{headers: {'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}`}})
        this.toggleAccountPopup();
        setTimeout(() => { //after 1 second, send to login page
          this.$router.push("/");
        }, 1000);
      },
      toggleAccountPopup(){
        this.enableDeleteAccountPopup=!this.enableDeleteAccountPopup;
      }
    }
  }
</script>

<style lang="scss" scoped>
@media (min-width: 600px){
  .mainContent{
    display: flex;
    align-items: center;
    justify-content: center;

    .modifyInfos{
      margin-left: 100px;
      margin-right: 10px;
    }

    .modifyPw{
      margin-left: 100px;
      margin-right: 10px;
    }
    
    .fillInDiv{
      width:260px;
    }

    .infoItem{  
    }

    input[type="text"],input[type="password"],select{
      width: 480px !important;
      margin: 0;
    }
  }
  
}

@media (min-width:600px) and (max-width:920px) { //intermediary format
    .mainContent{
      flex-direction:column;
    }

    .modifyPw, .modifyInfos{
      margin-left:0 !important;
      margin-right: 0 !important;
    }
}

.StudentArea{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .mainContent{
      width: 100%;
      //border: solid blue;
      align-items: center;
      text-align: center;

      .modifyInfos{
        background-color: $secondColor;
        color: white;
        font-size: 18px;
        border-radius: 20px;
        padding: 15px 15px 15px 15px;
        cursor: pointer;
        width: 150px;

        &:hover {
          background-color: $secondColorLighter;
        }
      }

      .modifyPw{
        margin-top:30px;
        background-color: rgb(153, 10, 10);
        font-size: 18px;
        border-radius: 20px;
        padding: 15px 15px 15px 15px;
        color: white;
        width: 150px;
        cursor: pointer;

        &:hover {
          background-color: rgba(153, 10, 10, 0.808);
        }
      }

    .personalInfos{
      //border: solid brown;
      text-align: center;

      input[type="submit"] {
          font-size: 18px;
          border-radius: 10px;
          background-color: $secondColor;
          padding: 15px 15px 15px 15px;
          margin-top: 10px;
          cursor: pointer;

          &:hover {
            background-color: $secondColorLighter;
          }
      }

      .infoItem{
        font-size: 18px;
        //border: solid rebeccapurple;
        margin-bottom: 5px;

        .descrition{
          //border: solid pink;
          color: #333;
          font-weight: bold;
          margin: 0;
          margin-bottom:7px;
          font-size: 20px;
        }

        .info{
          margin-top: 0;
          margin-bottom: 20px;
          font-size:20px;
          //border: solid blue;
        }

        input[type="text"],input[type="password"],select{
          font-size: 18px;
          border-radius: 10px;
          padding:10px 10px 10px 10px;
          margin-bottom: 20px;
          width: 90%;

          &:focus{
            outline:solid #72ac51;
          }

          &:focus:invalid{
            outline:solid red;
          }
         }
      }
    }
  }

  .deleteAcount{
    margin-top: 70px;
    background-color: rgb(153, 10, 10);
    font-size: 18px;
    border-radius: 20px;
    padding: 15px 15px 15px 15px;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: rgba(153, 10, 10, 0.808);
    }
  }
  
}

.ConfirmationDelete {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 8px solid rgb(215, 61, 61);
  border-radius: 20px;
  font-size: 20px;
  padding: 25px 25px 25px 25px;
  font-weight: bold;
  width: 250px;
  text-align: center;

  .buttons {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;

    .deletebutton {
      color: white;
      border-radius: 10px;
      background-color: rgb(215, 61, 61);
      padding: 8px 8px 8px 8px;
      cursor: pointer;
    }

    .cancelbutton {
      color: white;
      border-radius: 10px;
      background-color: $secondColor;
      padding: 8px 8px 8px 8px;
      cursor: pointer;

    }
  }
}



</style>