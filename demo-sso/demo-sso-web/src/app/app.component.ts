import {Component, Inject, OnInit} from '@angular/core';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {Router} from "@angular/router";
import {filter, Subject, takeUntil} from "rxjs";
import {EventMessage, EventType, InteractionStatus, RedirectRequest} from "@azure/msal-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'demo-sso-web';
  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private broadcastService: MsalBroadcastService,
              private authService: MsalService,
              private router: Router) {

  }

  ngOnInit(): void {

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {

        console.log("Login success");
        this.setLoginDisplay();
        if(!this.loginDisplay){
          this.login()
        }
      })

    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        localStorage.setItem('Access_Token', (result as any).payload.accessToken)
        console.log(result)
      });

  }
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    console.log('loginDisplay', this.loginDisplay)


  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  logout() { // Add log out function here
    this.authService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200'
    });
    localStorage.clear()

  }

}
