import { BaseStore } from '../bases/stores/BaseStore';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { PostService } from './post.service';
import { Post } from '../models/Post'
@Injectable()
export class PostStore extends BaseStore {
    hackyLastPostItem: Post;
    @Output() gotListEvent: EventEmitter<any> = new EventEmitter();

    constructor(_service: PostService) {
        super(_service);

        this.hackyLastPostItem = new Post({
            id: "last",
            modified_by_id: "nobody",
            created_by_id:  "nobody",
            post_type_display:  "hacky-last-item",
            post_type: 0,
            text_content: "",
            likes_count: 0,
            shares_count: 0,
            comments_count: 0,
            number_of_edits: 0,
        });

    }

    getListCallback() {
        // this.addHackyLastItem(this.hackyLastPostItem);
        this.gotListEvent.emit(true);

    }

    addHackyLastItem(lastItem:Post){
        let store = this._store.getValue();
        console.log(store.length);
        console.log(store.push(lastItem));
        this._store.next(store);
    }

}
