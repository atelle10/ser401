import "dotenv/config"
import { auth } from "../auth.js"

const required = ["DEV_ADMIN_EMAIL", "DEV_ADMIN_PASSWORD"] as const
const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(
    `Missing required env vars: ${missing.join(
      ", "
    )}. Set them before running this script.`
  )
  process.exit(1)
}

const email = (process.env.DEV_ADMIN_EMAIL || "").trim().toLowerCase()
const password = process.env.DEV_ADMIN_PASSWORD || ""
const name = "Dev Admin"
const fallbackUsername = email.split("@")[0] || `admin_${Date.now()}`
const fallbackPhone = "0000000000"

const main = async () => {
  const ctx = await auth.$context

  const existing = await ctx.internalAdapter.findUserByEmail(email)
  if (existing?.user) {
    console.log(`Admin user already exists for ${email}. No changes made.`)
    return
  }

  const hash = await ctx.password.hash(password)

  const user = await ctx.internalAdapter.createUser({
    email,
    name,
    role: "admin",
    verified: true,
    emailVerified: true,
    username: fallbackUsername,
    phone: fallbackPhone,
  })

  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: hash,
  })

  console.log(`Created dev admin user: ${email}`)
}

main().catch((err) => {
  console.error("Failed to seed dev admin:", err)
  process.exit(1)
})
