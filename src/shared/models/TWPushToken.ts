
export class TWPushToken {
  token: string;
  user: string;
  device_id: string;
  device_os: string;
  created: string;
  is_active: boolean;

    constructor(obj) {
        for (let field in obj) {
            if (obj.hasOwnProperty(field)) {
                this[field] = obj[field];
            }
        }
    }


}
