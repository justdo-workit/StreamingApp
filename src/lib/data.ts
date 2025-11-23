import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export const placeholderImages: ImagePlaceholder[] = PlaceHolderImages;

// Dates should be in the future for countdowns to work.
// Let's set them relative to a future date.
const now = new Date();
const futureDate = (days: number, hours: number = 0, minutes: number = 0) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000).toISOString();
const liveDate = (minutes: number) => new Date(now.getTime() - minutes * 60 * 1000).toISOString();

export const grandPrixes = [
  {
    name: 'Bahrain Grand Prix',
    slug: 'bahrain',
    date: 'Mar 29-31',
    circuit: {
      name: 'Bahrain International Circuit',
      mapImageId: 'circuit-map',
      details: 'A modern desert track known for heavy braking zones and great overtaking opportunities.',
      trackLength: '5.412 km',
      lapCount: 57,
      drsZones: 3,
    },
    schedule: [
      { id: 1, name: 'Practice 1', time: liveDate(0) },
      { id: 2, name: 'Practice 2', time: futureDate(0, 2) },
      { id: 3, name: 'Practice 3', time: futureDate(1, 13) },
      { id: 4, name: 'Qualifying', time: futureDate(1, 17) },
      { id: 5, name: 'Race', time: futureDate(2, 17) },
    ],
  },
  {
    name: 'Saudi Arabian Grand Prix',
    slug: 'saudi-arabia',
    date: 'Apr 5-7',
    circuit: {
      name: 'Jeddah Corniche Circuit',
      mapImageId: 'circuit-map',
      details: 'A fast and flowing street circuit with high-speed corners.',
      trackLength: '6.174 km',
      lapCount: 50,
      drsZones: 3,
    },
    schedule: [
      { id: 1, name: 'Practice 1', time: futureDate(7, 15) },
      { id: 2, name: 'Practice 2', time: futureDate(7, 19) },
      { id: 3, name: 'Practice 3', time: futureDate(8, 15) },
      { id: 4, name: 'Qualifying', time: futureDate(8, 19) },
      { id: 5, name: 'Race', time: futureDate(9, 19) },
    ],
  },
  {
    name: 'Australian Grand Prix',
    slug: 'australia',
    date: 'Apr 19-21',
    circuit: {
      name: 'Albert Park Circuit',
      mapImageId: 'circuit-map',
      details: 'A temporary street circuit in Melbourne with a mix of corners.',
      trackLength: '5.278 km',
      lapCount: 58,
      drsZones: 4,
    },
     schedule: [
      { id: 1, name: 'Practice 1', time: futureDate(21, 12) },
      { id: 2, name: 'Practice 2', time: futureDate(21, 16) },
      { id: 3, name: 'Practice 3', time: futureDate(22, 12) },
      { id: 4, name: 'Qualifying', time: futureDate(22, 16) },
      { id: 5, name: 'Race', time: futureDate(23, 15) },
    ],
  },
   {
    name: 'Japanese Grand Prix',
    slug: 'japan',
    date: 'May 3-5',
    circuit: {
      name: 'Suzuka International Racing Course',
      mapImageId: 'circuit-map',
      details: 'A classic figure-eight layout, a favorite among drivers.',
      trackLength: '5.807 km',
      lapCount: 53,
      drsZones: 1,
    },
     schedule: [
      { id: 1, name: 'Practice 1', time: futureDate(35, 11) },
      { id: 2, name: 'Practice 2', time: futureDate(35, 15) },
      { id: 3, name: 'Practice 3', time: futureDate(36, 11) },
      { id: 4, name: 'Qualifying', time: futureDate(36, 15) },
      { id: 5, name: 'Race', time: futureDate(37, 14) },
    ],
  },
];

export const driverStandings = [
  { position: 1, driver: 'VER', time: '+0.000', points: 25 },
  { position: 2, driver: 'LEC', time: '+2.145', points: 18 },
  { position: 3, driver: 'NOR', time: '+4.331', points: 15 },
  { position: 4, driver: 'SAI', time: '+5.008', points: 12 },
  { position: 5, driver: 'PER', time: '+7.882', points: 10 },
  { position: 6, driver: 'HAM', time: '+10.123', points: 8 },
  { position: 7, driver: 'RUS', time: '+12.456', points: 6 },
  { position: 8, driver: 'ALO', time: '+15.789', points: 4 },
  { position: 9, driver: 'PIA', time: '+18.999', points: 2 },
  { position: 10, driver: 'TSU', time: '+22.345', points: 1 },
  { position: 11, driver: 'STR', time: '+25.678', points: 0 },
  { position: 12, driver: 'HUL', time: '+28.901', points: 0 },
  { position: 13, driver: 'MAG', time: '+31.223', points: 0 },
  { position: 14, driver: 'ALB', time: '+33.555', points: 0 },
  { position: 15, driver: 'RIC', time: '+36.888', points: 0 },
  { position: 16, driver: 'OCO', time: '+40.111', points: 0 },
  { position: 17, driver: 'GAS', time: '+43.444', points: 0 },
  { position: 18, driver: 'BOT', time: '+46.777', points: 0 },
  { position: 19, driver: 'ZHO', time: '+50.000', points: 0 },
  { position: 20, driver: 'SAR', time: '+53.333', points: 0 },
];

export const streamSources = [
    { id: 'de', name: 'German' },
    { id: 'it', name: 'Italy' },
    { id: 'es', name: 'Spain' },
    { id: 'bk1', name: 'Backup' },
    { id: 'bk2', name: 'Backup 2' },
];

export const streamingUrl = "https://sportzonline.top/channels/hd/hd8.php";
