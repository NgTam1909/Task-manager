import { expect } from "chai"
import mock from "mock-require"

type CookieRecord = { name: string; value: string; options?: Record<string, unknown> }

class MockResponse {
    status: number
    body: unknown
    cookies: { _all: CookieRecord[]; set: (name: string, value: string, options?: Record<string, unknown>) => void }

    constructor(body: unknown, init?: { status?: number }) {
        this.status = init?.status ?? 200
        this.body = body
        this.cookies = {
            _all: [],
            set: (name: string, value: string, options?: Record<string, unknown>) => {
                this.cookies._all.push({ name, value, options })
            },
        }
    }
}

const NextResponse = {
    json: (body: unknown, init?: { status?: number }) => new MockResponse(body, init),
}

const makeRequest = (body: unknown) =>
    new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

describe("Auth Register", () => {
    afterEach(() => {
        mock.stopAll()
    })

    it("returns validation errors for invalid payload", async () => {
        mock("next/server", { NextResponse })
        mock("@/lib/db", { connectDB: async () => {} })
        mock("@/lib/validations/auth.validation", {
            registerSchema: {
                safeParse: () => ({
                    success: false,
                    error: {
                        flatten: () => ({
                            fieldErrors: { email: ["Required"] },
                        }),
                    },
                }),
            },
        })
        mock("@/models/user.model", { findOne: async () => null, create: async () => ({}) })

        const { POST } = mock.reRequire("../app/api/auth/register/route")
        const res = await POST(makeRequest({}))

        expect(res.status).to.equal(400)
        expect(res.body).to.have.property("errors")
    })

    it("returns error when email already exists", async () => {
        mock("next/server", { NextResponse })
        mock("@/lib/db", { connectDB: async () => {} })
        mock("@/lib/validations/auth.validation", {
            registerSchema: {
                safeParse: (body: Record<string, unknown>) => ({
                    success: true,
                    data: body,
                }),
            },
        })
        mock("@/models/user.model", { findOne: async () => ({ _id: "1" }), create: async () => ({}) })

        const { POST } = mock.reRequire("../app/api/auth/register/route")
        const res = await POST(makeRequest({
            firstName: "A",
            lastName: "B",
            email: "test@example.com",
            phone: "0912345678",
            password: "password1",
            confirmPassword: "password1",
        }))

        expect(res.status).to.equal(400)
        expect(res.body).to.have.property("message")
    })

    it("creates user with valid payload", async () => {
        let created = false

        mock("next/server", { NextResponse })
        mock("@/lib/db", { connectDB: async () => {} })
        mock("@/lib/validations/auth.validation", {
            registerSchema: {
                safeParse: (body: Record<string, unknown>) => ({
                    success: true,
                    data: body,
                }),
            },
        })
        mock("@/models/user.model", {
            findOne: async () => null,
            create: async () => {
                created = true
                return {}
            },
        })

        const { POST } = mock.reRequire("../app/api/auth/register/route")
        const res = await POST(makeRequest({
            firstName: "A",
            lastName: "B",
            email: "new@example.com",
            phone: "0912345678",
            password: "password1",
            confirmPassword: "password1",
        }))

        expect(res.status).to.equal(201)
        expect(created).to.equal(true)
    })
})

describe("Auth Login", () => {
    afterEach(() => {
        mock.stopAll()
    })

    it("returns 401 when user not found", async () => {
        mock("next/server", { NextResponse })
        mock("@/lib/db", { connectDB: async () => {} })
        mock("@/lib/jwt", { signToken: () => "token" })
        mock("@/models/user.model", {
            findOne: () => ({
                select: async () => null,
            }),
        })

        const { POST } = mock.reRequire("../app/api/auth/login/route")
        const res = await POST(makeRequest({ email: "nope@example.com", password: "x" }))

        expect(res.status).to.equal(401)
        expect(res.body).to.deep.equal({ message: "Invalid credentials" })
    })

    it("returns 401 when password mismatch", async () => {
        mock("next/server", { NextResponse })
        mock("@/lib/db", { connectDB: async () => {} })
        mock("@/lib/jwt", { signToken: () => "token" })
        mock("@/models/user.model", {
            findOne: () => ({
                select: async () => ({
                    comparePassword: async () => false,
                }),
            }),
        })

        const { POST } = mock.reRequire("../app/api/auth/login/route")
        const res = await POST(makeRequest({ email: "a@b.com", password: "wrong" }))

        expect(res.status).to.equal(401)
        expect(res.body).to.deep.equal({ message: "Invalid credentials" })
    })

    it("returns success and sets cookie on valid login", async () => {
        mock("next/server", { NextResponse })
        mock("@/lib/db", { connectDB: async () => {} })
        mock("@/lib/jwt", { signToken: () => "token" })
        mock("@/models/user.model", {
            findOne: () => ({
                select: async () => ({
                    _id: "user-id",
                    email: "ok@example.com",
                    isGod: false,
                    comparePassword: async () => true,
                }),
            }),
        })

        const { POST } = mock.reRequire("../app/api/auth/login/route")
        const res = await POST(makeRequest({ email: "ok@example.com", password: "ok" }))

        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal({ success: true })
        expect(res.cookies._all.length).to.equal(1)
        expect(res.cookies._all[0].name).to.equal("accessToken")
    })
})
