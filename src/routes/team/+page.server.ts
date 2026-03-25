import { createDb } from '$lib/supabase/queries'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const db = createDb(locals.supabase)
	const [teamLeaders, drivers] = await Promise.all([
		db.getTeamLeaders(),
		db.getDrivers()
	])

	return { teamLeaders, drivers }
}
