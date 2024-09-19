import { Component } from '@angular/core';

@Component({
    selector: 'app-how-it-works',
    standalone: true,
    templateUrl: './how-it-works.component.html',
    styleUrl: './how-it-works.component.css'
})

export class HowItWorksComponent {

    // Open How It Works Modal
    openHowItWorksModal() {
        const modal = document.getElementById('howItWorksModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Close How It Works Modal
    closeHowItWorksModal() {
        const modal = document.getElementById('howItWorksModal');
        if (modal) {
            modal.style.display = 'none'; 
        }
    }

}
