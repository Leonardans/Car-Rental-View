import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { AdditionalCarInfoComponent } from '../additional-car-info/additional-car-info.component';
import { Car } from '../interfaces/car';

import { CarsService } from '../cars.service';


@Component({
    selector: 'app-cars',
    templateUrl: './cars.component.html',
    styleUrl: './cars.component.css'
})

export class CarsComponent {

    @ViewChild(AdditionalCarInfoComponent) additionalCarInfo!: AdditionalCarInfoComponent;

    cars: Car[] = []; 
    filteredCars: Car[] = [];
    displayedCars: Car[] = [];

    isLargeScreen: boolean = false;
    selectedBrand: string = '';
    selectedModel: string = '';
    selectedBodyType: string = '';
    selectedColor: string = '';
    selectedCity: string = '';
    selectedOrder: string = '';

    fromDate: NgbDate | null = null; 
    toDate: NgbDate | null = null; 

    currentCount: number = 12; 
    maxCount: number = 120; 


    constructor(private router: Router, private carsService: CarsService) {}

    // Routing
    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    // Checking
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.checkScreenSize(); 
    }

    checkScreenSize() {
        this.isLargeScreen = window.innerWidth >= 1200; 
    }

    // Load Cars OnInit
    ngOnInit() {
        this.checkScreenSize();
        this.loadCars(); 
    }

    // Load Cars from Server and Transform Data Method
    loadCars() {
        this.carsService.getCarData().subscribe(
            (data: Car[]) => {
                this.cars = data.map(car => ({
                    id: car.id,
                    amount: car.amount, 
                    carStateNumberPlate: car.carStateNumberPlate,
                    mileage: car.mileage, 
                    status: car.status,
                    year: car.year, 
                    brand: car.brand, 
                    model: car.model, 
                    bodyType: car.bodyType, 
                    color: car.color, 
                    city: car.city,
                    imagePaths: car.imagePaths,
                    branchId: car.branchId,
                    rentalId: car.rentalId,
                }));
                this.filteredCars = this.cars; 
                this.updateDisplayedCars(); 
            },
            (error) => {
                console.error('Error loading car data:', error);
            }
        );
    }

    // Load More Cars Method
    loadMoreCars() {
        this.currentCount += 12; 
        this.displayedCars = this.filteredCars.slice(0, this.currentCount); 
    }

    // Reload displayedCars 
    updateDisplayedCars() {
        this.displayedCars = this.filteredCars.slice(0, this.currentCount);
    }

    // Data from user
    onDateRangeSelected(dateRange: { fromDate: NgbDate | null, toDate: NgbDate | null }) {
        this.fromDate = dateRange.fromDate;
        this.toDate = dateRange.toDate;
        console.log('Selected Date Range:', this.fromDate, this.toDate); 
    }

    // Open additional car info
    openAdditionalCarInfo(car?: Car) {
        this.additionalCarInfo.open(this.additionalCarInfo.contentCarInfo, car!);
    }

    // Filtering 
    filterCars() {
        this.filteredCars = this.cars.filter(car => {

            return (this.selectedBrand ? car.brand === this.selectedBrand : true) &&
                (this.selectedModel ? car.model === this.selectedModel : true) &&
                (this.selectedBodyType ? car.bodyType === this.selectedBodyType : true) &&
                (this.selectedColor ? car.color === this.selectedColor : true) &&
                (this.selectedCity ? car.city === this.selectedCity : true);
        });

        this.currentCount = 12; 
        this.updateDisplayedCars();
    }

    // Sort Cars By Price
    sortByPrice() {
        this.filteredCars.sort((a, b) => {
            if (this.selectedOrder === 'Ascending') {
                return a.amount - b.amount; 
            } else if (this.selectedOrder === 'Descending') {
                return b.amount - a.amount; 
            }
            return 0; 
        });

        this.currentCount = 12; 
        this.updateDisplayedCars();
    }

    // Select Brand
    selectBrand(brand: string) {
        this.selectedBrand = brand;
        this.filterCars();
    }

    // Select City
    selectCity(city: string) {
        this.selectedCity = city;
        this.filterCars();
        console.log('System working!')
    }
    
    // Select Model
    selectModel(model: string) {
        this.selectedModel = model;
        this.filterCars();
    }

    // Select Body Type
    selectBodyType(bodyType: string) {
        this.selectedBodyType = bodyType;
        this.filterCars();
    }

    // Select Color
    selectColor(color: string) {
        this.selectedColor = color;
        this.filterCars();
    }

    // Select Price
    selectPrice(priceCategory: string) {
        this.selectedOrder = priceCategory;
        this.sortByPrice();
    }

    // Reset filter
    resetFilters() {
        this.selectedBrand = '';
        this.selectedModel = '';
        this.selectedBodyType = '';
        this.selectedColor = '';
        this.selectedOrder = '';
    
        this.filteredCars = this.cars; 
        this.currentCount = 12; 
        this.updateDisplayedCars(); 
    }

    // Take Car ID to Booking
    bookCar(car: Car) {
        if(car.status != 'UNAVAILABLE') {
            this.carsService.setSelectedCar(car);
            this.router.navigate(['booking']); 
        } else {
            alert('Car is Unavailable!');
        }
    }

}