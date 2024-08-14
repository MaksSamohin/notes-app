import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export function useAuth(setUserLoading: (loading: boolean) => void) {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserLoading(true);
            if (user) {
                const { uid, email } = user;
                dispatch(setUser({ uid, email: email || "" }))
            } else {
                dispatch(clearUser())
            }
            setUserLoading(false);
        })

        return () => unsubscribe()
    }, [dispatch, setUserLoading])
}