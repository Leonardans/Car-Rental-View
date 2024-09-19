import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RentalPartner } from '../../business/interfaces/rental-partner';
import Swiper from 'swiper/bundle';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-partners',
    templateUrl: './partners.component.html',
    styleUrl: './partners.component.css'
})

export class PartnersComponent {

    rentalLogos: RentalPartner[] = [];
    private swiper: any;
    private intervalId: any;

    constructor(private http: HttpClient, private authService: AuthService) {}

    ngOnInit(): void {
        this.fetchRentalPartnerLogos();

        this.swiper = new Swiper('.swiper', {
            direction: 'horizontal',
			loop: false,
			slidesPerView: 'auto',
			slidesPerGroup: 1,
			
            spaceBetween: 30,
			
        });
        /*this.startAutoplay();*/
    }

    /*
    ngOnDestroy() {
        this.stopAutoplay();
    }
    
    private startAutoplay() {
        this.intervalId = setInterval(() => {
            const moveDistance = 100;
            const currentTranslate = this.swiper.getTranslate(); 
            const newTranslate = currentTranslate - moveDistance; 
    
            this.swiper.setTranslate(newTranslate);
    
            if (Math.abs(newTranslate) >= this.swiper.width * (this.swiper.slides.length - 1)) {
                this.swiper.setTranslate(0); 
            }
        }, 200); 
    }
    
    private stopAutoplay() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
    }
    */
   
    // Fetch all Partners Logos
    fetchRentalPartnerLogos() {
        this.http.get<RentalPartner[]>('http://localhost:8080/rental-partners/logos').subscribe(
            (partners) => {
                this.rentalLogos = partners; 
                console.log('Loaded rental partner logos:', this.rentalLogos);
                
                this.loadPartnerLogos();
            },
            (error) => {
                console.error('Error loading rental partner logos:', error);
            }
        );
    }

    // Load all Partners Logos
    loadPartnerLogos() {
        this.rentalLogos.forEach(partner => {
            this.http.get(partner.logoUrl, { responseType: 'blob' } 
            )
            .subscribe(
                response => {
                    const url = window.URL.createObjectURL(response); 
                    partner.logoUrl = url; 
                },
                error => {
                    console.error(`Error loading rental partner logo for: ${partner.name}:`, error);
                    partner.logoUrl = ''; 
                }
            );
        });
    }

}



