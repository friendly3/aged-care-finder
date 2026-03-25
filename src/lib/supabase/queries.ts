import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'
import type { Facility } from '../data/facilities'
import type { Incident } from '../data/incidents'
import type { TeamLeader, Driver } from '../data/team'

export type SupabaseFacility = Database['public']['Tables']['facilities']['Row']
export type SupabaseIncident = Database['public']['Tables']['incidents']['Row']

// Convert Supabase row to our app's Facility type
export function toFacility(row: SupabaseFacility): Facility {
	return {
		id: row.id,
		name: row.name,
		provider: row.provider || '',
		type: row.type as any,
		address: row.address || '',
		suburb: row.suburb || '',
		state: row.state || '',
		postcode: row.postcode || '',
		phone: row.phone || '',
		starRating: row.star_rating || 0,
		qualityMeasures: row.quality_measures as any || { residents: 0, compliance: 0, staffing: 0, quality: 0 },
		services: row.services || [],
		totalBeds: row.total_beds || 0,
		availableBeds: row.available_beds || 0,
		dailyPrice: row.daily_price as any || { from: 0, to: 0 },
		refundableDeposit: row.refundable_deposit as any || { from: 0, to: 0 },
		description: row.description || '',
		lastAuditDate: row.last_audit_date || '',
		complianceStatus: row.compliance_status as any || 'Met',
		latitude: row.latitude || 0,
		longitude: row.longitude || 0,
		funding: row.funding || 0
	}
}

// Convert app Incident to Supabase format
export function toIncidentInsert(incident: Incident, userId?: string): any {
	return {
		id: incident.id,
		reference_no: incident.referenceNo,
		date_received: incident.dateReceived,
		time: incident.time,
		type: incident.type,
		driver: incident.driver,
		team_leader: incident.teamLeader,
		response: incident.response,
		reference_text: incident.referenceText,
		action: incident.action,
		date_response: incident.dateResponse || null,
		time_response: incident.timeResponse || null,
		status: 'Open',
		user_id: userId || null
	}
}

// Convert partial Incident (camelCase) to Supabase update payload (snake_case only)
export function toIncidentUpdate(updates: Partial<Incident>): any {
	const payload: any = {
		updated_at: new Date().toISOString()
	};

	if (updates.referenceNo !== undefined) payload.reference_no = updates.referenceNo;
	if (updates.dateReceived !== undefined) payload.date_received = updates.dateReceived;
	if (updates.time !== undefined) payload.time = updates.time;
	if (updates.type !== undefined) payload.type = updates.type;
	if (updates.driver !== undefined) payload.driver = updates.driver;
	if (updates.teamLeader !== undefined) payload.team_leader = updates.teamLeader;
	if (updates.response !== undefined) payload.response = updates.response;
	if (updates.referenceText !== undefined) payload.reference_text = updates.referenceText;
	if (updates.action !== undefined) payload.action = updates.action;
	if (updates.dateResponse !== undefined) payload.date_response = updates.dateResponse;
	if (updates.timeResponse !== undefined) payload.time_response = updates.timeResponse;

	return payload;
}

export function createDb(supabase: SupabaseClient) {
	return {
		// Facilities
		async getFacilities(): Promise<Facility[]> {
			const { data, error } = await supabase
				.from('facilities')
				.select('*')
				.order('name')

			if (error) {
				console.error('Error fetching facilities:', error)
				return []
			}

			return (data || []).map(toFacility)
		},

		async getFacilityById(id: string): Promise<Facility | null> {
			const { data, error } = await supabase
				.from('facilities')
				.select('*')
				.eq('id', id)
				.single()

			if (error || !data) return null
			return toFacility(data)
		},

		// Incidents
		async getIncidents(userId?: string): Promise<Incident[]> {
			let query = supabase
				.from('incidents')
				.select('*')
				.order('date_received', { ascending: false })

			if (userId) {
				query = query.eq('user_id', userId)
			}

			const { data, error } = await query

			if (error) {
				console.error('Error fetching incidents:', error)
				return []
			}

			return (data || []).map(row => ({
				id: row.id,
				dateReceived: row.date_received,
				time: row.time || '',
				sender: '',
				teamLeader: row.team_leader || '',
				type: row.type || '',
				marked: '',
				referenceNo: row.reference_no || '',
				referenceText: row.reference_text || '',
				driver: row.driver || '',
				response: row.response || '',
				dateResponse: row.date_response || '',
				timeResponse: row.time_response || '',
				action: row.action || ''
			}))
		},

		async addIncident(incident: Incident, userId?: string) {
			const { error } = await supabase
				.from('incidents')
				.insert(toIncidentInsert(incident, userId))

			if (error) console.error('Error adding incident:', error)
			return !error
		},

		async updateIncident(id: string, updates: Partial<Incident>) {
			const { error } = await supabase
				.from('incidents')
				.update(toIncidentUpdate(updates))
				.eq('id', id)

			if (error) console.error('Error updating incident:', error)
			return !error
		},

		async deleteIncident(id: string) {
			const { error } = await supabase
				.from('incidents')
				.delete()
				.eq('id', id)

			if (error) console.error('Error deleting incident:', error)
			return !error
		},

		// Team Leaders
		async getTeamLeaders(userId?: string): Promise<TeamLeader[]> {
			let query = supabase
				.from('team_leaders')
				.select('*')
				.order('name')

			if (userId) {
				query = query.eq('user_id', userId)
			}

			const { data, error } = await query

			if (error) {
				console.error('Error fetching team leaders:', error)
				return []
			}

			return (data || []).map(row => ({
				id: row.id,
				name: row.name || '',
				email: row.email || undefined,
				phone: row.phone || undefined,
				created_at: row.created_at
			}))
		},

		async addTeamLeader(leader: TeamLeader, userId?: string) {
			const { error } = await supabase
				.from('team_leaders')
				.insert({
					id: leader.id,
					name: leader.name,
					email: leader.email || null,
					phone: leader.phone || null,
					user_id: userId || null
				})

			if (error) console.error('Error adding team leader:', error)
			return !error
		},

		async updateTeamLeader(id: string, updates: Partial<TeamLeader>) {
			const { error } = await supabase
				.from('team_leaders')
				.update({
					name: updates.name,
					email: updates.email || null,
					phone: updates.phone || null
				})
				.eq('id', id)

			if (error) console.error('Error updating team leader:', error)
			return !error
		},

		async deleteTeamLeader(id: string) {
			const { error } = await supabase
				.from('team_leaders')
				.delete()
				.eq('id', id)

			if (error) console.error('Error deleting team leader:', error)
			return !error
		},

		// Drivers
		async getDrivers(userId?: string): Promise<Driver[]> {
			let query = supabase
				.from('drivers')
				.select('*')
				.order('name')

			if (userId) {
				query = query.eq('user_id', userId)
			}

			const { data, error } = await query

			if (error) {
				console.error('Error fetching drivers:', error)
				return []
			}

			return (data || []).map(row => ({
				id: row.id,
				name: row.name || '',
				username: row.username || '',
				email: row.email || undefined,
				phone: row.phone || undefined,
				teamLeaderId: row.team_leader_id || undefined,
				created_at: row.created_at
			}))
		},

		async addDriver(driver: Driver, userId?: string) {
			const { error } = await supabase
				.from('drivers')
				.insert({
					id: driver.id,
					name: driver.name,
					username: driver.username,
					email: driver.email || null,
					phone: driver.phone || null,
					team_leader_id: driver.teamLeaderId || null,
					user_id: userId || null
				})

			if (error) console.error('Error adding driver:', error)
			return !error
		},

		async updateDriver(id: string, updates: Partial<Driver>) {
			const { error } = await supabase
				.from('drivers')
				.update({
					name: updates.name,
					username: updates.username,
					email: updates.email || null,
					phone: updates.phone || null,
					team_leader_id: updates.teamLeaderId || null
				})
				.eq('id', id)

			if (error) console.error('Error updating driver:', error)
			return !error
		},

		async deleteDriver(id: string) {
			const { error } = await supabase
				.from('drivers')
				.delete()
				.eq('id', id)

			if (error) console.error('Error deleting driver:', error)
			return !error
		}
	}
}
