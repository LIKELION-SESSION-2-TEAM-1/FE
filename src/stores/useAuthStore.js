import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null, // 사용자 정보 (예: { username: 'test' })
            isLoggedIn: false,

            // 로그인 액션
            login: (token, username) => {
                set({
                    token: token,
                    user: { username },
                    isLoggedIn: true
                });
            },

            // 로그아웃 액션
            logout: () => {
                set({
                    token: null,
                    user: null,
                    isLoggedIn: false
                });
            }
        }),
        {
            name: 'auth-storage', // localStorage에 저장될 키 이름
            storage: createJSONStorage(() => localStorage), // 저장소로 localStorage 사용
        }
    )
);

export default useAuthStore;
