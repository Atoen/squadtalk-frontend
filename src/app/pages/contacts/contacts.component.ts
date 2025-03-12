import { Component, inject, OnInit } from '@angular/core';
import { ContactManager } from "../../services/ContactManager";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primeng/tabs";
import { FriendListComponent } from "../../components/friend-list/friend-list.component";
import { FriendRequestsComponent } from "../../components/friend-requests/friend-requests.component";
import { AddFriendComponent } from "../../components/add-friend/add-friend.component";


@Component({
  selector: 'app-contacts',
    imports: [
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    FriendListComponent,
    FriendRequestsComponent,
    AddFriendComponent
],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

}
