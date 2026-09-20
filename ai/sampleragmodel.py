from typing import Optional,TypedDict,Sequence,Annotated
from langgraph.graph import START,END,StateGraph
import os
from operator import add as add_messages
from langchain_core.messages import BaseMessage,AIMessage,ToolMessage,SystemMessage,HumanMessage
from google.colab import userdata
from langchain_community.document_loaders import PyPDFLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.tools import tool

GOOGLE_API_KEY = userdata.get('GEMINI_API_KEY')

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature = 0.5,
    google_api_key=GOOGLE_API_KEY
)

embeddings= GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001", # Changed model name to embedding-001
    google_api_key=GOOGLE_API_KEY
)

path = "test.pdf"

pdfloader = PyPDFLoader(path)

pages = [] # Initialize pages to an empty list
try:
  pages = pdfloader.load()
  print("The PDF is Loaded Successfully")
except Exception as e:
  print(f"The pdf Failed to load check the documentation. Error: {e}")

textsplitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100
)

pages_split = textsplitter.split_documents(pages)

persist_directory = "./chroma_db"
collection_name = "stock_market_performance"


if not os.path.exists(persist_directory):
  os.makedirs(persist_directory)

vectordb = None # Initialize vectordb to None
try:
  vectordb = Chroma.from_documents(
      documents=pages_split,
      embedding=embeddings,
      persist_directory=persist_directory,
      collection_name=collection_name
    )
except Exception as e:
  print(f"The exception is {e}")

# Only proceed if vectordb was successfully created
if vectordb:
  retriever = vectordb.as_retriever(
      search_type="similarity",
      search_kwargs={"k":5}
  )
else:
  print("Vector database could not be initialized, retriever will not be available.")
  retriever = None # Ensure retriever is also None if vectordb failed

@tool # Add the tool decorator here
def retriever_tool(query:str) -> str:
  """
     This is the tool returns the relavent document information on this
  """
  if not retriever:
    return 'Retriever is not available because the vector database could not be initialized.'

  docs = retriever.invoke(query)

  if not docs:
    return 'No similar document based on the data is not found'

  results = []

  for i,doc in enumerate(docs):
    results.append(f"Documents {i+1}: {doc.page_content}")

  return "\n\n".join(results)

tools = [retriever_tool]

llm = llm.bind_tools(tools=tools)

class AgentState(TypedDict):
  messages : Annotated[Sequence[BaseMessage],add_messages]

def should_continue(state:AgentState):
  result = state["messages"][-1]
  return hasattr(result,'tool_calls') and len(result.tool_calls) > 0

system_prompt = """
You are an intelligent AI assistant who answers questions about Stock Market Performance in 2024 based on the PDF document loaded into your knowledge base.
Use the retriever tool available to answer questions about the stock market performance data. You can make multiple calls if needed.
If you need to look up some information before asking a follow up question, you are allowed to do that!
Please always cite the specific parts of the documents you use in your answers.
"""

tools_dict = {our_tool.name:our_tool for our_tool in tools}

def call_llm (state):
  messages = list(state['messages'])
  messages = [SystemMessage(content=system_prompt)] + messages
  message = llm.invoke(messages)
  return {"messages":[message]}

def take_action(state):

  tool_calls = state["messages"][-1].tool_calls
  result = []
  for t in tool_calls:
    print(f"Calling tool {t['name']} with query {t['args'].get('query','No query provided')}")

    if not t['name'] in tools_dict:
      print(f"{t['name']} does not exist")
      res = "Incorrect Tool Name,Please Retry and Select tool from List of Available tools"

    else:
      # Corrected: Invoke the StructuredTool object
      res = tools_dict[t['name']].invoke(t['args']['query'])

    result.append(ToolMessage(tool_call_id=t['id'],content=res))

  return {"messages":result}

import re

def clean_llm_response(raw_text):
    # Strip leading/trailing whitespaces and newlines
    # cleaned = raw_text.strip()

    # # Remove markdown code block wrappers (e.g., ```text ... ```) if the LLM forced them
    # cleaned = re.sub(r'^```[a-zA-Z]*\n', '', cleaned)
    # cleaned = re.sub(r'\n```$', '', cleaned)

    return raw_text



from langgraph.graph import StateGraph,END
  # HumanMessage is already imported at the top of the cell

graph = StateGraph(AgentState)
graph.add_node('llm',call_llm)
graph.add_node("retriever_agent",take_action)

graph.add_conditional_edges(
      'llm',
      should_continue,
      {True:"retriever_agent",False:END}
)

graph.add_edge("retriever_agent","llm")
graph.set_entry_point("llm")

rag_agent = graph.compile()


def rag():
  while True:
    user_input = input("Enter the question: ")
    if user_input.lower() in ['quit','exit']:
      break

    messages = [HumanMessage(content=user_input)]

    res = rag_agent.invoke({"messages":messages})
    print(clean_llm_response(res["messages"][-1].content))

rag()