import { Component, OnInit } from '@angular/core';
import { BranchInfo } from '../interfaces/branch-info';
import { BookingService } from '../booking.service';

@Component({
    selector: 'app-booking-confirmation',
    templateUrl: './booking-confirmation.component.html',
    styleUrl: './booking-confirmation.component.css',
})

export class BookingConfirmationComponent implements OnInit {

    // Branch Info Object
    branchInfo!: BranchInfo;

    constructor(private bookingService: BookingService) {}


    ngOnInit() {
        this.loadBranchInfo();
    }

    // Load Branch Info for Customer
    loadBranchInfo() {
        const carString = localStorage.getItem('car');
        let rentalId = 0;
        let branchId = 0
        if (carString) {
            const car = JSON.parse(carString);
            console.log(car);
            rentalId = parseInt(car.rentalId);
            branchId = parseInt(car.branchId);
        }

        this.bookingService.getBranchInfo(branchId, rentalId).subscribe(
            (data: BranchInfo) => { 
                this.branchInfo = data; 
                console.log(this.branchInfo); 
            },
            (error) => {
                console.log(error.error);
            }
        )
    }

   
}
