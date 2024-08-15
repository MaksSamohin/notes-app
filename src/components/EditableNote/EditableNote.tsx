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

  function openModal() {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  const router = useRouter();
  const { id: noteIdFromUrl } = useParams();

  // Creating refs for workers
  const wordWorkerRef = useRef<Worker | null>(null);
  const symbolsWorkerRef = useRef<Worker | null>(null);
  const topWordsWorkerRef = useRef<Worker | null>(null);
  const checkToneWorkerRef = useRef<Worker | null>(null);

  // Checking and setting info by ID of note

  useEffect(() => {
    if (noteIdFromUrl && typeof noteIdFromUrl === "string") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          dispatch(
            fetchNoteByIdThunk({ noteId: noteIdFromUrl, currentUid: user.uid })
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
          setModalMessage("Access was denied");
          openModal();
        }
      });

      return () => unsubscribe();
    }
  }, [noteIdFromUrl, dispatch]);

  // Main workers logic
  useEffect(() => {
    const wordWorker = new Worker(
      new URL("@/workers/wordCountWorker.ts", import.meta.url),
      { type: "module" }
    );
    const symbolsWorker = new Worker(
      new URL("@/workers/symbolsCountWorker.ts", import.meta.url),
      { type: "module" }
    );
    const topWordsWorker = new Worker(
      new URL("@/workers/topWordsCountWorker.ts", import.meta.url),
      { type: "module" }
    );
    const checkToneWorker = new Worker(
      new URL("@/workers/checkToneWorker.ts", import.meta.url),
      { type: "module" }
    );

    wordWorker.onmessage = (e: MessageEvent<number>) => {
      setWordCount(e.data);
      onUpdateMetrics((prevMetrics) => ({ ...prevMetrics, wordCount: e.data }));
    };

    symbolsWorker.onmessage = (e: MessageEvent<number>) => {
      setSymbolsCount(e.data);
      onUpdateMetrics((prevMetrics) => ({
        ...prevMetrics,
        symbolsCount: e.data,
      }));
    };

    topWordsWorker.onmessage = (e: MessageEvent<string>) => {
      setTopWords(e.data);
      onUpdateMetrics((prevMetrics) => ({ ...prevMetrics, topWords: e.data }));
    };

    checkToneWorker.onmessage = (e: MessageEvent<string>) => {
      setTone(e.data);
      onUpdateMetrics((prevMetrics) => ({ ...prevMetrics, tone: e.data }));
    };

    return () => {
      wordWorker.terminate();
      symbolsWorker.terminate();
      topWordsWorker.terminate();
      checkToneWorker.terminate();
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

      setIsSaved(true);

      // Updating or creating notes collection
      try {
        const user = auth.currentUser;

        if (!user) {
          setModalMessage("Document doesn't exist or access denied.");
          openModal();
          return;
        }
        const uid = user.uid;

        if (noteIdFromUrl) {
          await dispatch(
            updateNote({
              id: noteIdFromUrl,
              title,
              content,
              wordCount,
              symbolsCount,
              topWords,
              tone,
              uid,
              createdAt: new Date(),
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
              createdAt: new Date(),
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
        />
        {titleError && <FormHelperText error>{titleError}</FormHelperText>}
        <hr />
        <TextareaAutosize
          minRows={35}
          className={styles.editableNoteText}
          placeholder="Note Content"
          value={content}
          onChange={handleContentChange}
        />
        {contentError && <FormHelperText error>{contentError}</FormHelperText>}
        <Box className={styles.editableNoteButtons}>
          <Button onClick={handleSave} className={styles.editableNoteSave}>
            Save
          </Button>
          <Button onClick={handleReset} className={styles.editableNoteReset}>
            Reset
          </Button>
        </Box>
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
