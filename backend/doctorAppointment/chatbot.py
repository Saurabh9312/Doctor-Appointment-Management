import os
import json
import pickle
import time
from pathlib import Path
from typing import List, Tuple, Dict, Any

import numpy as np
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request

# Lazy import heavy deps to speed up Django startup when not used
from dotenv import load_dotenv
from collections import deque
import uuid
from typing import Optional


class RAGChatbot:
    """
    Retrieval-Augmented Generation chatbot for hospital-specific Q&A.

    - Loads/creates FAISS index from a hospital.txt knowledge file
    - Retrieves relevant chunks
    - Sends prompt to Groq LLM and returns an answer constrained to hospital domain
    """

    def __init__(self,
                 data_dir: Path,
                 knowledge_file: Path,
                 index_file: Path,
                 store_file: Path,
                 embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
                 top_k: int = 5):
        self.data_dir = data_dir
        self.knowledge_file = knowledge_file
        self.index_file = index_file
        self.store_file = store_file
        self.embedding_model_name = embedding_model_name
        self.top_k = top_k
        self._embedding_model = None
        self._faiss = None
        self._index = None
        self._doc_store: List[str] = []

        # Ensure data directory exists
        self.data_dir.mkdir(parents=True, exist_ok=True)

        # Load env
        backend_dir = Path(__file__).resolve().parents[1]
        env_path = backend_dir / ".env"
        if env_path.exists():
            load_dotenv(env_path)
        else:
            load_dotenv()  # fallback to default locations

        self.groq_api_key = os.getenv("GROQ_API_KEY", "").strip()
        if not self.groq_api_key:
            # Still allow running retrieval without generation for health check
            pass

        # Try load index, otherwise build
        if self.index_file.exists() and self.store_file.exists():
            try:
                self._load_index()
            except Exception as e:
                print(f"Failed to load existing index, rebuilding: {e}")
                self._build_index_from_knowledge()
        else:
            self._build_index_from_knowledge()

    # ------------------------ Embeddings & FAISS ------------------------
    def _ensure_embedding_model(self):
        if self._embedding_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._embedding_model = SentenceTransformer(self.embedding_model_name, trust_remote_code=True)
            except ImportError:
                raise ImportError(
                    "sentence-transformers is not installed. Please install it with: pip install sentence-transformers"
                )
            except Exception as e:
                # Handle memory issues or other loading errors
                raise RuntimeError(f"Failed to load embedding model '{self.embedding_model_name}': {str(e)}. This might be due to memory constraints in the deployment environment.")
        return self._embedding_model

    def _ensure_faiss(self):
        if self._faiss is None:
            import faiss  # type: ignore
            self._faiss = faiss
        return self._faiss

    def _embed(self, texts: List[str]) -> np.ndarray:
        model = self._ensure_embedding_model()
        embeddings = model.encode(texts, show_progress_bar=False, convert_to_numpy=True, normalize_embeddings=True)
        return np.array(embeddings).astype("float32")

    def _chunk_text(self, text: str, chunk_size: int = 700, overlap: int = 120) -> List[str]:
        words = text.split()
        chunks = []
        i = 0
        while i < len(words):
            chunk_words = words[i:i + chunk_size]
            chunks.append(" ".join(chunk_words))
            i += chunk_size - overlap
            if i <= 0:
                break
        # also ensure unique and non-empty
        return [c.strip() for c in chunks if c and c.strip()]

    def _build_index_from_knowledge(self):
        if not self.knowledge_file.exists():
            raise FileNotFoundError(
                f"Knowledge file not found: {self.knowledge_file}. Please add hospital.txt with the hospital information."
            )

        text = self.knowledge_file.read_text(encoding="utf-8")
        if not text.strip():
            raise ValueError(
                f"Knowledge file is empty: {self.knowledge_file}. Please add hospital information."
            )
        chunks = self._chunk_text(text)
        if not chunks:
            chunks = [text]

        vectors = self._embed(chunks)
        faiss = self._ensure_faiss()
        index = faiss.IndexFlatIP(vectors.shape[1])  # cosine via normalized vectors => inner product
        index.add(vectors)

        self._index = index
        self._doc_store = chunks

        # Persist
        faiss.write_index(index, str(self.index_file))
        with open(self.store_file, "wb") as f:
            pickle.dump(self._doc_store, f)

    def _load_index(self):
        faiss = self._ensure_faiss()
        self._index = faiss.read_index(str(self.index_file))
        with open(self.store_file, "rb") as f:
            self._doc_store = pickle.load(f)

    def retrieve(self, query: str, k: int = None) -> List[Tuple[str, float]]:
        if not query or not query.strip():
            return []
        if self._index is None:
            self._load_index()
        k = k or self.top_k
        try:
            qv = self._embed([query])
        except Exception as e:
            # Return empty results if embedding fails
            print(f"Embedding error: {e}")
            return []
        scores, idxs = self._index.search(qv, k)
        results = []
        for score, idx in zip(scores[0], idxs[0]):
            if 0 <= idx < len(self._doc_store):
                results.append((self._doc_store[idx], float(score)))
        return results

    # ------------------------ Generation ------------------------
    def generate(self, query: str, context_chunks: List[str], history: Optional[List[Dict[str, str]]] = None) -> str:
        if not self.groq_api_key:
            return (
                "The language model API key is not configured on the server. "
                "Please set GROQ_API_KEY in backend/.env."
            )

        try:
            from groq import Groq
        except Exception:
            return "Groq SDK is not installed on the server. Add 'groq' to requirements.txt and install."

        client = Groq(api_key=self.groq_api_key)
        system_prompt = (
            "You are a hospital information assistant for a single specific hospital."
            "\n- For factual questions about the hospital (services, hours, contacts, policies), rely ONLY on the provided 'Hospital knowledge base'."
            "\n- If the required hospital fact is not present in the knowledge base, say: 'I can only answer questions about this hospital based on available information.'"
            "\n- You may use the prior chat messages to maintain conversation context or to answer questions about the conversation itself (e.g., 'what was my first question?')."
            "\n- Keep answers concise and accurate."
        )
        context_text = "\n\n".join([f"- {c}" for c in context_chunks]) if context_chunks else "(No hospital knowledge provided.)"
        context_system = (
            "Hospital knowledge base (authoritative for hospital facts; do NOT invent facts beyond this):\n" + context_text
        )

        messages: List[Dict[str, str]] = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": context_system},
        ]
        if history:
            # Cap to last 12 messages for brevity
            hist = history[-12:]
            for m in hist:
                role = m.get("role")
                content = m.get("content")
                if role in ("user", "assistant") and isinstance(content, str):
                    messages.append({"role": role, "content": content})
        # Current user query last
        messages.append({"role": "user", "content": query})

        try:
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                temperature=0.2,
                max_tokens=512,
                top_p=0.9,
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            return f"Failed to generate answer: {e}"

    def answer(self, query: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        try:
            retrieved = self.retrieve(query)
            chunks = [c for c, _ in retrieved]
        except Exception as e:
            print(f"Retrieval error: {e}")
            chunks = []
        answer = self.generate(query, chunks, history=history)
        return {
            "response": answer,
            "context": chunks,
        }


# In-memory chat histories (per-session), bounded for short-term memory
_CHAT_HISTORY_LIMIT = 12
_chat_histories: Dict[str, Any] = {}

# Default session ID for when session management fails
DEFAULT_SESSION_ID = "default_session"

# Singleton chatbot instance
_data_dir = Path(__file__).resolve().parent / "data"
try:
    _chatbot = RAGChatbot(
        data_dir=_data_dir,
        knowledge_file=_data_dir / "hospital.txt",
        index_file=_data_dir / "faiss.index",
        store_file=_data_dir / "chunks.pkl",
    )
except Exception as e:
    print(f"Failed to initialize chatbot: {e}")
    _chatbot = None


class ChatbotAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        try:
            # Debug: Check if this is actually being called
            print(f"Chatbot POST endpoint called. Chatbot available: {_chatbot is not None}")
            
            body = request.data or {}
            query = body.get("query", "")
            session_id = body.get("session_id")
            reset = bool(body.get("reset", False))

            if not query or not isinstance(query, str):
                return JsonResponse({"error": "Field 'query' is required."}, status=400)

            if not session_id or not isinstance(session_id, str):
                try:
                    session_id = str(uuid.uuid4())
                except Exception:
                    # Fallback if UUID generation fails
                    session_id = f"session_{int(time.time())}"

            # Initialize or reset history
            history = _chat_histories.get(session_id)
            if reset or history is None:
                history = deque(maxlen=_CHAT_HISTORY_LIMIT)
                _chat_histories[session_id] = history

            # Prepare plain list for the model
            history_list = list(history)

            # Check if chatbot is available
            if _chatbot is None:
                result = {
                    "response": "Chatbot is not available. The model failed to initialize due to missing dependencies or memory constraints.",
                    "context": [],
                    "session_id": session_id
                }
            else:
                # Get answer with history-aware generation
                result = _chatbot.answer(query, history=history_list)
                # Append session_id to result
                result["session_id"] = session_id

            # Append this turn to history
            history.append({"role": "user", "content": query})
            history.append({"role": "assistant", "content": result.get("response", "")})
            _chat_histories[session_id] = history

            # Return session id so client can persist it
            print(f"Returning result: {result}")
            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in chatbot POST: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    def get(self, request: Request):
        # Simple health check
        is_ready = _chatbot is not None
        return JsonResponse({"status": "ok", "ready": is_ready}, status=200 if is_ready else 503)
