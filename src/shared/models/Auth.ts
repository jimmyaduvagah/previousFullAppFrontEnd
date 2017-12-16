
export class Auth {
    token: string;

    constructor(obj) {
        for (let field in obj) {
            if (obj.hasOwnProperty(field)) {
                this[field] = obj[field];
            }
        }
    }


}
