// src/app/routes/roles.ts
export class Role {
    constructor(public name: string, public allowedRoutes: string[]) {}
}

export const roles = {

    Guest: new Role('Guest', [
        '', 
        'about-us', 
        'partners',
        'partners',
        'user-open-office-interact',
        'login', 
        'registration', 
        'cars', 
        'cars-additional-info',
        'how-it-works',
    ]),

    Customer: new Role('Customer', [
        '', 
        'about-us', 
        'partners',
        'login', 
        'registration', 
        'cars', 
        'cars-additional-info', 
        'how-it-works',
        'booking', 
        'booking-confirmation',
        'payment', 
        'garage', 
        'rented', 
        'renewal'
    ]),

    Business: new Role('Business', [
        '', 
        'about-us', 
        'partners',
        'login', 
        'registration', 
        'cars', 
        'cars-additional-info', 
        'how-it-works',
        'open-branch', 
        'office-management', 
        'employee-management'
    ]),

    Manager: new Role('Manager', [
        '', 
        'about-us', 
        'partners',
        'login', 
        'registration', 
        'cars', 
        'cars-additional-info', 
        'how-it-works',
        'booking', 
        'payment', 
        'garage', 
        'rented', 
        'renewal', 
        'manager-login', 
        'manager-panel', 
        'manager-panel/statistics', 
        'manager-panel/car-loan', 
        'manager-panel/car-return', 
        'manager-panel/car-addition'
    ]),

};
