import { create } from 'zustand';

const useDataStore = create((set) => ({
    // States
    weeklyRanking: null,
    rankingLastFetched: null,
    chatRooms: null,
    chatRoomsLastFetched: null,

    // Actions
    setWeeklyRanking: (data) => set({
        weeklyRanking: data,
        rankingLastFetched: Date.now()
    }),
    setChatRooms: (data) => set({
        chatRooms: data,
        chatRoomsLastFetched: Date.now()
    }),
}));

export default useDataStore;
