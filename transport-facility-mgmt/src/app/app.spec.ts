import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value),
    clear: () => (store = {}),
  };
})();

describe('TransportFacilityComponent', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new ride', () => {
    component.newRide = {
      driverEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'KA01AB1234',
      vacantSeats: 2,
      time: '10:00',
      pickup: 'Office',
      destination: 'Home',
    };

    component.addRide();

    expect(component.rides().length).toBe(1);
    expect(component.rides()[0].driverEmployeeId).toBe('EMP1');
  });
});
