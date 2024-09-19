import { Car } from "../../cars/interfaces/car";
import { Employee } from "./employee";

export interface Branch {

    id: number;
    city: string;
    country: string;
    address1: string;
    address2?: string;
    cars: Car[];
    employees: Employee[];

}