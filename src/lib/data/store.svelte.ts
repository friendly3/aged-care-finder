import { facilities as defaultFacilities, type Facility } from './facilities';

const STORAGE_KEY = 'aged-care-facilities';

function loadFacilities(): Facility[] {
	if (typeof window === 'undefined') return defaultFacilities;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			return defaultFacilities;
		}
	}
	return defaultFacilities;
}

function saveFacilities(data: Facility[]) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let _facilities = $state<Facility[]>(loadFacilities());

export const facilityStore = {
	get list() {
		return _facilities;
	},
	add(facility: Facility) {
		_facilities = [..._facilities, facility];
		saveFacilities(_facilities);
	},
	update(id: string, updated: Facility) {
		_facilities = _facilities.map((f) => (f.id === id ? updated : f));
		saveFacilities(_facilities);
	},
	delete(id: string) {
		_facilities = _facilities.filter((f) => f.id !== id);
		saveFacilities(_facilities);
	},
	reset() {
		_facilities = defaultFacilities;
		saveFacilities(_facilities);
	}
};
