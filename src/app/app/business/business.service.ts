import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AuthService } from '../auth/auth.service';
import { Rental } from './interfaces/rental';
import { Employee } from './interfaces/employee';

@Injectable({
    providedIn: 'root'
})

export class BusinessService {
    // RESTful APIs

    // Business Controller
    private businessApi = environment.baseURL + '/rentals';

   
    // API Endpoint: Get Rental Data
    getRentalDataUrl() {
        return `${this.businessApi}/${this.authService.getBusinessId}`;
    }
    // API Endpoint: Get Rental Employee Data
    getRentalEmployeesUrl() {
        return `${this.businessApi}/${this.authService.getBusinessId}/employees`;
    }
    // API Endpoint: Create New Branch
    createBranchUrl() {
        return `${this.businessApi}/${this.authService.getBusinessId}/branches`;
    }
    // API Endpoint: Close Branch
    closeBranchUrl(branchId: number) {
        return `${this.businessApi}/${this.authService.getBusinessId}/branches/${branchId}`;
    }
    // API Endpoint: Add New Employee in Branch
    addEmployeeUrl(branchId: number) {
        return `${this.businessApi}/${this.authService.getBusinessId}/branches/${branchId}/employees`;
    }
    // API Endpoint: Delete Employee
    deleteEmployeeUrl(branchId: number, employeeId: number) {
        return `${this.businessApi}/${this.authService.getBusinessId}/branches/${branchId}/employees/${employeeId}`;
    }
    // API Endpoint: Add New Car in Branch
    addNewCarUrl(branchId: number) {
        return `${this.businessApi}/${this.authService.getBusinessId}/branches/${branchId}/cars`;
    }
    // API Endpoint: Remove Car from Branch
    removeOneCarUrl(branchId: number, carId: number) {
        return `${this.businessApi}/${this.authService.getBusinessId}/branches/${branchId}/cars/${carId}`;
    }

    constructor(private authService: AuthService, private http: HttpClient) {}


    // GET: Retrieve All Rental Data
    getRentalData(): Observable<Rental> {
        return this.http.get<Rental>(this.getRentalDataUrl());
    }

    // GET: Retrieve All Rental Employees Data
    getRentalEmployeesData(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.getRentalEmployeesUrl());
    }

    // POST: Submit Branch Registration Form
    submitBranchForm(formData: FormData) {
        return this.http.post(this.createBranchUrl(), formData);
    }

    // POST: Submit Employee Registration Form
    submitEmployeeForm(formData: FormData, branchId: number) {
        return this.http.post(this.addEmployeeUrl(branchId), formData);
    }

    // POST: Add New Car to Rental
    addNewCar(newCarData: FormData, branchId: number) {
        return this.http.post(this.addNewCarUrl(branchId), newCarData);
    }

    // DELETE: Close Branch by Branch ID
    closeBranch(branchId: number) {
        return this.http.delete(this.closeBranchUrl(branchId));
    }

    // DELETE: Delete Employee by Employee ID
    deleteEmployee(branchId: number, employeeId: number) {
        return this.http.delete(this.deleteEmployeeUrl(branchId, employeeId));
    }

    // DELETE: Remove Car by Car ID
    removeOneCar(branchId: number, carId: number) {
        return this.http.delete(this.removeOneCarUrl(branchId, carId));
    }

}
