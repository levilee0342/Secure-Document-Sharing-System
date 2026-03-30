export interface UserBrief {
  id?: string;
  username?: string;
  email?: string;
  fullName?: string;
}

// sample data for local testing
const SAMPLE_USERS: UserBrief[] = [
  {
    id: "u1",
    username: "alice",
    email: "alice@example.com",
    fullName: "Alice Nguyễn",
  },
  { id: "u2", username: "bob", email: "bob@example.com", fullName: "Bob Trần" },
  {
    id: "u3",
    username: "carol",
    email: "carol@example.com",
    fullName: "Carol Lê",
  },
  {
    id: "u4",
    username: "david",
    email: "david@example.com",
    fullName: "David Phạm",
  },
  {
    id: "u5",
    username: "erin",
    email: "erin@example.com",
    fullName: "Erin Võ",
  },
  {
    id: "u6",
    username: "frank",
    email: "frank@example.com",
    fullName: "Frank Hoàng",
  },
  {
    id: "u7",
    username: "grace",
    email: "grace@example.com",
    fullName: "Grace Đỗ",
  },
  {
    id: "u8",
    username: "huy",
    email: "huy@example.com",
    fullName: "Huy Nguyễn",
  },
];

export async function searchUsers(query: string): Promise<UserBrief[]> {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();

  // try backend endpoints first
  const endpoints = [
    `/api/users/search?query=${encodeURIComponent(query)}`,
    `/api/users?query=${encodeURIComponent(query)}`,
    `/api/users/find?query=${encodeURIComponent(query)}`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep);
      if (!res.ok) continue;
      const json = await res.json();
      const maybeData = json.data ?? json;
      if (Array.isArray(maybeData)) return maybeData as UserBrief[];
    } catch (e) {
      // ignore and try next
    }
  }

  // fallback to sample data (local dev)
  return SAMPLE_USERS.filter((u) =>
    (u.fullName ?? u.username ?? u.email ?? "").toLowerCase().includes(q)
  );
}
