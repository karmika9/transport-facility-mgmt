import { Component, signal, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ride } from './app.types';
import { STORAGE_KEY, todayKey, toMinutes, withinBuffer } from './shared/utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  rides = signal<Ride[]>(this.load());
  filterVehicleType = 'ALL';
  searchTime = '';
  bookingEmpId = '';

  newRide: Omit<Ride, 'id' | 'date' | 'bookedBy'> = {
    driverEmployeeId: '',
    vehicleType: 'Car',
    vehicleNo: '',
    vacantSeats: 1,
    time: '',
    pickup: '',
    destination: '',
  };

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.rides()));
    });
  }

  // -------- Computed --------
  visibleRides = computed(() =>
    this.rides().filter((r) => {
      if (r.date !== todayKey()) return false;
      if (r.vacantSeats <= 0) return false;
      if (this.filterVehicleType !== 'ALL' && r.vehicleType !== this.filterVehicleType)
        return false;
      if (this.searchTime && !withinBuffer(r.time, this.searchTime)) return false;
      return true;
    })
  );

  // -------- Actions --------
  addRide() {
    const ride: Ride = {
      ...this.newRide,
      id: crypto.randomUUID(),
      date: todayKey(),
      bookedBy: [],
    };

    this.rides.update((r) => [...r, ride]);

    this.newRide = {
      driverEmployeeId: '',
      vehicleType: 'Car',
      vehicleNo: '',
      vacantSeats: 1,
      time: '',
      pickup: '',
      destination: '',
    };
  }

  bookRide(ride: Ride) {
    const empId = this.bookingEmpId.trim();
    if (!empId) return;

    this.rides.update((rides) =>
      rides.map((r) => {
        if (r.id !== ride.id) return r;
        if (r.driverEmployeeId === empId) return r; // same employee not allowed
        if (r.bookedBy.includes(empId)) return r; // cannot book twice
        if (r.vacantSeats <= 0) return r;

        return {
          ...r,
          vacantSeats: r.vacantSeats - 1,
          bookedBy: [...r.bookedBy, empId],
        };
      })
    );

    this.bookingEmpId = '';
  }

  // -------- Persistence --------
  private load(): Ride[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
