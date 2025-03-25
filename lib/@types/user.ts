import type { Profile } from "./profile";

export interface User {
    id: string;
    profile: Profile;
    updatedAt: Date;
    createdAt: Date;
}

export type UserProfile = Pick<User, "id" | "profile">;
