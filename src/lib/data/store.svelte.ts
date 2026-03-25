import type { SupabaseClient } from '@supabase/supabase-js';
import type { Incident } from './incidents';
import { createDb } from '../supabase/queries';

let _incidents = $state<Incident[]>([]);
let _isLoading = $state(false);
let _error = $state<string | null>(null);
let _db: ReturnType<typeof createDb> | null = null;

export const incidentStore = {
	get list() {
		return _incidents;
	},
	get isLoading() {
		return _isLoading;
	},
	get error() {
		return _error;
	},
	/** Initialize with server-loaded data and a supabase client for mutations */
	initFromServer(supabase: SupabaseClient, incidents: Incident[]) {
		_db = createDb(supabase);
		_incidents = incidents;
		_error = null;
	},
	/** Re-fetch from database (e.g. after mutation) */
	async reload(userId?: string) {
		if (!_db) return;
		_isLoading = true;
		_error = null;
		try {
			_incidents = await _db.getIncidents(userId);
		} catch (err) {
			_error = err instanceof Error ? err.message : 'Failed to load incidents';
			console.error('Error loading incidents:', err);
		} finally {
			_isLoading = false;
		}
	},
	async add(incident: Incident, userId?: string) {
		if (!_db) return false;
		const success = await _db.addIncident(incident, userId);
		if (success) {
			_incidents = [..._incidents, incident];
		}
		return success;
	},
	async update(id: string, updated: Incident) {
		if (!_db) return false;
		const success = await _db.updateIncident(id, updated);
		if (success) {
			_incidents = _incidents.map((i) => (i.id === id ? updated : i));
		}
		return success;
	},
	async delete(id: string) {
		if (!_db) return false;
		const success = await _db.deleteIncident(id);
		if (success) {
			_incidents = _incidents.filter((i) => i.id !== id);
		}
		return success;
	},
	reset() {
		_incidents = [];
		_db = null;
	}
};
