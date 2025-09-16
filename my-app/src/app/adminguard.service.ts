import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminguardService implements CanActivate {

  constructor(private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    if(isPlatformBrowser(this.platformId)){
        const loginData = JSON.parse(localStorage.getItem('loginID') || '{}');
    const loginID = loginData?.loginID;
    const isAdmin = loginData?.isAdmin;

    if (loginID && isAdmin) {
      return true; // ✅ only allow if user is logged in AND admin
    }

    alert("Admins only. Redirecting to login...");
    this.router.navigate(['/login']);
    return false;
  }
  return false;
    }
    
}
