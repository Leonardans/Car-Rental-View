import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swiper from 'swiper/bundle';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Car } from '../interfaces/car';
import { CarsService } from '../cars.service';

@Component({
	selector: 'app-additional-car-info',
	templateUrl: './additional-car-info.component.html',
	styleUrl: './additional-car-info.component.css'
})

export class AdditionalCarInfoComponent {
	@ViewChild('content_car_info') contentCarInfo!: TemplateRef<any>;

	car!: Car;

	private modalService = inject(NgbModal);
		closeResult = '';

	constructor(private router: Router, private carsService: CarsService) {}

	ngOnInit() {

    }

	navigateTo(route: string) {
		this.router.navigate([route]);
	}	

	// Car Addition Info Modal
	open(content: TemplateRef<any>, car: Car) {
		this.car = car;
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);

		const swiper = new Swiper('.swiper', {
			direction: 'horizontal',
			loop: false,
			slidesPerView: 'auto',
			slidesPerGroup: 1,
			
			autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },

		});
	}

	// Close Car Addition Info Modal
	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

	// Take Car ID to Booking
    bookCar(car: Car) {
        this.carsService.setSelectedCar(car);
    }

}
