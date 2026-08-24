import { CheckCircle2, Clock, MessageSquare, Phone, Truck } from "lucide-react";

const sampleInquiries = [
  { id: "inq_1", buyerName: "Ramesh Transport", mobile: "9876543210", vehicle: "Ashok Leyland 1920 4x2", type: "Callback Request", status: "New", date: "Today 02:15 PM" },
  { id: "inq_2", buyerName: "Anand Builders", mobile: "9812345678", vehicle: "Tata Signa 4825.TK Tipper", type: "Price Offer (₹25.5L)", status: "Contacted", date: "Yesterday" },
  { id: "inq_3", buyerName: "Karan Logistics", mobile: "9988776655", vehicle: "Mahindra Bolero Pickup", type: "Inspection Request", status: "Closed", date: "2 days ago" },
];

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-steel-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-steel-900">
            Customer Leads & Enquiries ({sampleInquiries.length})
          </h2>
          <p className="mt-1 text-sm text-steel-600">
            Track callback requests, price offers, and buyer inquiries sent to dealers and sellers.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-steel-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-steel-100 font-bold uppercase tracking-wider text-steel-700">
            <tr>
              <th className="px-5 py-3.5">Customer Name</th>
              <th className="px-5 py-3.5">Mobile Number</th>
              <th className="px-5 py-3.5">Target Vehicle</th>
              <th className="px-5 py-3.5">Enquiry Type</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-200 font-medium text-steel-800">
            {sampleInquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-steel-50/70 transition-colors">
                <td className="px-5 py-4 font-bold text-steel-900">{inq.buyerName}</td>
                <td className="px-5 py-4 text-steel-700">{inq.mobile}</td>
                <td className="px-5 py-4 font-semibold text-steel-900">{inq.vehicle}</td>
                <td className="px-5 py-4 text-brand-700 font-bold">{inq.type}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      inq.status === "New"
                        ? "bg-brand-100 text-brand-800"
                        : inq.status === "Contacted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {inq.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-steel-500">{inq.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
