const callStart = (request) => {
    return [
        {
            action: "talk",
            text: "Thanks for calling"
        },
        {
            payload: { 'event': 'callStart' },
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=callStartNotify`],
            action: "notify",
            eventMethod: "POST"
        }
    ];
}

const pinInput = (request) => {
    return [
        {
            action: "talk",
            text: "Please Enter Your Pin Number followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=pin`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const pinConfirm = (request) => {
    return [
        {
            action: "talk",
            text: `Your Pin is ${(request.body.dtmf).split('').join(' ')}`
        },
        {
            action: "talk",
            text: "Press 1 to process with this pin or Press 0 to reenter the pin number",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=pinConfirm&retryCount=0`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ]
}

const customerNameInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Say your Name followed by pound key after beep sound"
        },
        {
            beepStart: true,
            action: 'record',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?recordName=customerName`],
            endOnSilence: 3,
            endOnKey: '#'
        },
        {
            payload: { 'speechInput': 'customerName' },
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=customerNameNotify&retryCount=${retryCount}`],
            action: "notify",
            eventMethod: "POST"
        }
    ];
}

const speechConfirm = (request, speech, retryCount) => {
    return [
        {
            action: "talk",
            text: "Press 1 to hear the voice Press 2 to confirm the voice Press 3 to rerecord followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=speechConfirm&&speech=${speech}&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ]
}

const rerecordConfirm = (request, speech) => {
    return [
        {
            payload: { 'rerecord': true, 'speech': speech },
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=rerecordNotify&retryCount=${request.query.retryCount}`],
            action: "notify",
            eventMethod: "POST"
        }
    ];
}

const playRecording = (request, retryCount) => {
    return [
        {
            action: "stream",
            streamUrl: [
                `${request.protocol}://${request.get('host')}/playSpeechInput.mp3?play=${request.query.speech}&conversation_uuid=${request.body.conversation_uuid}`
            ]
        }, {
            action: "talk",
            text: "Press 2 for confirming the voice or Press 3 for rerecording",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=speechConfirm&speech=${request.query.speech}&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const bestNumberInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Enter Your Best Number followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=bestNumber&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const recentLoadApplicationInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Recent Load Application Press 1 for yes or Press 0 for no followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=recentLoadApplication&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const tradeInInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "TradeIn Press 1 for yes or Press 0 for no followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=tradeIn&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const newInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "New Press 1 for yes or Press 0 for no followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=new&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const downpaymentInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Downpayment Press 1 for yes or Press 0 for no followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=downpayment&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const shoppingTypeOfVehicleInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "ShoppingTypeOfVehicle Press 1 for Car Press 2 to Truck Press 3 for SUV Press 4 for Van Press 0 for Something Else followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=shoppingTypeOfVehicle&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const requestCreditAuthorization = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Thanks for answering the Survey Questions. If you want to take Credit Authorization Questions Press 1 or Press something else to End the Call followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=isCreditAuthorization&retryCount=0`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ]
}

const mothersMaidenNameInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Say Your Mother's Maiden Name followed by pound key after beep sound"
        },
        {
            beepStart: true,
            action: 'record',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?recordName=mothersMaidenName`],
            endOnSilence: 3,
            endOnKey: '#'
        },
        {
            payload: { 'speechInput': 'mothersMaidenName' },
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=mothersMaidenNameNotify&retryCount=${retryCount}`],
            action: "notify",
            eventMethod: "POST"
        }
    ];
}

const ssnInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Enter Your SSN followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=ssn&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const birthDateInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Enter Your BirthDate followed by pound key. Format will be two-digit month, two-digit day and four-digit year no dashes and no slashes",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=birthDate&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const addressInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Say Your Address followed by pound key after beep sound"
        },
        {
            beepStart: true,
            action: 'record',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?recordName=address`],
            endOnSilence: 3,
            endOnKey: '#'
        },
        {
            payload: { 'speechInput': 'address' },
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=addressNotify&retryCount=${retryCount}`],
            action: "notify",
            eventMethod: "POST"
        }
    ];
}

const employerNameInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Say Your Employer Name followed by pound key after beep sound"
        },
        {
            beepStart: true,
            action: 'record',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?recordName=employerName`],
            endOnSilence: 3,
            endOnKey: '#'
        },
        {
            payload: { 'speechInput': 'employerName' },
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=employerNameNotify&retryCount=${retryCount}`],
            action: "notify",
            eventMethod: "POST"
        }
    ];
}

const employerAddressInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Say Your Employer Address followed by pound key after beep sound"
        },
        {
            beepStart: true,
            action: 'record',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?recordName=employerAddress`],
            endOnSilence: 3,
            endOnKey: '#'
        },
        {
            payload: { 'speechInput': 'employerAddress' },
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=employerAddressNotify&retryCount=${retryCount}`],
            action: "notify",
            eventMethod: "POST"
        }
    ];
}

const timeWithEmployerInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Enter Time With Employer in year followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=timeWithEmployer&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const houseHoldIncomeInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Enter Household Income followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=houseHoldIncome&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const yearsAtAddressInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Enter Years At Address followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=yearsAtAddress&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const employerPhoneInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Enter Employer Phone Number followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=employerPhone&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ];
}

const callEnd = (request) => {
    return [
        {
            action: "talk",
            text: "Thanks for calling"
        }
    ];
}

const connectCall = (request, VCCPhone) => {
    return [
        {
            action: "talk",
            text: "Please wait while we connect your call to agent"
        },
        {
            action: "connect",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=connectCall`],
            timeout: "45",
            from: `${request.body.from}`,
            endpoint: [
                {
                    type: "phone",
                    number: VCCPhone,
                }
            ]
        }
    ]
}
const finalCallConfirm = (request) => {
    return [

        {
            action: "talk",
            text: "Thanks for answering the credit Authorization Questions.Press 1 to connect the call to the agent or Press Something to end the call ",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=finalCallConfirm`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 20
        }
    ]
}

const callConfirmWithDtmf = (request, action, input, retryCount) => {
    if (action == "speech") {
        return [

            {
                action: "talk",
                text: "Press 1 to connect the call to the agent or Press something else to continue the next question ",
                bargeIn: true
            },
            {
                action: "input",
                eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?event=callConfirmWithDtmf&action=${action}&speech=${input}&retryCount=0`],
                submitOnHash: true,
                timeOut: 10,
                maxDigits: 20
            }
        ]
    } else if (action == "dtmf") {
        return [

            {
                action: "talk",
                text: "Press 1 to connect the call to the agent or Press something else to  continue the next question ",
                bargeIn: true
            },
            {
                action: "input",
                eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?event=callConfirmWithDtmf&action=${action}&input=${input}&retryCount=0`],
                submitOnHash: true,
                timeOut: 10,
                maxDigits: 20
            }
        ]
    }

}
module.exports = {
    callStart,
    pinInput,
    pinConfirm,
    customerNameInput,
    speechConfirm,
    rerecordConfirm,
    playRecording,
    bestNumberInput,
    recentLoadApplicationInput,
    tradeInInput,
    newInput,
    downpaymentInput,
    shoppingTypeOfVehicleInput,
    requestCreditAuthorization,
    mothersMaidenNameInput,
    ssnInput,
    birthDateInput,
    addressInput,
    employerNameInput,
    employerAddressInput,
    timeWithEmployerInput,
    houseHoldIncomeInput,
    yearsAtAddressInput,
    employerPhoneInput,
    connectCall,
    callEnd,
    finalCallConfirm,
    callConfirmWithDtmf
}