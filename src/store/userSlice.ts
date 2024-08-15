import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { updateDoc, doc, getDoc,collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/firebaseConfig";
interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null; 
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (uid: string) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        uid,
        displayName: userData.displayName || null,
        email: userData.email || null,
      };
    } else {
      throw new Error("User not found");
    }
  }
);

export const updateUserNameInDB = createAsyncThunk(
  'user/updateUserNameInDB',
  async ({ uid, displayName }: { uid: string, displayName: string }, { rejectWithValue }) => {
    try {
      const userDoc = doc(db, 'users', uid);
      await updateDoc(userDoc, { displayName });
      return displayName;
    } catch (error) {
      return rejectWithValue("Failed to update username");
    }
  }
);

export const deleteAllUserNotes = async (uid: string) => {
  const q = query(collection(db, "notes"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  const batch = writeBatch(db);

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string; email: string; displayName?: string }>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName || null;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.displayName = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.displayName = action.payload.displayName || null;
        state.uid = action.payload.uid;
        state.email = action.payload.email || null
      })
      .addCase(updateUserNameInDB.fulfilled, (state, action) => {
        state.displayName = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
