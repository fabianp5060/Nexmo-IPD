const callStart = (request) => {
    return [
        {
            action: "talk",
            text: "Thank you for calling"
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
            timeOut: 4,
            maxDigits: 20
        }
    ];
}

const pinConfirm = (request) => {
    return [
        {
            action: "talk",
            text: `Your Pin is, ${(request.body.dtmf).split('').join(' ')}`
        },
        {
            action: "talk",
            text: "Press 1 to process with this pin, or Press 0 to reenter your pin number",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=pinConfirm&retryCount=0`],
            submitOnHash: true,
            timeOut: 4,
            maxDigits: 1
        }
    ]
}

const customerNameInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Thank you.  After the beep, please Say your Name followed by the pound key"
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
            text: "Excellent, Press 1 to hear your name, Press 2 to confirm your name, or Press 3 to rerecord.  Press pound when complete.",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=speechConfirm&&speech=${speech}&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 4,
            maxDigits: 1
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
            text: "Press 2 to confirm your name, or Press 3 to record again,  Press pound after you have made your selection.",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=speechConfirm&speech=${request.query.speech}&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 4,
            maxDigits: 1
        }
    ];
}

const bestNumberInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Enter the best phone number to reach you at, followed by pound key",
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
            text: "If you are calling about a recent Load Application Press 1, otherwise press 0",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=recentLoadApplication&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 1,
            maxDigits: 4
        }
    ];
}

const tradeInInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Do yo have a TradeIn?  If so Press 1 otherwise press 0, followed by pound key",
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
            text: "If you calling about a New Car Press 1. If you are calling about a Trade in press 0, followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=new&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 4,
            maxDigits: 1
        }
    ];
}

const downpaymentInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Will you make a Down payment?  If yes, Press 1, otherwise press 0 followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=downpayment&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 4,
            maxDigits: 1
        }
    ];
}

const shoppingTypeOfVehicleInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "What type of vehicle are you looking for.  For cars press 1, for Trucks press 2, For S U V press 3, For Vans press 4. Press 0 if you are looking for Something Else.  Press pound after you have made your selection",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=shoppingTypeOfVehicle&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 4,
            maxDigits: 1
        }
    ];
}

const requestCreditAuthorization = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Thank you, for answering the Survey Questions. If you want to take Credit Authorization Questions Press 1 or Press something else to End the Call followed by pound key",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=isCreditAuthorization&retryCount=0`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 1
        }
    ]
}

const mothersMaidenNameInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "After the beep, Please Say Your Mother's Maiden Name, followed by the pound key."
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
            text: "Please Enter Your social security number, followed by the pound key",
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
            text: "Please Enter Your Birth Date using the following format. First, enter the month as two digits, then, enter the day as two digits.  Finally, enter the four-digit year.  Do  not include hyphons or dashes.  Press pound when completed.",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=birthDate&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 8
        }
    ];
}

const addressInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "After the beep, Please Say Your Address, followed by the pound key."
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
            text: "After the beep, Please Say Your Employer Name, followed by the pound key."
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
            text: "After the beep, Please Say Your Employer Address, followed by the pound key."
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
            text: "Next, Enter the number of years you have been with your current employer.  Press pound when complete",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=timeWithEmployer&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 2
        }
    ];
}

const houseHoldIncomeInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Please Enter your total Household Income, followed by the pound key",
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
            text: "Please enter, how many years have you been at your current address, followed by pound",
            bargeIn: true
        },
        {
            action: "input",
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/event?input=yearsAtAddress&retryCount=${retryCount}`],
            submitOnHash: true,
            timeOut: 10,
            maxDigits: 2
        }
    ];
}

const employerPhoneInput = (request, retryCount) => {
    return [
        {
            action: "talk",
            text: "Enter your Employer Phone Number followed by the pound key",
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
            text: "Please wait, while we connect your call to the next available agent"
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
            text: "Thanks for answering the credit Authorization Questions.  Press 1 to connect your call to the next available agent, or Press any key to end this call",
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
                text: "Press 1 to connect your call to the next available agent, or Press any key to continue to continue to the next question",
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
                text: "Press 1 to connect your call to the next available agent, or Press any key to continue to the next question ",
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