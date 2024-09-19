export interface CreateReservation {

    dateFrom: string; 
    dateTo: string; 
    customerId: number;
    carId: number; 
    amount: number;
    isPaid: boolean;

}