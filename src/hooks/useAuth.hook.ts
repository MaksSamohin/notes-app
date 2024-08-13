import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export function useAuth() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, email } = user;
                dispatch(setUser({ uid, email: email || "" }))
            } else {
                dispatch(clearUser())
            }
        })

        return () => unsubscribe()
    }, [dispatch])
}