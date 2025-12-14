export type VehicleType = 'Bike' | 'Car';

export interface Ride {
id: string;
driverEmployeeId: string; // unique per ride
vehicleType: VehicleType;
vehicleNo: string;
vacantSeats: number;
time: string; // HH:mm
pickup: string;
destination: string;
date: string; // YYYY-MM-DD (today only)
bookedBy: string[]; // employeeIds
}