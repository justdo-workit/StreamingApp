import type { ImagePlaceholder } from "./placeholder-images";
import { PlaceHolderImages } from "./placeholder-images";

export const placeholderImages: ImagePlaceholder[] = PlaceHolderImages;

// Dates should be in the future for countdowns to work.
// Let's set them relative to a future date.
const now = new Date();

function futureDate(iso: string): string;
function futureDate(days: number, hours?: number, minutes?: number): string;
function futureDate(
	a: number | string,
	hours: number = 0,
	minutes: number = 0
): string {
	if (typeof a === "string") {
		return new Date(a).toISOString();
	}
	return new Date(
		now.getTime() +
			a * 24 * 60 * 60 * 1000 +
			hours * 60 * 60 * 1000 +
			minutes * 60 * 1000
	).toISOString();
}

function liveDate(iso: string): string;
function liveDate(minutes: number): string;
function liveDate(a: number | string): string {
	if (typeof a === "string") {
		return new Date(a).toISOString();
	}
	return new Date(now.getTime() - a * 60 * 1000).toISOString();
}

export const grandPrixes = [
	{
		name: "Qatar Grand Prix",
		slug: "qatar",
		date: "Nov 28-30",
		cover:
			"https://1qvc381awg.ucarecd.net/1f397391-2ac6-4333-900a-3367cea8b4b2/qatar2025.png",
		circuit: {
			name: "Lusail International Circuit",
			mapImageId: "qatar-circuit-map",
			mapImageUrl:
				"https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.webp",
			details:
				"A fast, flowing night circuit with long corners that reward aerodynamic efficiency.",
			firstGrandPrix: "2021",
			raceDistance: "308.611 km",
			trackLength: "5.419 km",
			fastestLapTime: "Lando Norris (1:22.384) ",
			lapCount: 57,
			drsZones: 2,
			//	raceDistance :'308.611 km', fastestlaptime:'Lando Norris (1:22.384) ',
		},
		schedule: [
			// Qatar 2025 is a sprint weekend:
			{
				id: 1,
				name: "Practice 1",
				time: liveDate("2025-11-28T16:30:00+03:00"),
			},
			{
				id: 2,
				name: "Sprint Qualifying",
				time: futureDate("2025-11-28T20:30:00+03:00"),
			},
			{ id: 3, name: "Sprint", time: futureDate("2025-11-29T17:00:00+03:00") },
			{
				id: 4,
				name: "Qualifying",
				time: futureDate("2025-11-29T21:00:00+03:00"),
			},
			{ id: 5, name: "Race", time: futureDate("2025-11-30T19:00:00+03:00") },
		],
	},
	{
		name: "Abu Dhabi Grand Prix",
		slug: "abu-dhabi",
		date: "Dec 5-7",
		cover:
			"https://1qvc381awg.ucarecd.net/0c6e6220-91cb-4225-9ea4-b41dbdb843f2/abudhabi.png",
		circuit: {
			name: "Yas Marina Circuit",
			mapImageId: "abu-dhabi-circuit-map",

			mapImageUrl:
				"https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.webp",
			details:
				"A twilight race on a modern circuit featuring a mix of slow corners and long straights.",
			firstGrandPrix: "2009",
			raceDistance: "306.183 km",
			trackLength: "5.287 km",
			fastestLapTime: " Kevin Magnussen (1:25.637) ",
			lapCount: 58,
			drsZones: 2,
		},
		schedule: [
			// Typical non-sprint weekend layout (times are placeholders, adjust to official times you prefer):
			{
				id: 1,
				name: "Practice 1",
				time: liveDate("2025-12-05T13:30:00+04:00"),
			},
			{
				id: 2,
				name: "Practice 2",
				time: futureDate("2025-12-05T17:00:00+04:00"),
			},
			{
				id: 3,
				name: "Practice 3",
				time: futureDate("2025-12-06T14:30:00+04:00"),
			},
			{
				id: 4,
				name: "Qualifying",
				time: futureDate("2025-12-06T18:00:00+04:00"),
			},
			{ id: 5, name: "Race", time: futureDate("2025-12-07T17:00:00+04:00") },
		],
	},
];

export const driverStandings = [
	{ position: 1, driver: "VER", time: "+0.000", points: 25 },
	{ position: 2, driver: "LEC", time: "+2.145", points: 18 },
	{ position: 3, driver: "NOR", time: "+4.331", points: 15 },
	{ position: 4, driver: "SAI", time: "+5.008", points: 12 },
	{ position: 5, driver: "PER", time: "+7.882", points: 10 },
	{ position: 6, driver: "HAM", time: "+10.123", points: 8 },
	{ position: 7, driver: "RUS", time: "+12.456", points: 6 },
	{ position: 8, driver: "ALO", time: "+15.789", points: 4 },
	{ position: 9, driver: "PIA", time: "+18.999", points: 2 },
	{ position: 10, driver: "TSU", time: "+22.345", points: 1 },
	{ position: 11, driver: "STR", time: "+25.678", points: 0 },
	{ position: 12, driver: "HUL", time: "+28.901", points: 0 },
	{ position: 13, driver: "MAG", time: "+31.223", points: 0 },
	{ position: 14, driver: "ALB", time: "+33.555", points: 0 },
	{ position: 15, driver: "RIC", time: "+36.888", points: 0 },
	{ position: 16, driver: "OCO", time: "+40.111", points: 0 },
	{ position: 17, driver: "GAS", time: "+43.444", points: 0 },
	{ position: 18, driver: "BOT", time: "+46.777", points: 0 },
	{ position: 19, driver: "ZHO", time: "+50.000", points: 0 },
	{ position: 20, driver: "SAR", time: "+53.333", points: 0 },
];

export const streamSources = [
	{ id: "de", name: "German" },
	{ id: "it", name: "Italy" },
	{ id: "es", name: "Spain" },
	{ id: "bk1", name: "Backup" },
	{ id: "bk2", name: "Backup 2" },
];

export const streamingUrls: Record<string, string> = {
	
  default: "https://ihatestreams.xyz/embed/f2c69cd3-8715-11f0-b385-bc2411b21e0d",
  unlockHD: "https://ihatestreams.xyz/embed/1a0edc01-8363-11f0-b385-bc2411b21e0d",
	de: "https://ihatestreams.xyz/embed/e3ed1ecf-3cdb-11f0-afb1-ecf4bbdafde4",
	it: "https://ihatestreams.xyz/embed/f2c69cd3-8715-11f0-b385-bc2411b21e0d",
	es: "https://ihatestreams.xyz/embed/cf8088c4-8712-11f0-b385-bc2411b21e0d",
	bk1: "https://ihatestreams.xyz/embed/1a0edc01-8363-11f0-b385-bc2411b21e0d",
	bk2: "https://ihatestreams.xyz/embed/1a0edc01-8363-11f0-b385-bc2411b21e0d",
};
