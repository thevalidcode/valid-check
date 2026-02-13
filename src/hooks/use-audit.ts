import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useAudit() {
  function useList({ page = 1, limit = 10, action }: { page?: number; limit?: number; action?: string }) {
    return useQuery({
      queryKey: ["auditLogs", { page, limit, action }],
      queryFn: async () => {
        const { data } = await api.get("/audit-logs", { params: { page, limit, action } });
        return data;
      },
    });
  }

  return { useList };
}
