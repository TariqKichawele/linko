import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        imageUrl: v.string()
    })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),
})