import { Component, ViewChild } from '@angular/core';
import { AuthService } from './app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent {
    title = 'View';

    constructor(private router: Router, private authService: AuthService) {}

    navigateTo(route: string) {
        this.router.navigate([route]);
    }


    // Hold Authentication
    ngOnInit() {
        const token = this.authService.getToken(); 
        const userType = this.authService.getUserRole();

        if (token) {
            this.authService.setLoggedIn(true); 
            if (userType) {
                console.log(userType);
                this.authService.setUserRole(userType); 
            }
            if (userType === 'Business') {
                const rentalLogo = localStorage.getItem('rentalLogo');
                console.log(rentalLogo)
                this.authService.setRentalLogoSubject(rentalLogo!);
            }
        } else {
            this.authService.setLoggedIn(false);
        }
    }

}
