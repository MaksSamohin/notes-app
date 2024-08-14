import { Box, TextareaAutosize, Input, Paper, Button } from "@mui/material";
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

  const router = useRouter();
  const { id: noteIdFromUrl } = useParams();

  const wordWorkerRef = useRef<Worker | null>(null);
  const symbolsWorkerRef = useRef<Worker | null>(null);
  const topWordsWorkerRef = useRef<Worker | null>(null);

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

          onUpdateMetrics({
            wordCount: noteData.wordCount,
            symbolsCount: noteData.symbolsCount,
            topWords: noteData.topWords,
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

    topWordsWorkerRef.current.onmessage = (e: MessageEvent<number>) => {
      setTopWords(e.data);
      onUpdateMetrics((prevMetrics) => ({
        ...prevMetrics,
        topWords: e.data,
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
    };
  }, [onUpdateMetrics]);

  useEffect(() => {
    if (content && symbolsWorkerRef.current) {
      symbolsWorkerRef.current.postMessage(content);
    }
    if (content && topWordsWorkerRef.current) {
      topWordsWorkerRef.current.postMessage(content);
    }
  }, [content]);

  const handleSave = async () => {
    if (!title || !content) return;

    try {
      if (noteIdFromUrl) {
        const noteRef = doc(db, "notes", noteIdFromUrl as string);
        await updateDoc(noteRef, { title, content, wordCount, symbolsCount });
      } else {
        const docRef = await addDoc(collection(db, "notes"), {
          title,
          content,
          wordCount,
          symbolsCount,
          topWords,
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
  };

  return (
    <Paper className={styles.editableNote}>
      <Input
        className={styles.editableNoteTitle}
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <hr />
      <TextareaAutosize
        minRows="35"
        className={styles.editableNoteText}
        placeholder="Note Content"
        value={content}
        onChange={handleContentChange}
      />
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
