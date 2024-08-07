import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MsalInterceptor, MsalModule, MsalRedirectComponent} from "@azure/msal-angular";
import {InteractionType, PublicClientApplication} from "@azure/msal-browser";
import {environment} from "../environment/environment";
import {SampleAuthComponent} from './sample-auth/sample-auth.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthorizeInterceptor} from "./interceptors/authorize.interceptor";

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    SampleAuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.aad.clientId,
        authority: `https://login.microsoftonline.com/${environment.aad.tenantId}`,
        redirectUri: 'http://localhost:4200'
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['Directory.Read.All']],
        ['https://localhost:7088/api/', [`${environment.aad.clientId}/.default`]],
        ['/', ['Directory.Read.All']],
        ['/', [`${environment.aad.clientId}/.default`]]
      ])
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  },
    {

      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
}
