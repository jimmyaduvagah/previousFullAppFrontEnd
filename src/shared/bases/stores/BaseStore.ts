import { BaseService } from '../services/BaseService';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class ListDetailModel {
    next?: string;
    previous?: string;
    count: number;
}

@Injectable()
export class BaseStore {
    @Output() getNextEmitter: EventEmitter<any> = new EventEmitter();
    @Output() endOfListEmitter: EventEmitter<any> = new EventEmitter();
    public _store: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    public store: Observable<Array<any>> = this._store.asObservable();
    public _listDetails: BehaviorSubject<ListDetailModel> = new BehaviorSubject({count:0});
    public listDetails: Observable<ListDetailModel> = this._listDetails.asObservable();

    constructor(private _service: BaseService) {
        this.loadInitialData();
    }

    // get store() {
    //     return asObservable
    // }

    loadInitialData() {
        // Overwrite this if needed...
    }

    getListCallback() {
        // Overwrite this if needed...
    }

    getNextCallback() {
        // Overwrite this if needed...
    }

    refreshLocalStore(){
        // for some reason, we may want to set the whole list as blank and then back to what it was
        // to try and force a ui redraw.  It didn't work for my list view, but maybe useful somewhere else? -CJ
        let originalStore = this._store.getValue();
        this._store.next([]);
        this._store.next(originalStore);
    }

    getFromStore(id:string) {
        // console.log('getFromStore got the id '+ id);
        let store = this._store.getValue();
        let index;
        let i = 0;
        for (let item of store) {
            if (item.id === id) {
                index = i;
                // console.log('getFromStore got the object '+ JSON.stringify(store[index]));
                return store[index];
            }
            i ++
        }

        return null

    }

    updateStoreItem(itemToUpdate) {
        let store = this._store.getValue();
        let index;
        let i = 0;
        for (let item of store) {
            if (item.id === itemToUpdate.id) {
                index = i;
                break
            }
            i ++
        }
        if (index >= 0){
            store[index] = itemToUpdate;
            this._store.next(store);
        }

    }

    addStoreItem(itemToAdd){
        let store = this._store.getValue();
        store.unshift(itemToAdd);
        this._store.next(store);
    }

    getList() {
        this._service.getList()
            .subscribe(
                (res) => {
                    this._store.next(res.results);
                    this._listDetails.next({count:res.count, previous: res.previous, next: res.next});
                    this.getListCallback();
                },

                (err) => console.log('Error with getList()')
            );
    }

    getNext() {
        if (this._listDetails.getValue().next){
            this._service.getNextList()
                .subscribe(
                    (res) => {
                        let store = this._store.getValue();
                        store.push(...res.results);
                        // store.splice(-1, 0, ...res.results); // we don't need to splice since no more fake last post.
                        this._store.next(store);
                        this._listDetails.next({count:res.count, previous: res.previous, next: res.next});
                        this.getNextCallback();
                    }
                );
        }

    }

    addItem(data, params?): Observable<any> {
        let obs = this._service.post(data, params);

        obs.subscribe(
            (res) => {
                this._store.getValue().unshift(res);
                this._store.next(this._store.getValue()); // TODO: Allow for putting at the top or bottom of array.
            }
        );

        return obs;
    }

    updateItem(id, data, params?): Observable<any> {
        let obs: Observable<any> = this._service.put(id, data, params);

        obs.subscribe(
            (res) => {
                let store = this._store.getValue();
                let index = store.indexOf((obj) => obj.id === id);
                store[index] = res;
                this._store.next(store);
            }
        );

        return obs
    }

}