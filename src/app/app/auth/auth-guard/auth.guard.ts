import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { roles } from './role';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService); 
    const router = inject(Router); 

    type UserRole = 'Guest' | 'Customer' | 'Business' | 'Manager';

    const userRole = authService.getUserRole() as UserRole; 

    const currentPath = route.url.map(segment => segment.path).join('/');

    const allowedRoutes = roles[userRole]?.allowedRoutes;

    if (allowedRoutes && allowedRoutes.includes(currentPath)) {
        return true; 
    } else {
        location.reload();
        return false; 
    }
    
};