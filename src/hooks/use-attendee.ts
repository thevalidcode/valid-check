import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { normalizeApiError } from "@/lib/normalizeApiError";
import { toast } from "sonner";

export function useAttendee() {
  const qc = useQueryClient();

  function useGetAttendee(attendeeId?: string) {
    return useQuery({
      queryKey: ["attendee", attendeeId],
      queryFn: async () => {
        const { data } = await api.get("/attendee-checkin", { params: { attendeeId } });
        return data;
      },
      enabled: !!attendeeId,
    });
  }

  function useFindByEmail(email?: string) {
    return useQuery({
      queryKey: ["attendeeByEmail", email],
      queryFn: async () => {
        const { data } = await api.get("/attendees", { params: { email } });
        return data;
      },
      enabled: !!email,
    });
  }

  const create = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/attendees", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendeeByEmail"] }),
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to create attendee.");
      toast.error(errorMsg);
    },
  });

  const update = useMutation({
    mutationFn: async (payload: { id: string; [key: string]: any }) => {
      const { data } = await api.patch("/attendees", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendeeByEmail"] }),
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to update attendee.");
      toast.error(errorMsg);
    },
  });

  const exchangeSessionMutation = useMutation({
    mutationFn: async ({
      sessionCode,
      slug,
    }: {
      sessionCode: string;
      slug?: string;
    }) => {
      const { data } = await api.post("/attendees/exchange-session", {
        session_code: sessionCode,
        slug,
      });
      return data;
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Google session exchange failed.",
      );
      toast.error(errorMsg);
    },
  });

  return {
    useGetAttendee,
    useFindByEmail,
    create,
    update,
    exchangeSession: exchangeSessionMutation,
  };
}
