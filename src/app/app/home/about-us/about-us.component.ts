import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrl: './about-us.component.css'
})

export class AboutUsComponent {
    
    constructor(private router: Router) {}

    navigateTo(route: string) {
        this.router.navigate([route]);
    }
  
}
