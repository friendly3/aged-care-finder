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
		const confirmPassword = formData.get('confirmPassword') as string

		if (!email || !password) {
			return fail(400, { email, error: 'Email and password are required' })
		}

		if (password !== confirmPassword) {
			return fail(400, { email, error: 'Passwords do not match' })
		}

		if (password.length < 6) {
			return fail(400, { email, error: 'Password must be at least 6 characters' })
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${import.meta.env.VITE_SITE_URL || 'http://localhost:5175'}/auth/callback`
			}
		})

		if (error) {
			return fail(400, { email, error: error.message })
		}

		return { 
			success: true, 
			message: 'Check your email for the confirmation link' 
		}
	}
}
