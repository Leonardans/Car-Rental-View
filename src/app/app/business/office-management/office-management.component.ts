import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, FormBuilder, ValidationErrors, FormArray } from '@angular/forms';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Branch } from '../interfaces/branch';
import { Employee } from '../interfaces/employee';
import { Car } from '../../cars/interfaces/car';
import { BusinessService } from '../business.service';
import { AuthService } from '../../auth/auth.service';
import { EmployeeManagementComponent } from '../employee-management/employee-management.component';
import { OpenBranchComponent } from '../open-branch/open-branch.component';
import { Rental } from '../interfaces/rental';

@Component({
    selector: 'app-office-management',
    templateUrl: './office-management.component.html',
    styleUrl: './office-management.component.css'
})

export class OfficeManagementComponent {

    @ViewChild(EmployeeManagementComponent) employeeManagementComponent!: EmployeeManagementComponent;
    @ViewChild(OpenBranchComponent) openBranchComponent!: OpenBranchComponent;
    
    branches: Branch[] = [];
    selectedBranch!: Branch;
    selectedCarId!: number;
    cars: Car[] = [];
    employees: Employee[] = [];
    // New Car Form
    newCarForm!: FormGroup;
	successMessage: string | null = null;
	errorMessage: string | null = null;
    brand: string = '';
    model: string = '';
    bodyType: string = '';
    price: string = '';
    car_state_number_plate: string = '';
    mileage: string = '';
    status: string = '';
    year: string = '';
    color: string = '';
    city: string = '';
    colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Pink', 'Silver', 'Grey', 'Purple', 'Gold'];
    bodyTypes = ['Sedan', 'Coupe', 'Hatchback', 'SUV', 'Crossover', 'Minivan', 'Roadster'];
    models = ['Huracán', '508', 'Cullinan', 'Levante', 'Escalade', 'Bentayga', 'XE', 'Charger', 'Swift', 'Leon', 'RX', 'Outlander', 'Range Rover', 'Macan', 'Cooper', 'C3', 'Astra', 'Cherokee', '500', 'Giulia', 'Model 3', 'Forester', '3008', 'Tucson', 'CX-5', 'Octavia', 'Sportage', 'Megane', 'XC60', 'GLE', 'Qashqai', 'Golf', 'Civic', 'A4', 'X5', 'Fiesta', 'Corolla'];
    brands = ['Lamborghini', 'Mini', 'Land Rover', 'BMW', 'Audi', 'Mercedes-Benz', 'Toyota', 'Ford', 'Honda', 'Volkswagen', 'Nissan', 'Volvo', 'Renault', 'Kia', 'Skoda', 'Mazda', 'Hyundai', 'Peugeot', 'Subaru', 'Tesla', 'Alfa Romeo', 'Fiat', 'Jeep', 'Opel', 'Citroën', 'Porsche', 'Mitsubishi', 'Lexus', 'Seat', 'Suzuki', 'Dodge', 'Jaguar', 'Bentley', 'Cadillac', 'Maserati', 'Rolls-Royce'];
    photoFiles: File[] = [];

    private modalService = inject(NgbModal);
    closeResult = '';
    isAddEmployeeModalVisible: any;

    constructor(private authService: AuthService, private businessService: BusinessService, private fb: FormBuilder) {}

    ngOnInit() {
        this.loadRentalData();
    
        this.newCarForm = this.fb.group({
            price: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]],
            car_state_number_plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3} \d{3}$/)]],
            mileage: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            year: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear())]], 
            bodyType: ['', [Validators.required, this.arrayValidator(this.bodyTypes)]],
            brand: ['', [Validators.required, this.arrayValidator(this.brands)]],
            color: ['', [Validators.required, this.arrayValidator(this.colors)]],
            model: ['', [Validators.required, this.arrayValidator(this.models)]],
            photos: this.fb.array([], [this.photosValidator])
        });
    }

    // Check posibility
    arrayValidator(validValues: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            return validValues.includes(value) ? null : { invalidValue: true };
        };
    }

    // Reset File 
    onFileChange(event: any) {
        const files: FileList = event.target.files;
        const photosArray = this.newCarForm.get('photos') as FormArray;
        photosArray.clear();

        if (files.length > 5) {
            this.errorMessage = 'You can upload a maximum of 5 photos.';
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (files[i]) {
                photosArray.push(this.fb.control(files[i])); 
            }
        }

        if (photosArray.length < 1) {
            this.errorMessage = 'You must upload at least 1 photo.';
        } else {
            this.errorMessage = null;
        }
    }
    
    // Check images
    photosValidator(control: AbstractControl): { [key: string]: any } | null {
        if (control instanceof FormArray) {
            const valid = control.length >= 1 && control.length <= 5;
            return valid ? null : { invalidPhotoCount: true };
        }
        return null; 
    }

    // GET : Load Business Data
    loadRentalData() {
        this.businessService.getRentalData().subscribe(
            (data: Rental) => {
                console.log('Received full data:', data);
    
                if (data && Array.isArray(data.branches)) {
                    this.branches = data.branches.map((b: Branch) => {
                        console.log(`Branch ID: ${b.id}`);
                        console.log(`Branch Address: ${b.address1}, ${b.city}, ${b.country}`);
                        return {
                            id: b.id,
                            city: b.city,
                            country: b.country,
                            address1: b.address1,
                            address2: b.address2,
                            cars: b.cars,
                            employees: b.employees
                        };
                    });
                    console.log('Branches after mapping:', this.branches);
                } else {
                    console.error('Branch data is empty or is undefined');
                    this.branches = [];
                }
            },
            (error) => {
                console.error('Error fetching rental data:', error);
            }
        );
    }

    // POST : New Car Submit
    onSubmitNewCar() {
        if (this.newCarForm.invalid) {
            console.log('Not valid form.');
            return;
        }
    
        const newCarData = new FormData();
        newCarData.append('amount', this.newCarForm.get('price')?.value);
        newCarData.append('carStateNumberPlate', this.newCarForm.get('car_state_number_plate')?.value);
        newCarData.append('mileage', this.newCarForm.get('mileage')?.value);
        newCarData.append('year', this.newCarForm.get('year')?.value);
        newCarData.append('bodyType', this.newCarForm.get('bodyType')?.value);
        newCarData.append('brand', this.newCarForm.get('brand')?.value);
        newCarData.append('color', this.newCarForm.get('color')?.value);
        newCarData.append('model', this.newCarForm.get('model')?.value);
        
  
        const photos = this.newCarForm.get('photos')?.value;
        if (photos && photos.length > 0) {
            for (let i = 0; i < photos.length; i++) {
                newCarData.append('pictures', photos[i]); 
            }
        }
    
        const branchId = this.selectedBranch.id;

        this.businessService.addNewCar(newCarData, branchId).subscribe(
            () => {
                    this.successMessage = 'Car was added successfully!'; 
                    this.closeAddCarModal();
                    this.loadRentalData(); 
            },
            (error) => {
                if (error.status === 403) {
                    this.errorMessage = 'A manager must be hired in the branch with ID 6 before adding a car!';
                } else {
                    this.errorMessage = error.error;
                }
                this.successMessage = null; 
                console.log(error);
            }
        );
    }
    
    // Open Modals
    open(content: TemplateRef<any>, branch: Branch) {
        this.selectedBranch = branch; 
        this.cars = (branch.cars !== undefined) ? branch.cars : [];
        this.employees = (branch.employees !== undefined) ? branch.employees : [];
        this.sortEmployees();
        const modalRef = this.modalService.open(content, { 
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
        });
        
        modalRef.result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    // Close Modals
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

    // Car Adding Modal
    openAddNewCarModal() {
        this.resetForm();
        const modal = document.getElementById('addNewCarModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Close Car Adding Modal
    closeAddCarModal() {
        this.resetForm();
        const modal = document.getElementById('addNewCarModal');
        if (modal) {
            modal.style.display = 'none'; 
        }
    }   

    // Branch Close Confirm Modal
    openDeleteBranchModal(branch: any) {
        this.selectedBranch = branch; 
        const modal = document.getElementById('branchConfirmationModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Close Branch closing Modal
    closeBranchDeleteModal() {
        const modal = document.getElementById('branchConfirmationModal');
        if (modal) {
            modal.style.display = 'none'; 
        }
    }

    // Delete (Close) Branch
    confirmCloseBranch() {
        this.businessService.closeBranch(this.selectedBranch.id).subscribe(
            () => {
                console.log('Branch closed successfully:');
                this.loadRentalData(); 
                this.closeBranchDeleteModal(); 
            },
            (error) => {
                console.error('Error closing branch:', error);
            }
        );
    }

    // Car Delete Confirm Modal
    openDeleteCarModal(car: any) {
        this.selectedCarId = car.id; 
        const modal = document.getElementById('carConfirmationModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Close Car deleting Modal
    closeCarDeleteModal() {
        const modal = document.getElementById('carConfirmationModal');
        if (modal) {
            modal.style.display = 'none'; 
        }
    }

    // Delete Car
    confirmCarDelete() {
         this.businessService.removeOneCar(this.selectedBranch.id, this.selectedCarId).subscribe(
            () => {
                console.log('Car Deleted successfully:');
                this.loadRentalData(); 
                this.closeCarDeleteModal();
                this.modalService.dismissAll(); 
            },
            (error) => {
                this.errorMessage = 'An unexpected error occurred. Please try again.';
                console.log(error);
            }
        );
    }

    // Reload Data After Deleting one Employee
    onEmployeeDeleted() {
        this.loadRentalData();
    }

    // Open Add Employee Modal
    openAddEmployeeModal() {
        console.log('Selected Branch ID:', this.selectedBranch.id);
        console.log('Employee Management Component:', this.employeeManagementComponent);

        this.employeeManagementComponent.selectBranchId(this.selectedBranch.id);
        this.employeeManagementComponent.open(this.employeeManagementComponent.contentAddEmployee);
    }

    // If no branches present
    openAddBranchModal() {
        this.openBranchComponent.open(this.openBranchComponent.contentOpenBranch);
    }

    // Sort Employee by position
	sortEmployees() {
		this.employees.sort((a, b) => {
			if (a.position === 'MANAGER' && b.position !== 'MANAGER') {
			    return -1; 
			} else if (a.position !== 'MANAGER' && b.position === 'MANAGER') {
			    return 1; 
			}
			return 0; 
		});
	}

    // Reload Data After Adding New Branch
    onBranchCreated() {
        this.loadRentalData();
    }

    // Reload Data After Adding New Employee
    onEmployeeAdded() {
        this.loadRentalData();
    }

    // Car checking for right shadow in screen
    countAvailableCars(branch: any): number {
        return branch.cars.filter((car: { status: string; }) => car.status === 'AVAILABLE').length;
    }

    // Reset forms
	resetForm() {
		this.newCarForm.reset();
		this.price = '';
		this.car_state_number_plate = '';
		this.status = '';
		this.bodyType = '';
        this.brand = '';
        this.color = '';
        this.model = '';
        this.city = '';
        this.successMessage = null;	
		this.errorMessage = null;
    }

}