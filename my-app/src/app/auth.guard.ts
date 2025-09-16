import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'   // ✅ makes it injectable everywhere
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)){
       const loginData = JSON.parse(localStorage.getItem('loginID') || '{}');
    const loginID = loginData?.loginID;
    const isAdmin = loginData?.isAdmin;

    if (loginID) {
      return true; // ✅ allow access
    } else {
      alert("You must log in or be an admin to access this page.");
      this.router.navigate(['/login']);
      return false; // ❌ block access
    }
  }
  return false;
    }
  
}