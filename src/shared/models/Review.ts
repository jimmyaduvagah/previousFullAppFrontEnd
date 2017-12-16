import { BaseModel } from '../../shared/bases/models/BaseModel';

export class Review extends BaseModel {
    id: string;
    modified_by_id: string;
    created_by_id: string;
    object_id: string;
    content_type: number;
    template: string;
    response: ReviewResponse[];


    constructor(obj) {
        super();
        for (let field in obj) {
            if (obj.hasOwnProperty(field)) {
                this[field] = obj[field];
            }
        }
    }


}

export class ReviewResponse {
    response: any;
    question: string;
    type: string;

    constructor(obj) {
        for (let field in obj) {
            if (obj.hasOwnProperty(field)) {
                this[field] = obj[field];
            }
        }
    }


}