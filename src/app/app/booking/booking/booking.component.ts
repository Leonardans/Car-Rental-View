import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';


import { BookingService } from '../booking.service';
import { CarsService } from '../../cars/cars.service';
import { Reservation } from '../interfaces/reservation';
import { Car } from '../../cars/interfaces/car';
import { CreateReservation } from '../interfaces/create-reservation';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrl: './booking.component.css',
})

export class BookingComponent implements OnInit {

    car: Car | null = null;
    carReservations: Reservation[] = [];
    reservationAmount: number = 0;
    // Calendars
    bookedEvents: any[] = [];
    showFirstCalendar: boolean = true;
    showSecondCalendar: boolean = false; 
    showConfirmation: boolean = false;
    selectedDates: string[] = [];
    datesForBooking: string[] = [];
    dataLoaded: boolean = false;

    constructor(private router: Router, private bookingService: BookingService,
         private carsService: CarsService, private authService: AuthService) {}

    ngOnInit() {
        this.car = this.carsService.getSelectedCar();
        console.log('Current carId:' + this.car!.id);
        this.loadCarReservations();
    }

    // Routing
    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    // Full-Calendar Date From 
    firstCalendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: (arg) => this.handleDateClick(arg),
        events: this.bookedEvents,
    };

    // Full-Calendar Date To
    secondCalendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: (arg) => this.handleDateClick(arg),
        events: this.bookedEvents,
    };

    // Load Reservations Data
    loadCarReservations() {
        this.bookingService.getCarReservations(this.car!.id).subscribe(
            (data: Reservation[]) => { 
                console.log('Received full data:', data);
                this.carReservations = data.map((r: Reservation) => {
                    return {
                        id: r.id,
                        dateOfBooking: r.dateOfBooking,
                        dateFrom: r.dateFrom,
                        dateTo: r.dateTo,
                        customerId: r.customerId,
                        carId: r.carId,
                        amount: r.amount,
                    };
                });

            this.addBookedEvents();
            this.dataLoaded = true;
            console.log(this.bookedEvents);

            },
            (error) => {
                console.error('Error fetching rental data:', error);
            }
        );
    }

    // Add Booked Dates
    addBookedEvents() {
        this.carReservations.forEach(reservation => {
            const startDate = new Date(reservation.dateFrom);
            const endDate = new Date(reservation.dateTo);
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString().split('T')[0]; 
                if (!this.bookedEvents.some(event => event.date === dateStr)) {
                    this.bookedEvents.push({
                        title: 'Booked',
                        date: dateStr,
                        backgroundColor: 'red'
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1); 
            }
        });

        this.firstCalendarOptions.events = this.bookedEvents;
        this.secondCalendarOptions.events = this.bookedEvents; 
    }

    // Handle Date Click
    handleDateClick(arg: DateClickArg) {
        console.log(arg.dateStr);
        this.selectedDates.push(arg.dateStr); 
        if (this.selectedDates.length === 1) {
            this.showFirstCalendar = false;
            this.showSecondCalendar = true; 
            this.showConfirmation = false;
        }
        if (this.selectedDates.length === 2) {
            console.log('Selected Dates:', this.selectedDates); 

            if (this.selectedDates.length === 2) {
                console.log('Selected Dates:', this.selectedDates); 
        
                if (this.validateDates(this.selectedDates[0], this.selectedDates[1])) {
                    this.showConfirmation = true;
                    this.reservationAmount = this.calculateTotalAmount(this.selectedDates[0], this.selectedDates[1]);
                    setTimeout(() => {
                        this.scrollToConfirmation(); 
                    }, 100); 
                }
                this.showFirstCalendar = true;
                this.showSecondCalendar = false;
                this.datesForBooking = this.selectedDates;
                this.selectedDates = [];
            }
        }
    }

    // Calculate Total Amount
    calculateTotalAmount(startDate: string, endDate: string): number {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return (end.getTime() - start.getTime()) / (1000 * 3600 * 24) * this.car!.amount;
    }

    // Validates Dates
    validateDates(startDate: string, endDate: string): boolean {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date(); 

        today.setHours(0, 0, 0, 0);

        // Check for booked events
        for (const event of this.bookedEvents) {
            const bookedDate = new Date(event.date); 
            if (bookedDate.toDateString() === end.toDateString() || bookedDate.toDateString() === start.toDateString()) {
                alert("The selected date is already booked.");
                return false;
            }
        }

        // Check if the start date is in the past
        if (start < today) {
            alert("Dates must not be in the past!");
            return false;
        }

        // Check if the second date is later than the first date
        if (end <= start) {
            alert("The second date must be later than the first date.");
            return false;
        }

        // Check if the difference between the two dates is at least 3 days
        const dayDiff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // Convert milliseconds to days
        if (dayDiff < 2) {
            alert("The rental period must be at least 3 days.");
            return false;
        }
    
        return true; 
    }

    // Toggle Calendars Menu
    toggleMenu() {
        this.showFirstCalendar = !this.showFirstCalendar; 
        this.showSecondCalendar = !this.showSecondCalendar;
    }

    // Scroll to Confirmation after Dates picking
    scrollToConfirmation() {
        const confirmationElement = document.querySelector('.confirmation-container');
        if (confirmationElement) {
            confirmationElement.scrollIntoView({ behavior: 'smooth' });
        }
    }   

    // Confirm Booking
    confirmBookingWithoutPayment() {
        const reservation: CreateReservation = {
            dateFrom: this.datesForBooking[0], 
            dateTo: this.datesForBooking[1],
            customerId: this.authService.getCustomerId,
            carId: this.car!.id, 
            amount: this.reservationAmount,
            isPaid: false,
        }

        this.bookingService.makeReservation(reservation).subscribe(
            () => {
                this.router.navigate(['booking-confirmation']);
            },
            (error) => {
                alert(error.error);
                console.log(error.error);
            }
        )
    }

}
