<template>
    <!--This template is used to create and to modify a slot. When enableModifyModSlot is true it it the modify module that is displayed-->
    <div class="makeApp">
        <div class="croix" @click="closePopup">&#10006</div>
        <h1 v-if=!enableModifyModSlot>Ajouter un créneau</h1>
        <h1 v-if=enableModifyModSlot>Modifier le créneau</h1>

        <!--<v-date-picker v-model="date" :valid-hours="[0,3,4,5,8,16,20]" is24hr />-->
        <form @submit.prevent="submit" v-on:submit="SubmitForm(day, dateSlot, timeSlotStart, timeSlotEnd)">
            <div class="timesection">
                <div class="dateselectorslot">
                    <p>Plage de jours</p>
                    <div class="datepicker">
                        <Datepicker :month-change-on-scroll="false" v-model="dateSlot" inline required autoApply
                            closeOnScroll utc="preserve" range :enableTimePicker="false"></Datepicker>
                    </div>
                    <p class="errorMessage" v-if="this.isDateSelected">Veillez selectionner<br>une plage de jours</p>
                </div>
                <div class="timeSelectorWrapper">
                    <div class="timeselectorslot">
                        <p class="">De</p>
                        <div class="datepicker">
                            <Datepicker :startTime="startTimeee" modeHeight="150" required autoApply inline
                                v-model="timeSlotStart" minutesIncrement="30" minutesGridIncrement="30"
                                hoursGridIncrement="4" timePicker></Datepicker>
                        </div>
                    </div>
                    <div class="timeselectorslot">
                        <p class="">&#0192</p> <!-- it is a capital à-->
                        <div class="datepicker">
                            <Datepicker :startTime="startTimeee" modeHeight="150" required autoApply inline
                                v-model="timeSlotEnd" minutesIncrement="30" minutesGridIncrement="30"
                                hoursGridIncrement="4" timePicker></Datepicker>
                        </div>
                    </div>
                    <p v-if="!this.areTimesInTheRightOrder">L'heure de début ne peut pas être<br> après celle de fin</p>
                </div>
            </div>
            <div class="dayArea"> <!--Checkboxs with all the days-->
                <p>Jours</p>
                <div class="dayList">
                    <div class="listItem">
                        <input type="checkbox" class="checkbox" value="Lundi" v-model="day">
                        <label for="Lundi">Lundi</label>
                    </div>
                    <div class="listItem">
                        <input type="checkbox" class="checkbox" value="Mardi" v-model="day">
                        <label for="Mardi">Mardi</label>
                    </div>
                    <div class="listItem">
                        <input type="checkbox" class="checkbox" value="Mercredi" v-model="day">
                        <label for="Mercredi">Mercredi</label>
                    </div>
                    <div class="listItem">
                        <input type="checkbox" class="checkbox" value="Jeudi" v-model="day">
                        <label for="Jeudi">Jeudi</label>
                    </div>
                    <div class="listItem">
                        <input type="checkbox" class="checkbox" value="Vendredi" v-model="day">
                        <label for="Vendredi">Vendredi</label>
                    </div>
                    <div class="listItem">
                        <input type="checkbox" class="checkbox" value="Samedi" v-model="day">
                        <label for="Samedi">Samedi</label>
                    </div>
                    <div class="listItem">
                        <input type="checkbox" class="checkbox" value="Dimanche" v-model="day">
                        <label for="Dimanche">Dimanche</label>
                    </div>
                </div>
            </div>

            <div class="submitpart">
                <input class="boutonsubmit" type="submit" value="Ajouter le créneau" :style="{
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
        <p @click="displayCommMeanForm" class="ModifyComMean">Modifier les moyens de communications</p>
        <div v-if="changeCommunicationMean" class="addCommunicationMeans">
            <button @click="delectAllCommunicationMean">Supprimer tous les<br> moyens de communication</button>
            <form @submit.prevent="submit" v-on:submit="AddCommunicationMean(comMean)">
                <input type="text" v-model="comMean" required>
                <input class="boutonsubmit" type="submit" value="Ajouter le moyen de communication">
            </form>
        </div>
    </div>


</template>

<script>
import { API_HOST } from "../config" //to get the API path
import axios from 'axios';
import Datepicker from '@vuepic/vue-datepicker';
//import {fr} from 'vuejs-datepicker/dist/locale'
import '@vuepic/vue-datepicker/dist/main.css' //to make datepicker work
import { ref } from 'vue'; //used in setup


export default {
    name: 'SignInPage',
    props: ['enableModifyModSlot', "SlotChoice"], //to be able to display the correct thing depending if it is modifying mode or not
    data: function () {
        return {
            day: [],
            dateSlot: null,
            timeSlotStart: new Proxy({ hours: 12, minutes: 0, seconds: 0 }, {}), //to initialise the time to 12:00 since it is what is displayed by default
            timeSlotEnd: new Proxy({ hours: 12, minutes: 0, seconds: 0 }, {}), //to initialise the time to 12:00 since it is what is displayed by default
            areTimesInTheRightOrder: true,
            isDateSelected: false,
            submitClicked: false,
            comMean: null,
            changeCommunicationMean: false
        }
    },
    setup: function () {   //to initialise the array with allowed dates
        const startTimeee = ref({ hours: 12, minutes: 0 }); //start of the time in the time selector

        return {
            startTimeee
        }
    },
    components: {
        Datepicker
    },
    methods: {
        async SubmitForm(day, dateSlot, timeSlotStart, timeSlotEnd) {
            if (!this.submitClicked) {//to prevent spamming
                this.submitClicked = true;
                let startTime = ("0" + timeSlotStart.hours).slice(-2) + ":" + ("0" + timeSlotStart.minutes).slice(-2) + ":" + ("0" + timeSlotStart.seconds).slice(-2); //Extract start and end time from proxy
                let endTime = ("0" + timeSlotEnd.hours).slice(-2) + ":" + ("0" + timeSlotEnd.minutes).slice(-2) + ":" + ("0" + timeSlotEnd.seconds).slice(-2); //Formated to hh:mm:ss

                if (startTime < endTime && dateSlot != null) { //check that the dates are in the right order
                    let startDate = dateSlot[0].slice(0, -14); //Extract start and end date from proxy
                    let endDate = dateSlot[1].slice(0, -14);

                    let daysList = [] //Extract days from proxy and translate them
                    for (let i = 0; i < day.length; i++) {
                        switch (day[i]) {
                            case "Lundi":
                                daysList[daysList.length] = "MONDAY";
                                break;
                            case "Mardi":
                                daysList[daysList.length] = "TUESDAY";
                                break;
                            case "Mercredi":
                                daysList[daysList.length] = "WEDNESDAY";
                                break;
                            case "Jeudi":
                                daysList[daysList.length] = "THURSDAY";
                                break;
                            case "Vendredi":
                                daysList[daysList.length] = "FRIDAY";
                                break;
                            case "Samedi":
                                daysList[daysList.length] = "SATURDAY";
                                break;
                            case "Dimanche":
                                daysList[daysList.length] = "SUNDAY";
                                break;
                            default:
                                console.log("the switch to translate days has a problem");
                        }
                    }

                    let idSlot;
                    if (this.enableModifyModSlot) { //set idSlot if in modify mode
                        idSlot = this.SlotChoice.id
                    }
                    else {
                        idSlot = null;
                    }

                    
                    let newSlot = await axios.post(`${API_HOST}/api/creneaux/admin/create_or_modify`, //Send the resquest to the api with values defined above
                        {
                            id: idSlot,
                            dateDebut: `${startDate}`,
                            dateFin: `${endDate}`,
                            jours: daysList,
                            heuresDebutFin: [
                                {
                                    idPlage: null,
                                    idCreneaux: 1000,
                                    tempsDebut: `${startTime}`,
                                    tempsFin: `${endTime}`
                                }
                            ]
                        }, { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } })
                    this.$emit('close-popup');
                    this.$emit('reload'); //for the reload of the page to have the correct appointement
                    
                }
                else {
                    if (dateSlot == null) {
                        this.isDateSelected = true;
                    }
                    if (startTime >= endTime) {
                        this.areTimesInTheRightOrder = false;
                    }
                }
                this.submitClicked = false;
            }
        },
        closePopup() { //for the cross
            this.$emit('close-popup');
        },
        async AddCommunicationMean(comm) { //post a new communication mean
            let newSlot = await axios.post(`${API_HOST}/api/communicationMean/admin/create_or_modify`,
                {
                    communicationMean: `${comm}`
                },
                { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } })
            this.closePopup();
        },
        async delectAllCommunicationMean() {
            console.log("aa");
            await axios.delete(`${API_HOST}/api/communicationMean/admin/`,
                { headers: { 'AUTHORIZATION': `Bearer ${this.$store.state.generalToken}` } });
            this.closePopup();
        },
        displayCommMeanForm() {
            console.log("aa");
            this.changeCommunicationMean = !this.changeCommunicationMean;
        }
    }
}
</script>

<style lang="scss" scoped>
.makeApp {
    background-color: white;
    border: solid $secondColor;
    border-radius: 20px;
    padding: 20px 20px 20px 20px;
    position: relative;

    h1 {
        margin-top: 0;
        text-align: center;
    }

    .croix {
        position: absolute;
        right: 10px;
        top: 5px;
        cursor: pointer;
        font-size: 16px;
    }


    form {
        display: flex;
        flex-direction: column;
        align-items: center;

        .timesection {
            display: flex;

            .dateselectorslot {
                display: flex;
                flex-direction: column;
                align-items: center;

                p {
                    font-size: 20px;
                    font-weight: 600;
                    margin-right: 20px;
                    text-align: center;
                    margin-bottom: 10px;
                    margin-top: 0;
                }

                .errorMessage {
                    color: red;
                }
            }

            .timeSelectorWrapper {
                margin-left: 40px;

                p {
                    margin-top: 0;
                    margin-bottom: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: red;
                    text-align: center;
                }

                .timeselectorslot {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;


                    p {
                        font-size: 20px;
                        font-weight: 600;
                        margin-right: 20px;
                        text-align: center;
                        width: 20px;
                        /*to alligne calenders*/
                        color: black;
                    }
                }
            }
        }

        .submitpart {
            display: flex;
            flex-direction: column;
            position: relative;

            input[type=submit] {
                font-size: 14px;
                //color: #eee;
                font-weight: 600;
                margin-top: 20px;
                background-color: $secondColor;
                border-radius: 84px;

                padding: 15px 15px 15px 15px;
                cursor: pointer;
            }

            .lds-ellipsis {
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translate(-50%);
            }
        }

        input[type=text],
        input[type=password] {

            height: 45px;
            font-size: 16px;
            border-radius: 10px;
            border-color: black;
            margin-bottom: 10px;
            padding-left: 10px;

            &:focus {
                outline: solid #72ac51;
            }

            &:focus:invalid {
                outline: solid red;
            }
        }

        .dayArea {
            display: flex;
            font-size: 18px;
            font-weight: 600;
            margin-top: 20px;
            border: solid $lightBlue;
            padding: 15px 15px 15px 15px;
            border-radius: 20px;

            p {
                font-size: 18px;
                font-weight: 600;
                margin-right: 20px;
            }

            .dayList {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                width: 400px;

                .listItem {
                    margin-right: 10px;
                    padding-bottom: 5px;
                    /*to have items spaced but centered*/
                    padding-top: 5px;


                    label {
                        margin-left: 5px;
                    }
                }
            }

        }
    }

    .ModifyComMean {
        color: #444;
        cursor: pointer;
    }

    .addCommunicationMeans {
        display: flex;
        align-items: center;
        justify-content: space-around;

        button {
            font-size: 18px;
            background-color: rgb(215, 61, 61);
            border-radius: 10px;
            padding: 7px 7px 7px 7px;
            color: white;
            font-weight: bold;
            cursor: pointer;

            &:hover {
                background-color: rgba(215, 61, 61, 0.818);
            }
        }

        input[type=text] {
            font-size: 18px;
            border-radius: 10px;
            border-color: black;

            &:focus {
                outline: solid #72ac51;
            }

            &:focus:invalid {
                outline: solid red;
            }
        }

        input[type=submit] {
                font-size: 14px;
                color: white;
                font-weight: 600;
                margin-top: 5px;
                background-color: $secondColor;
                border-radius: 84px;

                padding: 15px 15px 15px 15px;
                cursor: pointer;
        }

    }
}
</style>
