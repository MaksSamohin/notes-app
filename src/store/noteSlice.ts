import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '@/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, where, getDoc } from 'firebase/firestore';
import { Note } from "@/noteTypes";

interface NotesState {
    notes: Note[];
    loading: boolean;
    error: string | null;
}
  
const initialState: NotesState = {
    notes: [],
    loading: false,
    error: null,
};

export const fetchNotes = createAsyncThunk<Note[], string>('notes/fetchNotes', async (uid: string) => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const notesData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toString() 
      };
    }) as Note[];
    return notesData;
});

export const fetchNoteByIdThunk = createAsyncThunk<Note | null, { noteId: string; currentUid: string }>(
  'notes/fetchNoteById',
  async ({ noteId, currentUid }, thunkAPI) => {
      try {
          const docRef = doc(db, "notes", noteId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              const noteData = docSnap.data();
              if (noteData.uid !== currentUid) {
                  console.log("Access denied: user does not own this note.");
                  return null;
              }

              return {
                  id: docSnap.id,
                  title: noteData.title,
                  content: noteData.content,
                  wordCount: noteData.wordCount,
                  symbolsCount: noteData.symbolsCount,
                  topWords: noteData.topWords,
                  tone: noteData.tone,
                  uid: noteData.uid,
                  createdAt: noteData.createdAt.toDate(),
              };
          } else {
              console.log("No such document!");
              return null;
          }
      } catch (error) {
          console.error("Error fetching note by ID:", error);
          return thunkAPI.rejectWithValue("Error fetching note by ID");
      }
  }
);

export const addNote = createAsyncThunk('notes/addNote', async (newNote: Omit<Note, 'id'>) => {
    const docRef = await addDoc(collection(db, 'notes'), newNote);
    const addedNote = { id: docRef.id, ...newNote };
    return addedNote;
  });
  
  export const updateNote = createAsyncThunk('notes/updateNote', async (updatedNote: Note) => {
    const docRef = doc(db, 'notes', updatedNote.id);
    await updateDoc(docRef, {
        ...updatedNote,
        createdAt: updatedNote.createdAt.toString() // или .toDate().toString()
    });
    return updatedNote;
  });
  
  export const deleteNote = createAsyncThunk<string, string>('notes/deleteNote', async (noteId: string) => {
    const docRef = doc(db, 'notes', noteId);
    await deleteDoc(docRef);
    return noteId;
  });

export const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.notes = action.payload;
        state.loading = false;
      });
      builder.addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load notes';
      });
      builder.addCase(fetchNoteByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(fetchNoteByIdThunk.fulfilled, (state, action: PayloadAction<Note | null>) => {
        state.loading = false;
        if (action.payload) {
            const note = action.payload;
            state.notes = state.notes.map(n => n.id === note.id ? note : n);
        }
      });
      builder.addCase(fetchNoteByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch note by ID';
      });
      builder.addCase(addNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.notes.push(action.payload);
      });
  
      builder.addCase(updateNote.fulfilled, (state, action: PayloadAction<Note>) => {
        const index = state.notes.findIndex((note) => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      });
  
      builder.addCase(deleteNote.fulfilled, (state, action: PayloadAction<string>) => {
        state.notes = state.notes.filter((note) => note.id !== action.payload);
      });
    },
  });

export default noteSlice.reducer;