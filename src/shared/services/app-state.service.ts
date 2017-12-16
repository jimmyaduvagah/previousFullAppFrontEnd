import { Injectable, EventEmitter } from '@angular/core';


export interface AppStateChangeEvent {
    pageTitle: string;
    activeNav: string;
}

@Injectable()
export class AppStateService {

    public stateChanged: EventEmitter<AppStateChangeEvent> = new EventEmitter();
    public currentState: AppStateChangeEvent;

    constructor() {
    }

    setState(state: AppStateChangeEvent) {
        this.currentState = state;
        this.stateChanged.emit(this.currentState);
    }


}
