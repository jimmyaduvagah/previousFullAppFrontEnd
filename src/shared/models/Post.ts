import { BaseModel } from '../../shared/bases/models/BaseModel';

export class Post extends BaseModel {
    id: string;
    parent_post?: string;
    modified_by_id: string;
    created_by_id: string;
    post_type_display: string;
    post_type: number;
    text_content: string;
    likes_count: number;
    shares_count: number;
    comments_count: number;
    number_of_edits: number;
    linked_content_type?: string;
    linked_object_id?: string;
    linked_content_object?: any;
    my_like?: string;
    associated_object_id?: string;
    profile_image?: string;


    constructor(obj) {
        super();
        for (let field in obj) {
            if (obj.hasOwnProperty(field)) {
                this[field] = obj[field];
            }
        }
    }


}

export class Like extends BaseModel {
  id: string;
  post: string;
  modified_by_id: string;
  created_by_id: string;
  created_by: string;
  modified_by: string;


  constructor(obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }


}


export class PostReport extends BaseModel {
  id: string;
  post: string;
  modified_by_id: string;
  created_by_id: string;
  created_by: string;
  modified_by: string;


  constructor(obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }


}