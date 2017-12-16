// import {Directive} from '@angular/core';
// import {Control} from "@angular/common";
// import {NG_VALIDATORS} from "@angular/common";
// import {provide} from "@angular/core";
//
// export function validateEmail(c: Control) {
//     let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
//     return EMAIL_REGEXP.test(c.value) ? null : {
//         validateEmail: {
//             valid: false
//         }
//     };
// }
//
//
//
// @Directive({
//     selector: '[validateEmail][ngControl]',
//     providers: [
//         provide(NG_VALIDATORS, {
//             useValue: validateEmail,
//             multi: true
//         })
//     ]
// })
// export class EmailValidator {
//
//     validator: Function;
//
//     constructor() {
//         this.validator = validateEmail;
//     }
//
//     validate(c: Control) {
//         return this.validator(c);
//     }
// }
