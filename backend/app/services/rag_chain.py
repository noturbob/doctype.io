from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from app.services.redis_store import get_retriever
from app.config import settings

async def generate_answer(question: str):
    # 1. Setup Gemini (free tier model)
    # We use temperature=0 for factual answers from the doc
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0
    )

    # 2. Setup the Instructions
    prompt = ChatPromptTemplate.from_template("""
    Answer the user's question based ONLY on the following context. 
    If the answer is not in the context, say "I don't know based on this document."
    
    <context>
    {context}
    </context>
    
    Question: {input}
    """)

    # 3. Create the Document Chain
    # This chain takes the retrieved docs and "stuffs" them into the context variable
    document_chain = create_stuff_documents_chain(llm, prompt)
    
    # 4. Create the Retrieval Chain
    # This chain connects the Retriever (Redis) to the Document Chain (Gemini)
    retriever = get_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    # 5. Run it
    response = await retrieval_chain.ainvoke({"input": question})
    
    return response["answer"]