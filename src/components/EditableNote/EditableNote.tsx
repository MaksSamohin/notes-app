import {
  Box,
  TextareaAutosize,
  Input,
  Paper,
  Button,
  FormHelperText,
  Modal,
  Typography,
} from "@mui/material";
import styles from "./EditableNote.module.css";
import { useRouter, useParams } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { useState, useRef, useEffect } from "react";
import { fetchNoteByIdThunk, addNote, updateNote } from "@/store/noteSlice";
import { useAppDispatch } from "@/store/store";

interface EditableNoteProps {
  noteId?: string | null;
  onUpdateMetrics: (metrics: {
    wordCount: number;
    symbolsCount: number;
    topWords: string;
    tone: string;
  }) => void;
  isReadOnly?: boolean;
}

export default function EditableNote({
  noteId = null,
  onUpdateMetrics,
}: EditableNoteProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [symbolsCount, setSymbolsCount] = useState<number>(0);
  const [topWords, setTopWords] = useState<string>("");
  const [tone, setTone] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);

  function openModal() {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  const router = useRouter();
  const { id: noteIdFromUrl } = useParams();
  const noteIdTypized = Array.isArray(noteIdFromUrl)
    ? noteIdFromUrl[0]
    : noteIdFromUrl;
  // Creating refs for workers
  const wordWorkerRef = useRef<Worker | null>(null);
  const symbolsWorkerRef = useRef<Worker | null>(null);
  const topWordsWorkerRef = useRef<Worker | null>(null);
  const checkToneWorkerRef = useRef<Worker | null>(null);

  // Checking and setting info by ID of note

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (noteIdTypized) {
          // Если мы редактируем существующую заметку
          dispatch(
            fetchNoteByIdThunk({
              noteId: noteIdTypized,
              currentUid: user.uid,
              currentUserEmail: user.email,
            })
          )
            .unwrap()
            .then((note) => {
              if (note) {
                setTitle(note.title);
                setContent(note.content);
                setWordCount(note.wordCount);
                setSymbolsCount(note.symbolsCount);
                setTopWords(note.topWords);
                setTone(note.tone);
                setIsOwner(user.uid === note.uid); // Установка владельца для существующей заметки
                onUpdateMetrics({
                  wordCount: note.wordCount,
                  symbolsCount: note.symbolsCount,
                  topWords: note.topWords,
                  tone: note.tone,
                });
              } else {
                setModalMessage("Document doesn't exist or access denied.");
                openModal();
              }
            })
            .catch(() => {
              setModalMessage("An error occurred while fetching the note.");
              openModal();
            });
        } else {
          // Если создается новая заметка
          setIsOwner(true); // Установка владельца сразу, так как создаем новую заметку
        }
      } else {
        setModalMessage("Access was denied");
        openModal();
      }
    });

    return () => unsubscribe();
  }, [noteIdTypized, dispatch]);

  // Main workers logic
  useEffect(() => {
    wordWorkerRef.current = new Worker(
      new URL("@/workers/wordCountWorker.ts", import.meta.url),
      { type: "module" }
    );

    symbolsWorkerRef.current = new Worker(
      new URL("@/workers/symbolsCountWorker.ts", import.meta.url),
      { type: "module" }
    );
    topWordsWorkerRef.current = new Worker(
      new URL("@/workers/topWordsCountWorker.ts", import.meta.url),
      { type: "module" }
    );
    checkToneWorkerRef.current = new Worker(
      new URL("@/workers/checkToneWorker.ts", import.meta.url),
      { type: "module" }
    );

    wordWorkerRef.current.onmessage = (e: MessageEvent<number>) => {
      const newWordCount = e.data;
      setWordCount(newWordCount);
      onUpdateMetrics({
        wordCount: newWordCount,
        symbolsCount: symbolsCount,
        topWords: topWords,
        tone: tone,
      });
    };

    symbolsWorkerRef.current.onmessage = (e: MessageEvent<number>) => {
      const newSymbolsCount = e.data;
      setSymbolsCount(newSymbolsCount);
      onUpdateMetrics({
        wordCount: wordCount,
        symbolsCount: newSymbolsCount,
        topWords: topWords,
        tone: tone,
      });
    };

    topWordsWorkerRef.current.onmessage = (e: MessageEvent<string>) => {
      const newTopWords = e.data;
      setTopWords(newTopWords);
      onUpdateMetrics({
        wordCount: wordCount,
        symbolsCount: symbolsCount,
        topWords: newTopWords,
        tone: tone,
      });
    };

    checkToneWorkerRef.current.onmessage = (e: MessageEvent<string>) => {
      const newTone = e.data;
      setTone(newTone);
      onUpdateMetrics({
        wordCount: wordCount,
        symbolsCount: symbolsCount,
        topWords: topWords,
        tone: newTone,
      });
    };

    return () => {
      if (wordWorkerRef.current) {
        wordWorkerRef.current.terminate();
      }
      if (symbolsWorkerRef.current) {
        symbolsWorkerRef.current.terminate();
      }
      if (topWordsWorkerRef.current) {
        topWordsWorkerRef.current.terminate();
      }
      if (checkToneWorkerRef.current) {
        checkToneWorkerRef.current.terminate();
      }
    };
  }, [onUpdateMetrics]);

  // Worker's content display while changing content
  useEffect(() => {
    if (content && symbolsWorkerRef.current) {
      symbolsWorkerRef.current.postMessage(content);
    }
    if (content && topWordsWorkerRef.current) {
      topWordsWorkerRef.current.postMessage(content);
    }
    if (content && checkToneWorkerRef.current) {
      checkToneWorkerRef.current.postMessage(content);
    }
  }, [content]);

  // Save button logic
  const handleSave = async () => {
    if (!isSaved) {
      setIsSaved(true);
      let hasError = false;
      if (!title) {
        setTitleError("Please set the title");
        hasError = true;
      } else {
        setTitleError(null);
      }
      if (!content) {
        setContentError("Please set the content");
        hasError = true;
      } else {
        setContentError(null);
      }

      if (hasError) {
        return;
      }
      // Updating or creating notes collection
      try {
        const user = auth.currentUser;

        if (!user) {
          setModalMessage("Document doesn't exist or access denied.");
          openModal();
          return;
        }
        const uid = user.uid;

        if (noteIdTypized) {
          await dispatch(
            updateNote({
              id: noteIdTypized,
              title,
              content,
              wordCount,
              symbolsCount,
              topWords,
              tone,
              uid,
              createdAt: new Date().toString(),
              sharedWith: [],
            })
          ).unwrap();
        } else {
          await dispatch(
            addNote({
              title,
              content,
              wordCount,
              symbolsCount,
              topWords,
              tone,
              uid,
              createdAt: new Date().toString(),
              sharedWith: [],
            })
          ).unwrap();
        }
        router.push("/");
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  // Reset all note fields
  const handleReset = () => {
    setTitle("");
    setContent("");
  };

  // Worker's process while changing content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    if (wordWorkerRef.current) {
      wordWorkerRef.current.postMessage(e.target.value);
    }
    if (symbolsWorkerRef.current) {
      symbolsWorkerRef.current.postMessage(e.target.value);
    }
    if (topWordsWorkerRef.current) {
      topWordsWorkerRef.current.postMessage(e.target.value);
    }
    if (checkToneWorkerRef.current) {
      checkToneWorkerRef.current.postMessage(e.target.value);
    }
  };

  return (
    <>
      <Paper className={styles.editableNote}>
        <Input
          className={styles.editableNoteTitle}
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!titleError}
          readOnly={!isOwner}
        />
        {titleError && <FormHelperText error>{titleError}</FormHelperText>}
        <hr />
        <TextareaAutosize
          minRows={35}
          className={styles.editableNoteText}
          placeholder="Note Content"
          value={content}
          onChange={handleContentChange}
          readOnly={!isOwner}
        />
        {contentError && <FormHelperText error>{contentError}</FormHelperText>}
        {isOwner && (
          <Box className={styles.editableNoteButtons}>
            <Button onClick={handleSave} className={styles.editableNoteSave}>
              Save
            </Button>
            <Button onClick={handleReset} className={styles.editableNoteReset}>
              Reset
            </Button>
          </Box>
        )}
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={styles.errorModal}>
          <Typography>{modalMessage}</Typography>
        </Box>
      </Modal>
    </>
  );
}
