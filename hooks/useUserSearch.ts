import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { useDebounce } from "./useDebounce";

export function useUserSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const searchResults = useQuery(
        api.users.searchUsers,
        debouncedSearchTerm.trim() ? { searchTerm: debouncedSearchTerm } : "skip"
    );

    return {
        searchTerm,
        setSearchTerm,
        searchResults: (searchResults || []) as Doc<'users'>[],
        isLoading: searchResults === undefined &&  debouncedSearchTerm.trim() !== "",
    }
}