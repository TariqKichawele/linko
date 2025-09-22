import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
        if (!clerkId) {
            throw new Error("Clerk ID is required");
        }

        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
            .first();
    }
});

export const upsertUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        imageUrl: v.string()
    },
    handler: async (ctx, { clerkId, email, name, imageUrl }) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
            .first();

        if (existingUser) {
            return await ctx.db.patch(existingUser._id, { name, imageUrl });
        }

        return await ctx.db.insert("users", { clerkId, email, name, imageUrl });
        
    }
})

export const searchUsers = query({
    args: { searchTerm: v.string() },
    handler: async (ctx, { searchTerm }) => {
        if (!searchTerm.trim()) {
            return [];
        }

        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        const allUsers = await ctx.db
            .query("users")
            .collect();

        return allUsers.filter(user => 
            user.name.toLowerCase().includes(normalizedSearchTerm) ||
            user.email.toLowerCase().includes(normalizedSearchTerm)
        ).slice(0, 20);
    }
})