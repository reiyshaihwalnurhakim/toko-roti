"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function CustomOrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (status: string) => {
    if (!confirm(`Ubah status pesanan menjadi ${status}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/custom-order-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status })
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal mengupdate status");
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStatus === 'completed' || currentStatus === 'cancelled') {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
        currentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {currentStatus === 'completed' ? 'Selesai' : 'Batal'}
      </span>
    );
  }

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <span className={`px-3 py-1 rounded-full text-xs font-medium text-center self-start ${
        currentStatus === 'pending' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {currentStatus}
      </span>
      
      <div className="flex space-x-1">
        <button 
          onClick={() => updateStatus('completed')}
          disabled={isLoading}
          className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded transition"
          title="Tandai Selesai"
        >
          <Check className="w-4 h-4" />
        </button>
        <button 
          onClick={() => updateStatus('cancelled')}
          disabled={isLoading}
          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
          title="Batalkan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
