import {
  Box,
  TextareaAutosize,
  Input,
  Paper,
  Button,
  FormHelperText,
} from "@mui/material";
import styles from "./EditableNote.module.css";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/firebaseConfig";
import { addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";

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
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [symbolsCount, setSymbolsCount] = useState<number>(0);
  const [topWords, setTopWords] = useState<string>("");
  const [tone, setTone] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const router = useRouter();
  const { id: noteIdFromUrl } = useParams();

  const wordWorkerRef = useRef<Worker | null>(null);
  const symbolsWorkerRef = useRef<Worker | null>(null);
  const topWordsWorkerRef = useRef<Worker | null>(null);
  const checkToneWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (noteIdFromUrl) {
      const fetchNote = async () => {
        const docRef = doc(db, "notes", noteIdFromUrl as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const noteData = docSnap.data();
          setTitle(noteData.title);
          setContent(noteData.content);
          setWordCount(noteData.wordCount);
          setSymbolsCount(noteData.symbolsCount);
          setTopWords(noteData.topWords);
          setTone(noteData.tone);

          onUpdateMetrics({
            wordCount: noteData.wordCount,
            symbolsCount: noteData.symbolsCount,
            topWords: noteData.topWords,
            tone: noteData.tone,
          });
        } else {
          console.log("No such document!");
        }
      };
      fetchNote();
    }
  }, [noteIdFromUrl]);

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
      setWordCount(e.data);
      onUpdateMetrics((prevMetrics) => ({
        ...prevMetrics,
        wordCount: e.data,
      }));
    };

    symbolsWorkerRef.current.onmessage = (e: MessageEvent<number>) => {
      setSymbolsCount(e.data);
      onUpdateMetrics((prevMetrics) => ({
        ...prevMetrics,
        symbolsCount: e.data,
      }));
    };

    topWordsWorkerRef.current.onmessage = (e: MessageEvent<string>) => {
      setTopWords(e.data);
      onUpdateMetrics((prevMetrics) => ({
        ...prevMetrics,
        topWords: e.data,
      }));
    };
    checkToneWorkerRef.current.onmessage = (e: MessageEvent<string>) => {
      setTone(e.data);
      onUpdateMetrics((prevMetrics) => ({
        ...prevMetrics,
        tone: e.data,
      }));
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

  useEffect(() => {
    if (content && topWordsWorkerRef.current) {
      topWordsWorkerRef.current.postMessage(content);
    }
    if (content && topWordsWorkerRef.current) {
      topWordsWorkerRef.current.postMessage(content);
    }
    if (content && checkToneWorkerRef.current) {
      checkToneWorkerRef.current.postMessage(content);
    }
  }, [content]);

  const handleSave = async () => {
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

    try {
      if (noteIdFromUrl) {
        const noteRef = doc(db, "notes", noteIdFromUrl);
        await updateDoc(noteRef, {
          title,
          content,
          wordCount,
          symbolsCount,
          topWords,
          tone,
        });
      } else {
        await addDoc(collection(db, "notes"), {
          title,
          content,
          wordCount,
          symbolsCount,
          topWords,
          tone,
          createdAt: new Date(),
        });
      }
      router.push("/");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
  };

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
        minRows="35"
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
  );
}
