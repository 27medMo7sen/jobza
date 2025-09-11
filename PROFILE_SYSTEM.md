# Unified Profile System

## Overview

The application now uses a unified profile system that allows viewing any user's profile via their unique username instead of MongoDB IDs. All profiles are accessible at `/profile/[username]` with consistent layout, components, and theme across all user roles.

## Features

### ✅ **Unified Routing**

- **Single Route**: `/profile/[username]` for all user types
- **Username-based**: Uses `userName` field instead of MongoDB `_id`
- **Consistent URLs**: `/profile/johndoe` works for any user type

### ✅ **Role Support**

- **Workers**: Shows skills, experience, and worker-specific information
- **Employers**: Shows company information and employer details
- **Agencies**: Shows agency information and license details
- **Admins**: Special styling with blue theme and admin badge

### ✅ **Security & Privacy**

- **Public Data**: Name, username, role, profile picture, verification status
- **Private Data**: Email, phone, address, date of birth (only visible to owner/admin)
- **Permission-based**: Automatically filters data based on viewer permissions

### ✅ **Consistent Design**

- **Same Layout**: All profiles use identical components and styling
- **Admin Distinction**: Admin profiles have blue theme and special badges
- **Responsive**: Works on all screen sizes
- **Theme Consistency**: Maintains app-wide design language

## Usage

### Backend API

```typescript
// Get user profile by username
GET /auth/profile/:username

// Response includes:
{
  user: {
    _id: string,
    name: string,
    userName: string,
    role: string,
    profilePicture?: { url: string, s3Key: string },
    isVerified: boolean,
    status: string,
    // Private fields only if owner/admin:
    email?: string,
    phoneNumber?: string,
    address?: string,
    // ... other private fields
  },
  profileData: any, // Role-specific data
  isOwner: boolean,
  isAdmin: boolean
}
```

### Frontend Components

#### ProfileLink Component

```tsx
import { ProfileLink } from "@/components/shared/ProfileLink";

// Simple link to profile
<ProfileLink username="johndoe">
  <span>View John's Profile</span>
</ProfileLink>

// User profile card
<UserProfileCard
  username="johndoe"
  name="John Doe"
  role="worker"
  profilePicture={{ url: "...", s3Key: "..." }}
/>
```

#### Direct Navigation

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();
router.push(`/profile/${username}`);
```

### Profile Access Examples

```typescript
// Worker profile
/profile/_ehjknoorrw /
  // Employer profile
  profile /
  jane_employer /
  // Agency profile
  profile /
  agency_abc /
  // Admin profile
  profile /
  admin_user;
```

## Migration

### Old Profile Routes

All old profile routes now redirect to the unified system:

- `/worker/profile` → `/profile/[username]`
- `/employer/profile` → `/profile/[username]`
- `/agency/profile` → `/profile/[username]`
- `/admin/profile` → `/profile/[username]`

### Database Requirements

- Ensure `userName` field is unique across all users
- Populate role-specific collections (Worker, Employer, Agency, Admin)
- Link Auth records to role-specific profiles via `worker`, `employer`, `agency`, `admin` fields

## Security Considerations

### Data Visibility

- **Public**: Name, username, role, profile picture, verification status, join date
- **Private**: Email, phone, address, date of birth, gender, country, nationality, city
- **Role-specific**: Skills, experience, company info, etc.

### Access Control

- **Owner**: Can see all their own data
- **Admin/Superadmin**: Can see all user data
- **Public**: Can only see public fields
- **Unauthenticated**: Can only see public fields

## Admin Profile Features

### Special Styling

- Blue theme (`border-blue-200 bg-blue-50`)
- Admin badge with shield icon
- Consistent with overall theme but visually distinct

### Profile Header

- Profile picture or default avatar
- Name, role, and username
- Verification status and profile status badges
- Join date information

## Examples

### Viewing Your Own Profile

```tsx
// User clicks "My Profile" → redirects to /profile/[their-username]
// Shows all data including private fields
// Shows "Edit Profile" button
```

### Viewing Another User's Profile

```tsx
// User clicks on a profile link → navigates to /profile/[username]
// Shows public data only
// Shows privacy notice if not admin
```

### Admin Viewing Any Profile

```tsx
// Admin can see all data for any user
// No privacy restrictions
// Can access via direct URL or profile links
```

## Benefits

1. **Consistency**: Same look and feel across all profile types
2. **Security**: Automatic data filtering based on permissions
3. **Maintainability**: Single profile component for all roles
4. **User Experience**: Easy-to-remember URLs with usernames
5. **Scalability**: Easy to add new user types or profile fields
6. **SEO Friendly**: Username-based URLs are more readable
