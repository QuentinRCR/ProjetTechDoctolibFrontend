<template>
<div class="makeApp">
    <h1>Prendre rendez-vous</h1>
    
    <!--<v-date-picker v-model="date" :valid-hours="[0,3,4,5,8,16,20]" is24hr />-->
    <form @submit.prevent="submit" v-on:submit="SubmitForm(CommunicationMean,date)">
        <div class="dateselectorslot">
            <p class="">Date et Heure</p>
            <div class="datepicker"><Datepicker v-model="date"></Datepicker></div>
        </div>
        <select v-model="CommunicationMean" >
            <option :value="null" disabled>Moyen de communication</option>
            <option>Skype</option>
            <option>Whatsapp</option>
        </select><br>
        <input class="boutonsubmit" type="submit" value="Prendre rendez-vous">
    </form>
</div>    


</template>

<script>
import VueCal from 'vue-cal'
import DatePicker from 'v-cal-input'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'SignInPage',
  data: function() {
    return {
        CommunicationMean: null,
        date: null
    }
  },
  components: {
    VueCal,
    Datepicker 
  },
  methods: {
    SubmitForm(CommunicationMean,Date){
      console.log("faire la prise de rendez-vous"); 
      console.log(`${Date}`);
      this.$emit('close-popup');
    }
  }
}
</script>

<style lang="scss" scoped>

.makeApp{
    border: solid #3694c6;
    border-radius: 20px;
    width: 300px;
    padding: 20px 20px 20px 20px;
    
    h1{
        margin-top: 0;
        text-align: center;
    }


    form{
        display: flex;
        flex-direction: column ;
        

        

        .dateselectorslot{
            display: flex;
            border:solid #3694c6;
            justify-content: center;
            height: 41px;
            margin-bottom: 20px;
            border-radius: 20px;
            padding: 5px 5px 5px 5px;
            .datepicker{
            display: flex;
            margin-bottom: 20px;
            height: 40px;
            align-items: center;
            margin-left: 5px;
            }

            p{
            font-size: 20px;
            font-weight: 600;
            margin-top: 0;
            height: 40px;
            display: flex;
            align-items: center;
            text-align: center;
            }
        }
        

        input[type=submit]{
            margin-top: 20px;
            background-color: #3694c6;
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
}

</style>
