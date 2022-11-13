<template>
  <div class="StudentArea">
    <h1>Section élève</h1>
    <div class="mainContent">
      <form class="personalInfos" @submit.prevent="submit" v-on:submit="SubmitForm(lastName,firstName,email,campus,phoneNumber,skypeAccount)">
        <div class="infoItem">
          <p  class="descrition">Nom:</p>
          <p v-if=!isInModifyMod>{{StudentData.lastName}}</p>
          <input v-model="lastName" v-if=isInModifyMod type="text">
        </div>
        <div class="infoItem">
          <p class="descrition">Prénom:</p>
          <p v-if=!isInModifyMod>{{StudentData.firstName}}</p>
          <input v-model="firstName" v-if=isInModifyMod type="text">
        </div>
        <div class="infoItem">
          <p class="descrition">Email:</p>
          <p v-if=!isInModifyMod>{{StudentData.email}}</p>
          <input v-model="email" v-if=isInModifyMod type="text">
        </div>
        <div class="infoItem">
          <p class="descrition">Campus:</p>
          <p v-if=!isInModifyMod>{{StudentData.campus}}</p>
          <input v-model="campus" v-if=isInModifyMod type="text">
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
        <input v-if=isInModifyMod class="boutonsubmit" type="submit" value="Enregistrer">
      </form>
      <button v-if=!isInModifyMod @click="toggleModifyMod">Modifier mes informations</button>
    </div>
  </div>
      
</template>

<script>
import { f } from 'v-cal-input';

export default {
    name: 'StudentArea',
    data: function() {
      return {
        StudentData: {
          id: 1,
          firstName: "Quentin",
          lastName: "REY",
          email: "quentin.rey@etu.emse.fr",
          phoneNumber: "0565986535",
          campus: "Saint Etienne",
          skypeAccount: "live:56632625"
        },
        isInModifyMod: false,
        name: null
      }
    },
    components: {
    },
    methods: {
      toggleModifyMod(){
        this.isInModifyMod = !this.isInModifyMod
      },
      SubmitForm(lastName,firstName,email,campus,phoneNumber,skypeAccount){
        console.log("update user datas");
        this.toggleModifyMod()
        this.StudentData.lastName=lastName;
        this.StudentData.firstName=firstName;
        this.StudentData.email=email;
        this.StudentData.campus=campus;
        this.StudentData.phoneNumber=phoneNumber;
        this.StudentData.skypeAccount=skypeAccount;
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

      input[type="submit"]{
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

        input[type="text"]{
          font-size: 18px;
          border-radius: 10px;
          padding: 0 0 0 0;
        }
      }
    }
  }
  
}

</style>