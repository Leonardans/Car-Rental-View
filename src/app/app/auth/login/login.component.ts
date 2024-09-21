import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../interfaces/login-request';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {

    @ViewChild('content_login') contentLogin!: TemplateRef<any>;
    
    private modalService = inject(NgbModal);
    closeResult = '';
  
    customerForm!: FormGroup;
    businessForm!: FormGroup;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    userType: string = 'Customer';
    // Customer
	username: string = '';
    password: string = '';
    // Bussiness
    businessName: string = '';
    businessPassword: string = '';


    constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {} 


    ngOnInit() {
		this.customerForm = this.fb.group({
			username: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9._-]{3,}$/)]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9._-]{3,}$/)]],
		});
	
		this.businessForm = this.fb.group({
			businessName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^.{2,}$/)]],
			businessPassword: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^.{2,}$/)]],
		});
	}

    // Open Login Modal
    open(content: TemplateRef<any>) {
        this.onUserTypeChange();
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
        );
    }

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

    // Reset forms
    onUserTypeChange() {
        this.customerForm.reset();
		this.businessForm.reset();
        this.username = '';
        this.password = '';
        this.businessName = '';
        this.businessPassword = '';
        this.successMessage = null;
		this.errorMessage = null; 
    }

	// Business Login Submit
    onSubmitBusiness() {
        if (this.businessForm.invalid) {
            console.log('Not valid form.');
            return;
        }

        const loginRequest: LoginRequest = {
            username: this.businessForm.get('businessName')?.value,
            password: this.businessForm.get('businessPassword')?.value,
        };

        this.authService.submitBusinessLogin(loginRequest).subscribe(
            () => { 
                this.successMessage = 'Business login successful!';
                this.errorMessage = null; 
                this.onUserTypeChange();
                this.modalService.dismissAll(); 
                location.reload();
            },
            (error) => {
                if (error.status === 401) {
                    this.errorMessage = error.error || 'Invalid username or password.';
                } else {
                    this.errorMessage = 'An error occurred. Please try again.';
                }
                this.successMessage = null; 
            }
        );  
    }

	// Customer Login Submit
	onSubmitCustomer() {
		if (this.customerForm.invalid) {
			console.log('Not valid form.');
			return;
		}

		const loginRequest: LoginRequest = {
            username: this.customerForm.get('username')?.value, 
            password: this.customerForm.get('password')?.value, 
        };

		this.authService.submitCustomerLogin(loginRequest).subscribe(
            () => { 
                this.successMessage = 'Business login successful!';
                this.errorMessage = null; 
                this.onUserTypeChange();
                this.modalService.dismissAll(); 
                location.reload();
            },
            (error) => {
                if (error.status === 401) {
                    this.errorMessage = error.error || 'Invalid username or password.';
                } else {
                    this.errorMessage = 'An error occurred. Please try again.';
                }
                this.successMessage = null; 
            }
        );
	}
    
}
