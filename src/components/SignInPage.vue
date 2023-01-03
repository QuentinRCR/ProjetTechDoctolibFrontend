<template>
    <div class="wrappingDiv">
        <div class="content">
            <div class="fillInDiv"></div>
            <div class="boiteblanche">
                <h1>S'inscrire</h1>
                <div class="menu">
                    <form @submit.prevent="submit"
                        v-on:submit="SubmitForm(ClienEmail, ClientFirstName, ClientLastName, Password, PasswordConfirmation, PhoneNumber, SkypeAccount, Campus)">
                        <input v-model="ClienEmail" type="text" placeholder="Email EMSE*" required><br>
                        <!--pattern="[a-z0-9._%+-]+@[a-z0-9.-]*emse\.fr$" ><br>--> <!--match a emse adress-->
                        <input v-model="ClientFirstName" type="text" placeholder="Prénom*" required><br>
                        <input v-model="ClientLastName" type="text" placeholder="Nom*" required><br>
                        <input v-model="Password" type="password" placeholder="Mot de passe*" required><br>
                        <input :pattern="Password" v-model="PasswordConfirmation" type="password"
                            placeholder="Confirmation de mot de passe*" required><br>
                        <!--The patern is to verify that the confiramtion is equal to the original password-->
                        <input v-model="PhoneNumber" type="text" placeholder="Numéro de téléphone*" required
                            pattern="^(?:(?:\+|00)[1-9][1-9]|0)\s*[1-9](?:[\s.-]*\d{2}){4}$"><br>
                        <!--to match a européen phone format-->
                        <input v-model="SkypeAccount" type="text"
                            placeholder="Pseudo Skype         ex: live:.cd.4d256a842e696f6 ou bob36"><br>
                        <select v-model="Campus">
                            <option :value="null" disabled>Campus</option>
                            <option>Saint Etienne</option>
                            <option>Gardanne</option>
                        </select><br>
                        <div class="submitpart">
                            <input class="boutonsubmit" type="submit" value="S'inscrire" :style="{
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
                    <p v-if="emailAlreadyTaken" class="emailAlreadyTaken">Email déjà utilisé</p>
                    <p class="info">Les champs avec un * sont obligatoires</p>
                    <p class="mailSent" v-if="this.formSubmited">Vous devez avoir reçu un mail pour activer votre compte
                    </p>
                </div>
            </div>
            <div class="SignInButtonPart">
                <div class="bordure">
                    <p>J'ai déjà un compte</p>
                    <button @click="SendToLogIn">Se connecter</button>
                </div>
            </div>
        </div>
        <p class="legalNotice" @click="legalNotice">Mension légales</p>
    </div>

</template>

<script>
import axios from 'axios';
import { API_HOST } from "../config" //to get the API path
export default {
    name: 'SignInPage',
    data: function () {
        return {
            ClientFirstName: null,
            ClientLastName: null,
            Password: null,
            PasswordConfirmation: null,
            PhoneNumber: null,
            SkypeAccount: "",
            Campus: "",
            ClienEmail: null,
            formSubmited: false,
            submitClicked: false,
            emailAlreadyTaken: false
        }
    },
    methods: {
        async SubmitForm(ClienEmail, ClientFirstName, ClientLastName, Password, PasswordConfirmation, PhoneNumber, SkypeAccount, Campus) {
            if (!this.submitClicked) { //to prevent spamming
                this.submitClicked = true; //to display the loading animation
                console.log("faire l'authentification");
                try {
                    let response = await axios.post(`${import.meta.env.VITE_APP_API_HOST}/api/registration`,
                        {
                            campus: `${Campus}`,
                            email: `${ClienEmail}`,
                            nom: `${ClientLastName}`,
                            password: `${Password}`,
                            phonenumber: `${PhoneNumber}`,
                            prenom: `${ClientFirstName}`,
                            skypeAccount: `${SkypeAccount}`
                        })
                    this.formSubmited = true; //To display the message saying that the person received a mail to confirm its account
                    this.emailAlreadyTaken = false;
                }
                catch (error) {
                    if (error.response.data.status == 500) {
                        this.emailAlreadyTaken = true;
                    }
                    else {
                        console.log(error);
                    }
                }
                this.submitClicked = false; //to cencel the loading animation
            }
        },
        SendToLogIn() {
            this.$router.push("/"); //go to the login page
        },
        legalNotice() {
            this.$router.push("/legalNotice");
        }

    }
}
</script>

<style lang="scss" scoped>
.wrappingDiv{
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
            //border: solid green;
            width: 100%;

            form {
                display: flex;
                flex-direction: column;
                align-items: stretch;

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

                        &:hover {
                            background-color: $secondColorLighter
                        }
                    }

                    .lds-ellipsis {
                        position: absolute;
                        top: 8px;
                        left: 50%;
                        transform: translate(-50%);
                    }
                }

                input[type=text],
                input[type=password],
                select {

                    font-size: 16px;
                    padding: 15px 15px 15px 15px;
                    border-radius: 10px;
                    border-color: $secondColor;
                    margin-bottom: 20px;

                    &:focus {
                        outline: solid #72ac51;
                    }

                    &:focus:invalid {
                        outline: solid red;
                    }
                }
            }

            .mailSent {
                text-align: center;
                font-size: 18px;
                color: green;
                font-weight: bold;
            }

            p {
                font-size: 18px;
                font-weight: bold;
            }
        }
    }

    .SignInButtonPart {
        //border: solid rebeccapurple;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 180px;

        .bordure {

            border: solid $secondColor;
            padding: 5px 5px 5px 5px;
            border-radius: 20px;
            border-width: 5px;


            p {
                font-size: 20px;
            }

            button {
                background-color: $secondColor;
                border-radius: 90px;
                color: white;
                font-weight: 600;
                padding: 10px 10px 10px 10px;
                cursor: pointer;

                &:hover {
                    background-color: $secondColorLighter
                }
            }

        }
    }

}

.emailAlreadyTaken {
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    color: red;
    cursor: pointer;
}

.legalNotice {
    margin-top: 40px;
    text-align: center;
    color: #444;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

@media (min-width: 600px) { //for desktop format
    .content {
        
        display: flex;
        flex-direction: row !important;
        justify-content: center;

        .SignInButtonPart{
            margin-left: 70px;
            margin-right:10px;
        }
    }

    .boiteblanche {
        width: 500px !important;
    }

    .fillInDiv{
        width:180px;
        margin-right: 80px; // to compensate the margin left and right on the sign in button part
    }

    .legalNotice {
        //position: absolute;
        //bottom: 20px;
        //left: 50%;
        //transform: translate(-50%,0);
    }

    
}




@media (min-width:600px) and (max-width:920px) { //intermediary format
    .content{
        flex-direction: column !important;
    }

    .fillInDiv{
        display: none;
    }

    .SignInButtonPart{
            margin-left: 0px !important;
            margin-right:0px !important;
        }
}
</style>
