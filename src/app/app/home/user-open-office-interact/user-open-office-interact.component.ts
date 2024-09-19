import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from '../../auth/login/login.component';
import { RegistrationComponent } from '../../auth/registration/registration.component';

@Component({
	selector: 'app-user-open-office-interact',
	templateUrl: './user-open-office-interact.component.html',
	styleUrl: './user-open-office-interact.component.css'
})

export class UserOpenOfficeInteractComponent {

    @ViewChild('content_open_office_interact') contentOpenOfficeInteract!: TemplateRef<any>;
    @ViewChild(LoginComponent) loginComponent!: LoginComponent;
    @ViewChild(RegistrationComponent) registrationComponent!: RegistrationComponent;

    private modalService = inject(NgbModal);
	closeResult = '';

	// Open Modal
	open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	// Close Modal
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

    // Call Login Modal
    callLoginModal() {
        this.loginComponent.open(this.loginComponent.contentLogin);
    }

    // Call Registration Modal 
    callRegistrationModal(tab: string = 'Business') {
        this.registrationComponent.open(this.registrationComponent.contentRegistration);
    }
    
}
