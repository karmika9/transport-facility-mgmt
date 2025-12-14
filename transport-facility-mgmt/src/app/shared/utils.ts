export const STORAGE_KEY = 'rides_v1';
export const todayKey = () => new Date().toISOString().slice(0, 10);
export const toMinutes = (t: string) => {
const [h, m] = t.split(':').map(Number);
return h * 60 + m;
};
export const withinBuffer = (a: string, b: string, buffer = 60) =>
Math.abs(toMinutes(a) - toMinutes(b)) <= buffer;