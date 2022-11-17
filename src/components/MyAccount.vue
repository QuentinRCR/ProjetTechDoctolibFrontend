<template>
  <div class="StudentArea">
    <h1>Section élève</h1>
    <div class="mainContent">
      <form  class="personalInfos" @submit.prevent="submit" v-on:submit="SubmitForm(lastName,firstName,campus,phoneNumber,skypeAccount)"> <!--form used in modify mode-->
        <div class="infoItem">
          <p  class="descrition">Nom:</p>
          <p v-if=!isInModifyMod>{{StudentData.lastName}}</p> <!--When not in modify mode, the name is simply displayed-->
          <input v-model="lastName" v-if=isInModifyMod type="text"> <!--When in modify mode, use inputs prefilled-->
        </div>
        <div class="infoItem">
          <p class="descrition">Prénom:</p>
          <p v-if=!isInModifyMod>{{StudentData.firstName}}</p>
          <input v-model="firstName" v-if=isInModifyMod type="text">
        </div>
        <div class="infoItem">
          <p class="descrition">Email:</p> <!--Email can't be changed so no input form-->
          <p>{{StudentData.email}}</p>
        </div>
        <div class="infoItem">
          <p class="descrition">Campus:</p>
          <p v-if=!isInModifyMod>{{StudentData.campus}}</p>
          <select selected={{StudentData.campus}} id="updateCampus" v-model="campus" v-if=isInModifyMod>
            <option>Saint Etienne</option>
            <option>Gardanne</option>
          </select>
        </div>
        <div class="infoItem">
          <p class="descrition">Numéro de téléphone:</p>
          <p v-if=!isInModifyMod>{{StudentData.phoneNumber}}</p>
          <input v-model="phoneNumber" v-if=isInModifyMod type="text">
        </div>
        <div class="infoItem">
          <p class="descrition">Compte Skype:</p>
          <p v-if=!isInModifyMod>{{StudentData.skypeAccount}}</p>
          <input v-model="skypeAccount" v-if=isInModifyMod type="text">
        </div>
        <input v-if=isInModifyMod class="boutonsubmit" type="submit" value="Enregistrer"> <!--to submit the form in modify mode-->
      </form>
      <button v-if=!isInModifyMod @click="toggleModifyMod">Modifier mes informations</button>
    </div>
  </div>
      
</template>

<script>
import {id_Student,API_HOST} from "../config" //to get the API path
import axios from 'axios';

export default {
    name: 'StudentArea',
    created: async function(){ //to be able to assign the fetched data to the fields
      let response = await axios.get(`${API_HOST}/api/user/${id_Student}`); //get front the API
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
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          campus: "",
          skypeAccount: ""
        },
        isInModifyMod: false, //true when in modify mode -> paragraphes are replaced by inputs
        lastName : false, //values used in the v-model for the form
        firstName : null,
        email: null,
        campus: null,
        phoneNumber: null,
        skypeAccount: null,
      }
    },
    methods: {
      toggleModifyMod(){
        this.isInModifyMod = !this.isInModifyMod
      },
      async SubmitForm(lastName,firstName,campus,phoneNumber,skypeAccount){
        let newUser = await axios.post(`${API_HOST}/api/user/modify`, //Send the resquest to the api with values defined above
        {
          lastName: `${lastName}`,
          firstName: `${firstName}`,
          email: null, //not handled in the backend
          phoneNumber: `${phoneNumber}`,
          skypeAccount: `${skypeAccount}`,
          user_role: null, //not handled in the backend
          campus: `${campus}`,
          id: `${id_Student}`
        })
        console.log("update user datas"); //post the data to the api
        this.StudentData.lastName=lastName; //assign to studentdata in order to have the visual effect without needing to fectch again
        this.StudentData.firstName=firstName;
        this.StudentData.campus=campus;
        this.StudentData.phoneNumber=phoneNumber;
        this.StudentData.skypeAccount=skypeAccount;
        this.toggleModifyMod()
      }
    }
  }
</script>

<style lang="scss" scoped>
.StudentArea{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .mainContent{
      display: flex;
      align-items: center;

      button{
        margin-left: 70px;
        background-color: $secondColor;
        color: white;
        font-size: 18px;
        border-radius: 20px;
        padding: 15px 15px 15px 15px;
      }
    .personalInfos{
      text-align: center;

      input[type="submit"] {
          font-size: 18px;
          border-radius: 10px;
          background-color: $secondColor;
          padding: 15px 15px 15px 15px;
          margin-top: 30px;
        }
      .infoItem{
        display: flex;
        font-size: 20px;
        //border: solid rebeccapurple;
        align-items: center;

        .descrition{
          margin-right: 5px;
          color: #333;
          font-weight: bold;
        }

        input[type="text"],select{
          font-size: 18px;
          border-radius: 10px;
          padding:15px 15px 15px 15px;
        }
      }
    }
  }
  
}

</style>