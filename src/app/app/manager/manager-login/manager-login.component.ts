import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-manager-login',
    templateUrl: './manager-login.component.html',
    styleUrl: './manager-login.component.css'
})

export class ManagerLoginComponent {

    @ViewChild('content_manager_login') contentManagerLogin!: TemplateRef<any>;

    constructor(private authService: AuthService, private router: Router) {}

    private modalService = inject(NgbModal);
    closeResult = '';

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

	open(content: TemplateRef<any>) {
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

    // Admin Submit
    onAdminLoginSubmit() {
        this.authService.adminLogin(); 
    }

}
