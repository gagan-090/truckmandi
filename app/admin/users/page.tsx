import { CheckCircle2, ShieldCheck, UserCheck, Users } from "lucide-react";

const sampleUsers = [
  { id: "usr_101", name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", role: "Dealer", verified: true, joined: "2024-01-15" },
  { id: "usr_102", name: "Amit Patel", email: "amit.patel@gmail.com", phone: "9812345678", role: "Buyer", verified: true, joined: "2024-02-01" },
  { id: "usr_103", name: "Suresh Commercial Fleet", email: "suresh.fleet@trucks.in", phone: "9988776655", role: "Verified Fleet Owner", verified: true, joined: "2023-11-20" },
  { id: "usr_104", name: "Vikram Logistics", email: "vikram@logistics.com", phone: "9765432109", role: "Dealer", verified: true, joined: "2024-03-10" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-steel-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-steel-900">
            Registered Users & Verified Dealers ({sampleUsers.length})
          </h2>
          <p className="mt-1 text-sm text-steel-600">
            Manage buyer accounts, verified commercial vehicle dealerships, and access privileges.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-steel-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-steel-100 font-bold uppercase tracking-wider text-steel-700">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Mobile</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Verification</th>
              <th className="px-5 py-3.5">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-200 font-medium text-steel-800">
            {sampleUsers.map((user) => (
              <tr key={user.id} className="hover:bg-steel-50/70 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-full bg-brand-100 text-brand-700 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-steel-900">{user.name}</p>
                      <p className="text-[11px] text-steel-500 font-mono">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-steel-700">{user.email}</td>
                <td className="px-5 py-4 text-steel-700">{user.phone}</td>
                <td className="px-5 py-4 font-semibold text-steel-900">{user.role}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    Verified
                  </span>
                </td>
                <td className="px-5 py-4 text-steel-500">{user.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
