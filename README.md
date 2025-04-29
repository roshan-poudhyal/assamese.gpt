<h1 align="center">🌐 Assamese.GPT - AI Translator and Chatbot for Assamese Language</h1>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/roshan-poudhyal/assamese.gpt?color=blue&style=flat-square" />
  <img src="https://img.shields.io/github/repo-size/roshan-poudhyal/assamese.gpt?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/roshan-poudhyal/assamese.gpt?style=flat-square" />
  <img src="https://img.shields.io/github/issues/roshan-poudhyal/assamese.gpt?style=flat-square" />
</p>

<p align="center">
  <img src="https://github.com/roshan-poudhyal/assamese.gpt/assets/assamese-gpt-banner.gif" alt="Assamese GPT" height="300"/>
</p>

---

## 🧠 About the Project

**Assamese.GPT** is an open-source project aimed at bridging the language barrier by creating an **AI-based Assamese language translator and chatbot**.

It helps in:
- Translating English (or Hindi, etc.) text into **Assamese**.
- Allowing users to **chat directly in Assamese**.
- Preserving linguistic diversity through AI and natural language processing.

This project brings **Large Language Model (LLM)** capabilities to the Assamese community in an accessible and scalable way.

---

## 🌟 Features

- 🌎 Translate English/Hindi/Other languages into **Assamese**.
- 💬 Conversational AI chatbot in Assamese.
- 🤖 Fine-tuned models for better regional dialect understanding.
- ⚡ Fast, lightweight, and scalable APIs.
- 🛠️ Easy integration into websites, apps, and educational platforms.
- 📚 Promotes Assamese language usage in AI applications.

---

## 🧰 Tech Stack

| Category         | Tools / Libraries Used                      |
|------------------|----------------------------------------------|
| 🧠 AI/ML         | Hugging Face Transformers, SentencePiece, Tokenizers |
| 🐍 Backend       | Python (FastAPI / Flask API)                 |
| 📦 Deployment    | GitHub, Hugging Face Spaces                  |
| 🔠 Language Models | mBERT, XLM-Roberta, T5, or fine-tuned GPT models |
| 📂 Preprocessing | Byte Pair Encoding (BPE), WordPiece          |

---

## 📈 How it Works

1. 🔤 **Input text** in any language (e.g., English or Hindi).
2. 🔄 **Tokenizer** breaks the sentence into manageable subwords.
3. 🧠 **Model inference** predicts the Assamese translation or chatbot response.
4. 🖼 **Output** in Assamese script (`অসমীয়া`).

---

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/roshan-poudhyal/assamese.gpt.git
cd assamese.gpt

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server (example)
uvicorn app:app --reload



assamese.gpt/
│
├── app.py                      # FastAPI or Flask app
├── tokenizer/                  # Tokenization scripts and configs
│   ├── sentencepiece_model.model
│   └── bpe_vocab.txt
│
├── models/                     # Fine-tuned AI models (e.g., TFLite, PyTorch)
│   ├── assamese_translation_model.pt
│   └── assamese_chatbot_model.pt
│
├── utils/                      # Helper scripts for preprocessing, inference
├── requirements.txt
└── README.md
