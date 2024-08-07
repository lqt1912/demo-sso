import {Component, OnInit} from '@angular/core';
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";
import {filter} from "rxjs";
import {EventMessage, EventType, InteractionStatus} from "@azure/msal-browser";

@Component({
  selector: 'app-sample-auth',
  templateUrl: './sample-auth.component.html',
  styleUrls: ['./sample-auth.component.scss']
})
export class SampleAuthComponent implements OnInit{

  loginDisplay = false;
  constructor(private authService: MsalService,
              private msalBroadcastService: MsalBroadcastService) {
  }

    ngOnInit(): void {

      let isLogin = localStorage.getItem("Access_Token") !==null;
      this.loginDisplay = isLogin;

    }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

}
