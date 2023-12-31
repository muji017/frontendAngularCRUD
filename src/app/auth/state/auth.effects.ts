import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "src/app/services/auth.service";
import { adminloginStart, adminloginSuccess, loginFail, loginStart, loginSuccess, signup, signupSuccess } from "./auth.action";
import { catchError, exhaustMap, map, of, pipe, tap } from "rxjs";
// import { AuthUser, Error } from "src/app/store/user.state";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private service: AuthService,
    private router: Router
  ) { }

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.service.login(action.email, action.password).pipe(
          map((data) => {
            console.log(data);
            localStorage.setItem('userToken', data.userToken);
            localStorage.setItem('userId', data.userId)
            return loginSuccess({ data });
          }),
          catchError((error) => {
            console.log(error.error.emailError);
            console.log(error.error.passError)
            return of(loginFail({ error }));
          })
        );
      })
    );
  });


  loginredirect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginSuccess),
      tap((action) => {
        this.router.navigate(['/auth/userhome'])
      })
    )
  },
    { dispatch: false }
  )


  signup$ = createEffect(() => {
    console.log("inside effect");
    return this.actions$.pipe(
      ofType(signup),
      exhaustMap((action) => {
        return this.service.signup(action.name, action.email, action.password).pipe(
          map((data) => {
            return signupSuccess({ data });
          })
        );
      })
    )
  })
  signupredirect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signupSuccess),
      tap((action) => {
        this.router.navigate(['/auth/userhome'])
      })
    )
  },
    { dispatch: false }
  )

  // admin 

  adminlogin$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(adminloginStart),
      exhaustMap((action)=>{
        return this.service.adminlogin(action.email,action.password).pipe(
           map((data)=>{
            
            localStorage.setItem('adminToken', data.userToken);
            localStorage.setItem('adminId', data.userId)
            return adminloginSuccess({data})
           }),
           catchError((error)=>{
             return  of(loginFail({ error }));
           })
        )
      })
    )
  })

  adminloginredirect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(adminloginSuccess),
      tap((action) => {
        this.router.navigate(['/auth/adminhome'])
      })
    )
  },
    { dispatch: false }
  )

}