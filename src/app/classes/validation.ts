export class Validation {//todo add other validations

    constructor() { }

    isValEmail(email: string) { //couldn't do it through static in a easy to use & implement manner (couldn't call it on the html page)
        var val = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //if problematic use: ^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$
        return val.test(email);
    }

    //just in case there's too many validaitons or I want to switch the RegExp to the component
    isVal(text: string, val: RegExp) {
        return val.test(text);
    }
}
