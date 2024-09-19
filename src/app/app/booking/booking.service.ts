import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from './interfaces/reservation';
import { CreateReservation } from './interfaces/create-reservation';
import { BranchInfo } from './interfaces/branch-info';

@Injectable({
    providedIn: 'root'
})

export class BookingService {
    // RESTful APIs

    // Reservations Controller
    private reservationsApi = environment.baseURL + '/reservations';

    // API Endpoint: Get Car Reservations
    private carReservationsUrl = this.reservationsApi + '/cars/'; //{carId}
    // API Endpoint: Get Customer Reservations
    private customerReservationsUrl = this.reservationsApi + '/customer/'; //{customerId}
    // API Endpoint: Add new car Reservation
    private reservationUrl = this.reservationsApi;
    // API Endpoint: Get Branch Info
    private branchInfoUrl = this.reservationsApi + '/rentals'; 

    
    constructor(private http: HttpClient) { }


    // GET: Retrieve All Car Reservations
    getCarReservations(carId: number): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(this.carReservationsUrl + carId);
    }

    // API Endpoint: Get Branch by ID
    getBranchInfoUrl(branchId: number, rentalId: number) {
        return `${this.branchInfoUrl}/${rentalId}/branches/${branchId}`;
    }

    // POST: Add new car Reservation 
    makeReservation(reservation: CreateReservation): Observable<CreateReservation> {
        return this.http.post<CreateReservation>(this.reservationUrl, reservation);
    }

    // GET : Retrieve Branch Info by Branch ID
    getBranchInfo(branchId: number, rentalId: number): Observable<BranchInfo> {
        return this.http.get<BranchInfo>(this.getBranchInfoUrl(branchId, rentalId));
    }

}
