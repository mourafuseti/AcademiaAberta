// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './Login.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

/* The sign-in screen with password sign-in (#118). Only an instance that advertises
   `password_login` shows any of it; there, a browser without passkey support finally has a way
   in instead of being told to stay local, and creating a profile can use a password. */
const mocks = vi.hoisted(() => {
  const state = { webauthn: true, config: null, sheets: [] }
  state.snapshot = () => ({
    config: state.config, S: {},
    setUser: vi.fn(), adoptProfile: vi.fn(), setGuest: vi.fn(), loadConfig: vi.fn(async () => state.config),
    pushState: vi.fn(), pullState: vi.fn(),
  })
  return state
})
vi.mock('../store/useStore.js', () => {
  const useStore = selector => selector ? selector(mocks.snapshot()) : mocks.snapshot()
  useStore.getState = mocks.snapshot
  return { useStore, hasData: () => false }
})
vi.mock('../store/useUI.js', () => {
  const snap = () => ({ toast: vi.fn(), openSheet: render => { mocks.sheets.push(render); return {} } })
  const useUI = selector => selector ? selector(snap()) : snap()
  useUI.getState = snap
  return { useUI }
})
vi.mock('../lib/api.js', () => ({
  webauthnOK: () => mocks.webauthn, passkeyLogin: vi.fn(), passkeyRegister: vi.fn(), BIO: 'your fingerprint', bio: () => 'your fingerprint',
  api: vi.fn(), passkeyAssertion: vi.fn(), passwordLogin: vi.fn(), passwordRegister: vi.fn(), passwordResetRedeem: vi.fn(),
}))
vi.mock('../lib/demo.js', () => ({ DEMO: false, REPO: 'https://example.invalid' }))
vi.mock('../sheets.jsx', () => ({ askAddDeviceData: vi.fn(), confirmSheet: vi.fn() }))

const mounted = []
function mount(el) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  mounted.push({ root, host })
  act(() => root.render(el))
  return host
}
const buttons = host => [...host.querySelectorAll('button')].map(b => b.textContent)
const button = (host, text) => [...host.querySelectorAll('button')].find(b => b.textContent === text)

beforeEach(() => { mocks.webauthn = true; mocks.config = null; mocks.sheets.length = 0 })
afterEach(() => { act(() => { mounted.splice(0).forEach(({ root, host }) => { root.unmount(); host.remove() }) }) })

describe('Login with e-mail and password', () => {
  it('shows only e-mail/password sign-in whether or not the browser supports passkeys', () => {
    mocks.config = { password_login: true, allow_guest: false }
    const page = mount(<Login />)
    expect(buttons(page)).toEqual(['Sign in with password', 'Create new profile', 'Use a code from your other device'])
    expect(page.textContent).not.toContain('Sign in with passkey')
    act(() => button(page, 'Sign in with password').click())
    const sheet = mount(mocks.sheets[0](() => {}))
    expect(sheet.querySelector('h3').textContent).toBe('Sign in with password')
    expect(sheet.querySelector('input[type="email"]')).toBeTruthy()
    expect(sheet.querySelector('input[autocomplete="current-password"]')).toBeTruthy()

    mocks.webauthn = false
    expect(buttons(mount(<Login />))).toEqual(['Sign in with password', 'Create new profile'])
  })

  it('creates profiles with e-mail/password directly, with no passkey choice', () => {
    mocks.config = { password_login: true, invite_only: true, allow_guest: false }
    const page = mount(<Login />)
    act(() => button(page, 'Create new profile').click())
    const sheet = mount(mocks.sheets[0](() => {}))
    expect(sheet.querySelector('.seg')).toBeNull()
    expect(sheet.querySelector('input[type="email"]')).toBeTruthy()
    expect(sheet.querySelector('input[placeholder="Invite code"]')).toBeTruthy()
    expect(sheet.querySelector('input[autocomplete="new-password"]')).toBeTruthy()
    expect(buttons(sheet)).toContain('Create profile')
    expect(buttons(sheet)).not.toContain('Create passkey')
  })

  it('does not offer account actions when password sign-in is disabled', () => {
    mocks.config = { password_login: false, allow_guest: true }
    const page = mount(<Login />)
    expect(buttons(page)).toEqual(['Continue without account'])
    expect(page.textContent).toContain('Password sign-in is disabled on this server. Ask the administrator.')
  })
})
