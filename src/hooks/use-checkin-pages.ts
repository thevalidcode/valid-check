import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { normalizeApiError } from "@/lib/normalizeApiError";
import { toast } from "sonner";

export function useCheckinPages() {
  const qc = useQueryClient();

  function useList({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return useQuery({
      queryKey: ["checkinPages", { page, limit, search }],
      queryFn: async () => {
        const { data } = await api.get("/checkin-pages", {
          params: { page, limit, search },
        });
        return data;
      },
    });
  }

  function useGetBySlug(slug?: string) {
    return useQuery({
      queryKey: ["checkinPageBySlug", slug],
      queryFn: async () => {
        const { data } = await api.get(
          `/checkin-pages/${encodeURIComponent(slug || "")}`,
        );
        return data;
      },
      enabled: !!slug,
    });
  }

  function useGetAttendees(slug?: string) {
    return useQuery({
      queryKey: ["checkinPageAttendees", slug],
      queryFn: async () => {
        const { data } = await api.get(
          `/checkin-pages/${encodeURIComponent(slug || "")}/attendees`,
        );
        return data;
      },
      enabled: !!slug,
    });
  }

  function useGetActivePages() {
    return useQuery({
      queryKey: ["activeCheckinPages"],
      queryFn: async () => {
        const { data } = await api.get("/checkin-pages/active");
        return data;
      },
    });
  }

  function useGetCheckins(slug?: string) {
    return useQuery({
      queryKey: ["checkinPageHistory", slug],
      queryFn: async () => {
        const { data } = await api.get(
          `/checkin-pages/${encodeURIComponent(slug || "")}/checkins`,
        );
        return data;
      },
      enabled: !!slug,
    });
  }

  const create = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/checkin-pages", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["checkinPages"] }),
    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create check-in page.",
      );
      toast.error(errorMsg);
    },
  });

  const update = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.patch("/checkin-pages", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["checkinPages"] }),
    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update check-in page.",
      );
      toast.error(errorMsg);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete("/checkin-pages", { data: { id } });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["checkinPages"] }),
    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to delete check-in page.",
      );
      toast.error(errorMsg);
    },
  });

  return {
    useList,
    useGetBySlug,
    useGetAttendees,
    useGetCheckins,
    useGetActivePages,
    create,
    update,
    remove,
  };
}
