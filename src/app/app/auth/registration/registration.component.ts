import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css'
})

export class RegistrationComponent {

    @ViewChild('content_registration') contentRegistration!: TemplateRef<any>;

    private modalService = inject(NgbModal);
    closeResult = '';

	customerForm!: FormGroup;
  	businessForm!: FormGroup;
	successMessage: string | null = null;
	errorMessage: string | null = null;
	userType: string = 'Customer';
	// Customer
	username: string = '';
	firstname: string = '';
	lastname: string = '';
    password: string = '';
	email: string = '';
	mainAddress: string = '';
    additionalAddress: string = '';
	city: string = '';
	country: string = 'Estonia';
	licence: string = '';
	// Bussiness
	owner: string = '';
    businessName: string = '';
	businessUsername: string = '';
    businessPassword: string = '';
	businessEmail: string = '';
	mainBusinessAddress: string = '';
	additionaBusinesslAddress: string = '';
	businessCity: string = '';
	businessCountry: string = 'Estonia';
	businessLogo: File | null = null;
	selectedFile: File | null = null;

	constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {} 

	ngOnInit() {
		this.customerForm = this.fb.group({
			firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-Я\s]+$/) ]],
			lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-Я\s]+$/) ]],
			username: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[A-Za-z0-9]{8,}$/) ]],
			email: ['', [Validators.required, Validators.email ]],
			mainAddress: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9À-ÿ\s,.-]{5,}$/)]],
			additionalAddress: ['', Validators.pattern(/^[A-Za-z0-9À-ÿ\s,.-]{5,}$/)],
			city: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-ЯõäöüÕÄÖÜ\s'-]+$/)]],
			country: ['Estonia', [Validators.required, this.countryValidator() ]],
			licence: ['', [Validators.required, Validators.minLength(2) ]]
		});

		this.businessForm = this.fb.group({
			owner: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-Я\s]+$/) ]],
			businessName: ['', [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.{1,20}$)([a-zA-Z]+(?:\s[a-zA-Z]+){0,2})\.?$/)]],
			businessUsername: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
			businessPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[A-Za-z0-9]{8,}$/) ]],
			businessEmail: ['', [Validators.required, Validators.email]],
			mainBusinessAddress: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9À-ÿ\s,.-]{5,}$/)]],
			additionaBusinesslAddress: ['', Validators.pattern(/^[A-Za-z0-9À-ÿ\s,.-]{5,}$/)],
			businessCity: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-ЯõäöüÕÄÖÜ\s'-]+$/)]],
			businessCountry: ['Estonia', [Validators.required, this.countryValidator() ]],
			businessLogo: [null, [Validators.required, this.validateFile]], 
		});

	}
	
	// Logo Checking
	validateFile: ValidatorFn = (control: AbstractControl) => {
		if (control.value) {
			const file = control.value;
			if (file.type !== 'image/png') {
				return { invalidFileType: true };
			}
			if (file.size > 5 * 1024 * 1024) { // 5MB
				return { invalidFileSize: true };
			}
		}

		return null;
	}

	// Check country - Estonia
	countryValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const isValid = control.value === 'Estonia';

			return isValid ? null : { invalidCountry: true };
		};
	}

	// Business logo
	onFileSelected(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			this.selectedFile = file; 
	
			this.businessForm.get('businessLogo')?.setValue(file);
		}
	}

	// Customer Licence Select
	selectLicence(licence: string) {
		this.customerForm.get('licence')?.setValue(licence);
	}
	
	// Open Registration Modal
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
		this.firstname = '';
		this.lastname = '';
		this.password = '';
		this.email = '';
		this.mainAddress = '';
		this.additionalAddress = '';
		this.city = '';
		this.country = 'Estonia';
		this.customerForm.get('country')?.setValue(this.country);
		this.licence = '';
		this.owner = '';
		this.businessName = '';
		this.businessPassword = '';
		this.businessUsername = '';
		this.businessEmail ='';
		this.mainBusinessAddress = '';
		this.additionaBusinesslAddress = '';
		this.businessCity = '';
		this.businessCountry = 'Estonia';
		this.businessForm.get('businessCountry')?.setValue(this.businessCountry);
		this.businessLogo = null;
		this.selectedFile = null;
        this.successMessage = null;
		this.errorMessage = null;
    }

	// Submit
	// Customer Submit
	onSubmitCustomer() {
		if (this.customerForm.invalid) {
			console.log('Not valid form.');
			return;
		}

		const formData = new FormData();
		formData.append('firstname', this.customerForm.get('firstname')?.value);
		formData.append('lastname', this.customerForm.get('lastname')?.value);
		formData.append('username', this.customerForm.get('username')?.value);
		formData.append('password', this.customerForm.get('password')?.value);
		formData.append('email', this.customerForm.get('email')?.value);
		formData.append('address1', this.customerForm.get('mainAddress')?.value);
		if (this.customerForm.get('additionalAddress')?.value) {
			formData.append('address2', this.customerForm.get('additionalAddress')?.value);
		}
		formData.append('city', this.customerForm.get('city')?.value);
		formData.append('country', this.customerForm.get('country')?.value);
		formData.append('licence', this.customerForm.get('licence')?.value);

		this.authService.submitCustomerForm(formData).subscribe(
			() => {
				this.successMessage = 'Registration successful!';
				this.errorMessage = null; 
				this.customerForm.reset();
			},
			(error) => {
				console.error('Registration error:', error);
				this.successMessage = null; 
				this.errorMessage = error.error || 'An error occurred. Please try again.';
			}
		);
	}

	// Business Submit
	onSubmitBusiness() {
		if (this.businessForm.invalid) {
			console.log('Not valid form.');
			return;
		}

		const formData = new FormData();
		formData.append('owner', this.businessForm.get('owner')?.value);
		formData.append('name', this.businessForm.get('businessName')?.value);
		formData.append('username', this.businessForm.get('businessUsername')?.value);
		formData.append('password', this.businessForm.get('businessPassword')?.value);
		formData.append('email', this.businessForm.get('businessEmail')?.value);
		formData.append('address1', this.businessForm.get('mainBusinessAddress')?.value);
		formData.append('city', this.businessForm.get('businessCity')?.value);
		formData.append('country', this.businessForm.get('businessCountry')?.value);
		formData.append('logo', this.businessForm.get('businessLogo')?.value);

		if (this.businessForm.get('additionaBusinesslAddress')?.value) {
			formData.append('address2', this.businessForm.get('additionaBusinesslAddress')?.value);
		}

		this.authService.submitBusinessForm(formData).subscribe(
			() => {
				this.successMessage = 'Business registration successful!';
				this.errorMessage = null; 
				this.businessForm.reset();
			},
			(error) => {
				console.error('Registration error:', error);
				this.successMessage = null; 
				this.errorMessage = error.error || 'An error occurred. Please try again.';
			}
		);
	}

}
