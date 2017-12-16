// import {Directive} from 'angular2/core';
// import {Control} from "angular2/common";
// import {NG_VALIDATORS} from "angular2/common";
// import {provide} from "angular2/core";
// import {ElementRef} from "angular2/core";
// import {Attribute} from "angular2/core";
//
// export function validatePassword(c: Control) {
//     var valid = true;
//     var minLength = 8;
//
//     // checks min length
//     if (typeof c.value == 'string') {
//         if (c.value.length < minLength) {
//             valid = false;
//         }
//         // checks for uppercase and lowercase
//         if ( !c.value.match(/[a-z].*[A-Z]|[A-Z].*[a-z]/) ) {
//             valid = false;
//         }
//         // checks for a number
//         if ( !c.value.match(/[0-9]/) ) {
//             valid = false;
//         }
//     } else {
//         valid = false;
//     }
//
//
//     if (valid) {
//         return null;
//     } else {
//         return {
//             validatePassword: {
//                 valid: false
//             }
//         }
//     }
//
// }
//
//
//
// @Directive({
//     selector: '[validatePassword][ngControl]',
//     providers: [
//         provide(NG_VALIDATORS, {
//             useValue: validatePassword,
//             multi: true
//         })
//     ]
// })
// export class PasswordValidator {
//
//     validator: Function;
//
//     constructor(private _elementRef:ElementRef) {
//         this.validator = validatePassword;
//     }
//
//     validate(c: Control) {
//         return this.validator(c);
//     }
// }
