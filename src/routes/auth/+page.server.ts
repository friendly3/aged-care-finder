import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	// Check if already logged in
	if (locals.user) {
		redirect(303, '/dashboard')
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		if (!email || !password) {
			return fail(400, { email, error: 'Email and password are required' })
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		})

		if (error) {
			console.error('Supabase login error:', error)
			return fail(401, { email, error: error.message })
		}

		console.log('Login successful for', data.user?.email)
		redirect(303, '/dashboard')
	}
}
