import { Component, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../interfaces/employee';
import { AuthService } from '../../auth/auth.service';
import { BusinessService } from '../business.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employee-management',
    templateUrl: './employee-management.component.html',
    styleUrl: './employee-management.component.css'
})

export class EmployeeManagementComponent {

    @ViewChild('content_add_employee') contentAddEmployee!: TemplateRef<any>;
	@Output() employeeAdded = new EventEmitter<void>();

    private modalService = inject(NgbModal);
    closeResult = '';

	employeeForm!: FormGroup;
    employees: Employee[] = [];
	selectedEmployee!: Employee;
    successMessage: string | null = null;
    errorMessage: string | null = null;
	firstname: string = '';
	lastname: string = '';
    username: string = '';
    password: string = '';
	email: string = '';
    position: string = '';
    selectedBranchId!: number;

    constructor(private router: Router, private authService: AuthService, private businessService: BusinessService, private fb: FormBuilder) {}

	navigateTo(route: string) {
        this.router.navigate([route]);
    }

    // On Business ID
    ngOnInit() {
        this.employeeForm = this.fb.group({
			firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-Я\s]+$/) ]],
			lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-Я\s]+$/) ]],
			username: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[A-Za-z0-9]{8,}$/) ]],
			email: ['', [Validators.required, Validators.email ]],
            position: ['', [Validators.required, this.positionValidator()]]
		});

		// Load All Employees Data
		this.loadEmployeeData() 
    }

	// MANAGER or EMPLOYEE
    positionValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const validPositions = ['MANAGER', 'EMPLOYEE'];
            const isValid = validPositions.includes(control.value);
            return isValid ? null : { invalidPosition: { value: control.value } };
        };
    }

    // Open Modal
    open(content: TemplateRef<any>) {
		this.resetForm();
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	// Close Modal
	private getDismissReason(reason: any): string {
		this.resetForm();
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

	// POST : Employee Submit
	onSubmitEmployee() {
		if (this.employeeForm.invalid) {
			console.log('Not valid form.');
			return;
		}

		const formData = new FormData();
		formData.append('firstname', this.employeeForm.get('firstname')?.value);
		formData.append('lastname', this.employeeForm.get('lastname')?.value);
		formData.append('username', this.employeeForm.get('username')?.value);
		formData.append('password', this.employeeForm.get('password')?.value);
		formData.append('email', this.employeeForm.get('email')?.value);
		formData.append('position', this.employeeForm.get('position')?.value);

		this.businessService.submitEmployeeForm(formData, this.selectedBranchId).subscribe(
			() => {
				this.successMessage = `${this.employeeForm.get('position')?.value} was added successfully!`;
				this.resetForm();
				this.modalService.dismissAll();
				this.employeeAdded.emit();
			},
			(error: any) => {
                this.errorMessage = error.error || 'Employee Registration failed. Please try again.';
				this.successMessage = null; 
                console.log(error);
            }
		);
	}

	// GET : Load Rental Employees
	loadEmployeeData() {
		this.businessService.getRentalEmployeesData().subscribe(
			(data: Employee[]) => {
			console.log('Received data:', data); 
			
			// Data Checking
			if (data && Array.isArray(data)) { 
				this.employees = Array.isArray(data) ? data.map((e: Employee) => ({
					id: e.id,
					firstname: e.firstname, 
					lastname: e.lastname,   
					username: e.username,
					email: e.email,
					position: e.position,
					branchId: e.branchId, 
					password: ''
				})) : [];
				
				this.sortEmployees();
			} else {
				console.log('Employee data is empty or is undefined');
				this.employees = []; 
			}
		}, 
		(error) => {
			console.error('Error:', error);
		});
	}

    // Select Branch
    selectBranchId(branchId: number) {
        this.selectedBranchId = branchId;
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

	// Branch Close Confirm Modal
    openDeleteEmployeeModal(employee: any) {
        this.selectedEmployee = employee; 
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Close Employee Deleting Modal
    closeModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.style.display = 'none'; 
        }
    }

    // Close Employee from Branch
    confirmDeleteEmployee() {
        this.businessService.deleteEmployee(this.selectedEmployee.branchId, this.selectedEmployee.id).subscribe(
            () => {
                console.log('Employee deleted successfully.');
                this.loadEmployeeData(); 
                this.closeModal(); 
            },
            (error) => {
                console.error('Error deleting Employee:', error);
            }
        );
    }

	// Reset forms
	resetForm() {
		this.employeeForm.reset();
		this.firstname = '';
		this.lastname = '';
		this.username = '';
		this.password = '';
		this.email = '';
		this.position = '';
        this.successMessage = null;	
		this.errorMessage = null;
    }

}
