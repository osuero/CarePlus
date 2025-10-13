import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable, of, share, switchMap } from 'rxjs';
import { User } from '@core/models/interface';
import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { LocalStorageService } from '@shared/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;
  user$ = new BehaviorSubject<User>({});

  private change$ = merge(this.tokenService.change()).pipe(
    switchMap(() => {
      return this.assignUser(this.user$);
    }),
    share()
  );

  constructor(
    private tokenService: TokenService,
    private loginService: LoginService,
    private store: LocalStorageService
  ) {}

  public get currentUserValue(): User {
    return this.store.get('currentUser');
  }

  change() {
    return this.change$;
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      switchMap((response) => {
        const returnValue = JSON.parse(JSON.stringify(response))['token'];
        this.tokenService.set(returnValue);
        const roleData: [] = JSON.parse(JSON.stringify(response))['user'][
          'roles'
        ];
        roleData.sort((a: any, b: any) => {
          const aPri: number = a['priority'];
          const bPri: number = b['priority'];
          if (aPri > bPri) return 1;
          else if (aPri < bPri) return -1;
          else return 0;
        });
        this.tokenService.roleArray = roleData;
        this.tokenService.permissionArray = JSON.parse(
          JSON.stringify(response)
        )['user']['permissions'];

        this.user$.next(JSON.parse(JSON.stringify(response))['user']);
        this.store.set('currentUser', response.user);

        // Store role names in a new array
        const roleNames = this.tokenService.roleArray.map(
          (role: { name: string }) => role.name
        );

        const roleNamesJSON = JSON.stringify(roleNames);

        // Store the JSON string in LocalStorage
        this.store.set('roleNames', roleNamesJSON);

        return of(response); // Return the response to be handled in the component
      })
    );
  }

  check() {
    return this.tokenService.valid();
  }

  logout() {
    // remove user from local storage to log user out
    this.store.clear();
    // this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }

  assignUser(user: BehaviorSubject<User>): Observable<User> {
    this.user$.next(this.currentUserValue); // Update the user$ BehaviorSubject with the new value
    return this.user$.asObservable(); // Return an observable that emits the new user value
  }
}
