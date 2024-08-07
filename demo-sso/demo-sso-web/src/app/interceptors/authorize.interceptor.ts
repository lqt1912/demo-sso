import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, tap} from "rxjs";
import {MsalService} from "@azure/msal-angular";

@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {
  constructor( private msalService: MsalService) {
  }
    intercept(request: HttpRequest<any>, next: HttpHandler): any {
      console.log('inercepterfsdefsafdasfdsadfsadsadsadsadsa')
      try {
        let accounts = this.msalService.instance.getAllAccounts();
        const accessTokenRequest = {
          scopes: ["Directory.Read.All"],
          account: accounts[0]
        };

        return this.msalService.acquireTokenSilent(accessTokenRequest).pipe(switchMap(response => {

          let newHeaders = request.headers
            .set("access_token", response.accessToken)
            .set("_author", `Bearer ${response.idToken}`);

          localStorage.setItem('access_token', response.idToken);

          request = request.clone({ headers: newHeaders });

          return next.handle(request).pipe(tap((event: HttpEvent<any>) => { }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
              console.log(err)
            }
          }));
        }), catchError((o) => {
          console.log('Custom error',o);

          return next.handle(request);
        }));


      } catch (error) {
        next.handle(request);
      }
    }

}
