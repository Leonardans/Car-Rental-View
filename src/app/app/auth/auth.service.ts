import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from './interfaces/login-request';
import { BusinessLoginResponse } from './interfaces/business/business-login-response';
import { CustomerLoginResponse } from './interfaces/customer/customer-login-response';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    // RESTFUL APIS

    // Auth Controller
    private authApi = environment.baseURL + '/auth';
    // Business Controller
    private businessApi = environment.baseURL + '/rentals';
    // Customer Controller
    private customerApi = environment.baseURL + '/customers';
    // Rental Partnrs Controller
    private rentalPartnersApi = environment.baseURL + '/rental-partners';

    // Registration API
    private rentalAddUrl = this.authApi + '/rentals/sign-up';
    private customerAddUrl = this.authApi + '/customers/sign-up';
     
    // Login API
    private businessCheckUrl = this.authApi + '/rentals/sign-in';
    private customerCheckUrl = this.authApi + '/customers/sign-in';

    // Logout API
    private logoutUrl = this.authApi + '/logout';

    // Rental Logo API 
    private rentalLogoUrl = this.rentalPartnersApi + '/logos';

    // Login state
    // Customer / Business State
    private loggedInSubject = new BehaviorSubject<boolean>(false); 
    userLoggedIn = this.loggedInSubject.asObservable(); 
    // User Type checking
    private userTypeSubject = new BehaviorSubject<string>('Guest'); 
    userType = this.userTypeSubject.asObservable();
    // Rental ID
    private rentalIdSubject = new BehaviorSubject<number>(0);
    rentalId = this.rentalIdSubject.asObservable();
    // Rental Logo
    private rentalLogoSubject = new BehaviorSubject<string>('');
    rentalLogo$ = this.rentalLogoSubject.asObservable();
    // Customer ID
    private customerIdSubject = new BehaviorSubject<number>(0);
    customerId = this.customerIdSubject.asObservable();

    // Admin State
    private loggedInAdmin = new BehaviorSubject<boolean>(false); 
    adminLoggedIn = this.loggedInAdmin.asObservable();

    constructor(private router: Router, private http: HttpClient) {
        const storedRentalId = localStorage.getItem('rentalId');
        if (storedRentalId) {
            this.rentalIdSubject.next(Number(storedRentalId)); 
        }
        const storedRentalLogo = localStorage.getItem('rentalLogoFileName');
        if (storedRentalLogo) {
            this.rentalLogoSubject.next(storedRentalLogo);
        }
        const storedCustomerId = localStorage.getItem('customerId');
        if (storedCustomerId) {
            this.customerIdSubject.next(Number(storedCustomerId)); 
        }
        this.checkToken();
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    // Token
    private readonly TOKEN_KEY = 'auth_token';
    // Check Token
    private checkToken(): void {
        const token = this.getToken();
        if (token) {
            this.setLoggedIn(true);
            this.setUserRole(localStorage.getItem('userType') || 'Guest');
        }
    }
    // Get Token
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    // Set Token
    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }
    // Clear Token
    private clearToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem('token');
    }
    // Check if token expired
    isTokenExpired(token: string): boolean {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; 

        console.log(decoded);
        return decoded.exp! < currentTime; 
    }

    // Set Logged In State
    setLoggedIn(value: boolean) {
        this.loggedInSubject.next(value);
    }
    // Set Role
    setUserRole(role: string) {
        this.userTypeSubject.next(role);
        this.loggedInSubject.next(true);
    }
    // Set Rental Logo 
    setRentalLogoSubject(rentalLogo: string) {
        this.rentalLogoSubject.next(rentalLogo);
    }
    // Set Rental ID
    setRentalIdSubject(rentalid: number) {
        this.rentalIdSubject.next(rentalid);
    }
    // Set Customer ID
    setCustomerIdSubject(customerId: number) {
        this.customerIdSubject.next(customerId);
    }

    // Get Role
    getUserRole(): string {
        const userRole = localStorage.getItem('userType');
        this.setUserRole(userRole!);

        return this.userTypeSubject.value; 
    }
    // Get Business ID
    public get getBusinessId() {
        const rentalId = localStorage.getItem('rentalId');
        this.setRentalIdSubject(parseInt(rentalId!));

        return this.rentalIdSubject.getValue();
    }
    // Get Customer ID
    public get getCustomerId() {
        const customerId = localStorage.getItem('customerId');
        this.setCustomerIdSubject(parseInt(customerId!));

        return this.customerIdSubject.getValue();
    }
    // Get Rental LogoPath
    public get getRentalLogoPath() {
        const rentalLogo = localStorage.getItem('rentalLogo');
        this.setRentalLogoSubject(rentalLogo!);

        return this.rentalLogoSubject.getValue();
    }
    // Get Rental Partners Logos Url
    public get getLogoUrls() {
        return this.rentalLogoUrl;
    }


    // POST : Customer Registration
    submitCustomerForm(formData: FormData) {
        return this.http.post(this.customerAddUrl, formData);
    }

    // POST : Business Registration
    submitBusinessForm(formData: FormData) {
        return this.http.post(this.rentalAddUrl, formData);
    }

    // POST : Business Login
    submitBusinessLogin(loginRequest: LoginRequest) {
        return this.http.post<BusinessLoginResponse>(this.businessCheckUrl, loginRequest).pipe(
            map((response: BusinessLoginResponse) => {

                this.setToken(response.token);
                this.loggedInSubject.next(true);
                this.userTypeSubject.next('Business');
                this.rentalIdSubject.next(response.businessId);
                this.rentalLogoSubject.next(`${this.rentalLogoUrl}/${response.logoFileName}`);

                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userType', 'Business');
                localStorage.setItem('rentalId', response.businessId.toString());
                localStorage.setItem('rentalLogo', `${this.rentalLogoUrl}/${response.logoFileName}`);

                console.log('Current rentalId:', this.rentalIdSubject.getValue());
                console.log('Current rentalLogoFileName:', this.rentalLogoSubject.getValue());
                console.log('Token: ' + response.token);
                const decoded = jwtDecode(response.token);
                console.log('Dekoded Token: ', decoded);
                const decodedHeader = jwtDecode(response.token, { header: true });
                console.log(decodedHeader);         

            return response;
            })
        );
    }

    // POST : Customer Login
    submitCustomerLogin(loginRequest: LoginRequest) {
        return this.http.post<CustomerLoginResponse>(this.customerCheckUrl, loginRequest).pipe(
            map((response: CustomerLoginResponse) => {
                this.setToken(response.token);
                this.loggedInSubject.next(true);
                this.userTypeSubject.next('Customer');
                this.customerIdSubject.next(response.customerId);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userType', 'Customer');
                localStorage.setItem('customerId', response.customerId.toString());

                console.log('Current customerId:', this.customerIdSubject.getValue());
                console.log('Token: ' + response.token);

                return response;
            })
        );
    }

    // POST : Logout
    logout() {
        const token = this.getToken(); 
        if (!token || this.isTokenExpired(token)) { 
            this.clearUserData();
            return of({ success: true }); 
        }
    
        return this.http.post(this.logoutUrl, {}).pipe(
            tap((response: any) => {
                if (response && response.success) {
                    this.clearUserData(); 
                }
            }),
            catchError((error) => {
                console.error('Logout failed', error);
                this.clearUserData(); 
                return throwError(() => error); 
            })
        );
    }

    adminLogin() {
        this.loggedInAdmin.next(true);
    }

    // Clear Data
    private clearUserData() {
        this.clearToken();
        this.loggedInSubject.next(false);
        this.userTypeSubject.next('Guest');
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.setItem('userType', 'Guest');
        localStorage.removeItem('rentalId');
        localStorage.removeItem('rentalLogo');
        localStorage.removeItem('customerId');
        localStorage.removeItem('car');
        this.router.navigate(['/']); 
    }
   
}