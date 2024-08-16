import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { updateDoc, doc, getDoc,collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  sharedUsers: string[] | null,
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  sharedUsers: null,
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
        sharedUsers: userData.sharedUsers || null,
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

export const removeSharedUser = createAsyncThunk(
  'user/removeSharedUser',
  async ({ uid, email }: { uid: string, email: string }, { rejectWithValue }) => {
    try {
      const userDoc = doc(db, 'users', uid);
      const userDocData = await getDoc(userDoc);

      if (userDocData.exists()) {
        const userData = userDocData.data();
        const updatedSharedUsers = userData.sharedUsers.filter((sharedEmail: string) => sharedEmail !== email);

        await updateDoc(userDoc, { sharedUsers: updatedSharedUsers });

        return updatedSharedUsers;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      return rejectWithValue("Failed to remove shared user");
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
    setUser: (state, action: PayloadAction<{ uid: string; email: string; displayName?: string; sharedUsers?: string[] }>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName || null;
      state.sharedUsers = action.payload.sharedUsers || null;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.sharedUsers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.displayName = action.payload.displayName || null;
        state.uid = action.payload.uid;
        state.email = action.payload.email || null;
        state.sharedUsers = action.payload.sharedUsers || null;
      })
      .addCase(updateUserNameInDB.fulfilled, (state, action) => {
        state.displayName = action.payload;
      })
      .addCase(removeSharedUser.fulfilled, (state, action) => {
        state.sharedUsers = action.payload;
      });
  
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
