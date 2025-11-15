import { redirect } from '@sveltejs/kit'
import { browser } from '$app/environment'
import config from '$lib/config'
import type { PageLoad } from './$types'

/**
 * Dashboard Page Load Function
 *
 * Checks authentication and redirects to login if not authenticated.
 */
export const load: PageLoad = () => {
  if (browser) {
    const token = localStorage.getItem(config.auth.tokenStorageKey)
    if (!token) {
      throw redirect(302, config.routes.login)
    }
  }
}
