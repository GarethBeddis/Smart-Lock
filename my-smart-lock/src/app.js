'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        // Check if customer is signed in
        if(!this.$request.getAccessToken()){ // Customer not signed in
            this.showAccountLinkingCard()
            if(this.isAlexaSkill()){
                this.$alexaSkill.tell('Please open the Alexa App to link your smart lock account.');
            }
        } else {
            // Customer signed in!
            this.$speech.addText(`Welcome to your smart lock. Would you like to lock your door? Check the status of your door? Or unlock your door?`)
            this.$reprompt.addText(`Do you want to get the status of your door lock, lock the door, or unlock the door?`)
            this.ask(this.$speech, this.$reprompt);
        }
    },

    ON_SIGN_IN() {
        if (this.$googleAction.getSignInStatus() === 'CANCELLED') {
            // User did not link their account
            this.showAccountLinkingCard();
        } else if (this.$googleAction.getSignInStatus() === 'OK') {
            // User linked their account
            this.toIntent("LAUNCH");
            this.tell(this.$speech);
        } else if (this.$googleAction.getSignInStatus() === 'ERROR') {
            // There was an error
            this.showAccountLinkingCard()
        }
    },

    LockIntent() {
        const expectedLockPrompt = `Your door is locked.`
        const expectedUnlockPrompt = `Your door is unlocked.`
        let lockStatus = this.$inputs.lockStatus.value;

        if(lockStatus === 'lock') {
            this.$speech.addText(expectedLockPrompt)
        } else {
            this.$speech.addText(expectedUnlockPrompt)
        }
        this.tell(this.$speech)
    },
});

module.exports.app = app;
