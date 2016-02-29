/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes');

var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * Mindfulness is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Mindfulness = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Mindfulness.prototype = Object.create(AlexaSkill.prototype);
Mindfulness.prototype.constructor = Mindfulness;

Mindfulness.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Mindfulness Skill. Mindfulness is the practice of purposely focusing your attention on the present moment, and accepting it without judgment. Would you like to begin a one minute meditation?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

Mindfulness.prototype.intentHandlers = {
    "MinuteMeditationIntent": function (intent, session, response) {
        var lengthSlot = intent.slots.Length,
		lengthName;
		if (lengthSlot && lengthSlot.value){
			lengthName = lengthSlot.value.toLowerCase();
		}
				
		var cardTitle = "Mindfulness Meditation",
            recipe = recipes[lengthName],
            speechOutput,
            repromptOutput;
        if (recipe) {
            speechOutput = {
                speech: "<speak> Your meditation is about to begin. As the music plays, take a moment to sit down and close your eyes. <break time=\"0.2s\" /> Focus your attention on your breath. <break time=\"0.2s\" /> Focus on each inhalation and exhalation <break time=\"0.2s\" /> and if your mind wanders, don't judge it, <break time=\"0.2s\" /> just return your focus to your breath. <break time=\"0.2s\" /> When the music stops, your meditation is complete." + recipe + " </speak>",
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, "Congratulations! You are changing the world, one meditation at a time. Visit us anytime at WalkingAffirmations.com!");
        } else {
            var speech;
            if (lengthName) {
                speech = "I'm sorry, I currently do not have a meditation for " + lengthName + ".  Would you like to start a minute meditation now? ";
            } else {
                speech = "I'm sorry, I currently do not have a meditation that matches your request, Would you like to start a minute meditation now?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "Would you like to start a minute meditation now?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Peace be with you, until next time.";
        response.tell(speechOutput);
    },
	"AMAZON.YesIntent": function (intent, session, response) {
        var speechOutput = {
            speech: "<speak> Your meditation is about to begin. As the music plays, take a moment to sit down and close your eyes. <break time=\"0.2s\" /> Focus your attention on your breath. <break time=\"0.2s\" /> Focus on each inhalation and exhalation <break time=\"0.2s\" /> and if your mind wanders, don't judge it, <break time=\"0.2s\" /> just return your focus to your breath. <break time=\"0.2s\" /> When the music stops, your meditation is complete.<audio src='https://s3.amazonaws.com/minutemeditation/AudioFiles/1minutemeditation.mp3'/> Your meditation is coming to an end, <break time=\"0.2s\" /> open your eyes, smile, <break time=\"0.2s\" /> and enjoy the rest of your day. </speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        response.tellWithCard(speechOutput, "Mindfulness Meditation", "Congratulations! You are changing the world, one meditation at a time. Visit us anytime at WalkingAffirmations.com!");
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Peace be with you, until next time.";
        response.tell(speechOutput);
    },
    "AMAZON.NoIntent": function (intent, session, response) {
        var speechOutput = "Peace be with you, until next time.";
        response.tell(speechOutput);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "1 Minute Mindfulness will help you take a quick break from the world around you and guide you on a one minute journey into mindfulness. Mindfulness is the practice of purposely focusing your attention on the present moment, and accepting it without judgment. You can say things like, start a peaceful meditation, start a forest meditation, or cancel.  How can I help you?";
        var repromptText = "You can say things like, start a peaceful meditation, start a forest meditation, or cancel.  How can I help you?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var mindfullness = new Mindfulness();
    mindfullness.execute(event, context);
};
