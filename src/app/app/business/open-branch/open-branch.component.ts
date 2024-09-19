import { Component, EventEmitter, inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService } from '../business.service';

@Component({
	selector: 'app-open-branch',
	templateUrl: './open-branch.component.html',
	styleUrl: './open-branch.component.css'
})

export class OpenBranchComponent {
    
    @ViewChild('content_open_branch') contentOpenBranch!: TemplateRef<any>;
	@Output() branchCreated = new EventEmitter<void>();

    private modalService = inject(NgbModal);
	closeResult = '';

	openBranchForm!: FormGroup;
	successMessage: string | null = null;
	errorMessage: string | null = null;
	// Data
	mainBranchAddress: string = '';
    additionalBranchAddress: string = '';
	branchCity: string = '';
	branchCountry: string = 'Estonia';


	constructor(private businessService: BusinessService, private fb: FormBuilder, private router: Router) {} 

	ngOnInit() {
		this.openBranchForm = this.fb.group({
			mainBranchAddress: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s,.-]+$/) ]],
			additionalBranchAddress: ['', [Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s,.-]+$/) ]],
			branchCity: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я\s'-]+$/) ]],
			branchCountry: ['Estonia', [Validators.required, this.countryValidator() ]],
		});
	
	}

	// Check country - Estonia
	countryValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const isValid = control.value === 'Estonia';

			return isValid ? null : { invalidCountry: true };
		};
	}

	// Open Branch Modal
	open(content: TemplateRef<any>) {
		this.resetForm();
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	// Close Branch Modal
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

	// Branch Submit
	onSubmitBranch() {
		if (this.openBranchForm.invalid) {
			console.log('Not valid form.');
			return;
		}

		const formData = new FormData();
		formData.append('address1', this.openBranchForm.get('mainBranchAddress')?.value);
		formData.append('city', this.openBranchForm.get('branchCity')?.value);
		formData.append('country', this.openBranchForm.get('branchCountry')?.value);

		if (this.openBranchForm.get('additionalBranchAddress')?.value) {
			formData.append('address2', this.openBranchForm.get('additionalBranchAddress')?.value);
		}

		this.businessService.submitBranchForm(formData).subscribe(
			() => {
				this.successMessage = 'Branch registration successful!';
				this.resetForm();
				this.branchCreated.emit();
				this.modalService.dismissAll(); 
			},
			(error) => {
				this.errorMessage = error.error || 'Branch registration failed. Please try again.';
				this.successMessage = null; 
				console.log(error);
			}
		);
	}

	// Reset forms
	resetForm() {
		this.openBranchForm.reset();
		this.mainBranchAddress = '';
		this.additionalBranchAddress = '';
		this.branchCity = '';
		this.branchCountry = '';
        this.successMessage = null;	
		this.errorMessage = null;
    }

}
