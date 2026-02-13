import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useCheckin() {
  const qc = useQueryClient();

  const checkin = useMutation({
    mutationFn: async (payload: {
      checkInPageId: string;
      attendeeId: string;
      latitude?: number;
      longitude?: number;
    }) => {
      const { data } = await api.post("/attendee-checkin", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["checkinPages"] });
      qc.invalidateQueries({ queryKey: ["attendee"] });
    },
  });

  function useGetAttendee(attendeeId?: string) {
    return useQuery({
      queryKey: ["attendee", attendeeId],
      queryFn: async () => {
        const { data } = await api.get("/attendee-checkin", {
          params: { attendeeId },
        });
        return data;
      },
      enabled: !!attendeeId,
    });
  }

  return { checkin, useGetAttendee };
}
