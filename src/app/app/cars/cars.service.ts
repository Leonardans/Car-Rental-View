import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 
import { Car } from './interfaces/car';

@Injectable({
    providedIn: 'root'
})

export class CarsService {
    // RESTFUL APIS
    
    // Cars Controller
    private carsApi = environment.baseURL + '/cars';

    // API Endpoint: Get all Cars
    private getAllCarsUrl = this.carsApi;

    // Selected Card ID for Booking
    private selectedCar: Car | null = null;

    constructor(private http: HttpClient) {}

    // Set Car to local storage for comfortable booking
    setSelectedCar(car: Car) {
        this.selectedCar = car;
        localStorage.setItem('car', JSON.stringify(car));
    }
    
    // Get Car from local storage for comfortable booking
    getSelectedCar(): Car | null {
        const carString = localStorage.getItem('car'); 
        if (carString) {
            this.selectedCar = JSON.parse(carString); 
            return this.selectedCar;
        }
        return null; 
    }

    // GET : all Cars
    getCarData(): Observable<Car[]> {
        return this.http.get<Car[]>(this.getAllCarsUrl);
    }

}