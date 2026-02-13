import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { OrganizerUser } from "@/lib/middleware/auth";
import { normalizeApiError } from "@/lib/normalizeApiError";
import { toast } from "sonner";

export function useOrganizer() {
  const qc = useQueryClient();

  const meQuery = useQuery<OrganizerUser>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data.data as OrganizerUser;
    },
    retry: false,
  });

  const login = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await api.post("/auth/login", payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to login.");
      toast.error(errorMsg);
    },
  });

  const register = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await api.post("/auth/register", payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),

    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create organizer user.",
      );
      toast.error(errorMsg);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      qc.setQueryData(["me"], null);
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to logout.");
      toast.error(errorMsg);
    },
  });

  return { meQuery, login, register, logout };
}
