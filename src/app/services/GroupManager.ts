import {Injectable, signal} from '@angular/core';
import {SignalrService} from './SignalrService';
import {ChatGroup} from '../data/models/ChatGroup';

@Injectable({providedIn: "root"})
export class GroupManager {

    private _groups = signal<ChatGroup[]>([]);
    private _currentGroup = signal<ChatGroup | null>(null);

    constructor(private readonly signalrService = SignalrService) {

    }
}
