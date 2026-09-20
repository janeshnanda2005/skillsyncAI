from typing import TypedDict, Sequence, Annotated
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_openrouter import ChatOpenRouter
from tqdm import tqdm
from operator import add as add_messages
from langgraph.graph import START, END, StateGraph
from langchain.tools import tool
from dotenv import load_dotenv
import os

try:
    from ai.docloader import retriever
except ImportError:
    try:
        from docloader import retriever
    except ImportError:
        retriever = None

load_dotenv()

api = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

llm = None
api = None


if not api:
    print("GEMINI_API_KEY is missing. The AI agent will not initialize until the environment variable is set.")
    fallback_model = ChatOpenRouter(
        model="nvidia/nemotron-3-ultra-550b-a55b:free",
        temperature=0.5
    )
else:
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        temperature=0.5,
        google_api_key=api,
    )


@tool 
def retriever_tool(query:str) -> str:
    """
    Search the Resume and give an relavant information

    """
    if not retriever:
        return "The retriever is not available"
    
    docs = retriever.invoke(query)

    if not docs:
        return 'No similar documents are found'
    
    results = []

    for i,doc in enumerate(docs):
        results.append(f"Documents {i+1}: {doc.page_content}")
    
    return "\n\n".join(results)

tools = [retriever_tool]

if llm is not None:
    llm = llm.bind_tools(tools=tools)
else:
    fallback_model = fallback_model.bind_tools(tools=tools)

class AgentState(TypedDict):
    messages : Annotated[Sequence[BaseMessage],add_messages]

def should_continue(state:AgentState):
    result = state["messages"][-1]
    return hasattr(result,'tool_calls') and len(result.tool_calls) > 0

system_prompt = """

You are an intelligent AI assistant who answers questions about Resume having important based on the PDF document loaded into your knowledge base.
Use the retriever tool available to answer questions about the data which is present in the document. You can make multiple calls if needed.
If you need to look up some information before asking a follow up question, you are allowed to do that!
Please always cite the specific parts of the documents you use in your answers.

"""
tool_dict = {our_tool.name : our_tool for our_tool in tools}

def call_llm(state):
    if llm is None:
        messages = list(state['messages'])
        messages = [SystemMessage(content=system_prompt)] + messages
        response = fallback_model.invoke(messages)
        return {"messages":[response]}

    messages = list(state['messages'])
    messages = [SystemMessage(content=system_prompt)] + messages
    response = llm.invoke(messages)
    return {"messages":[response]}

def take_action(state):
    tool_calls = state["messages"][-1].tool_calls
    result = []
    for t in tqdm(tool_calls):
        print(f"Calling tool {t['name']} with query {t['args'].get('query','No query provided')}")

        if not t['name'] in tool_dict:
            print(f"{t['name']} does not exist")
            res = "Incorrect Tool Name,Please Retry and Select tool from List of Available tools"
        
        else:
            res = tool_dict[t['name']].invoke(t['args']['query'])
        result.append(ToolMessage(tool_call_id=t['id'],content=res))
    
    return {"messages":result}


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
        user_input = input("Enter the Question: ")
        if user_input.lower() in ['quit', 'exit']:
            break
        messages = [HumanMessage(content=user_input)]
        res = rag_agent.invoke({"messages": messages})
        data = res["messages"][-1].content
        
        if isinstance(data,list):
            for item in data:
                if isinstance(item,dict) and "text" in item:
                    print(item['text'])
        else:
            print(data)


if __name__ == "__main__":
    rag()