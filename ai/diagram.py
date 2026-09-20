"""
    This is code for pictorial representation of
    RAG agents in the system

"""

from IPython.display import Image,display 
from ai import draw_rag
from pathlib import Path

output = Path(__file__).parent/"diagram.png"

def generate_img():
    d = draw_rag()

    data = d.get_graph().draw_mermaid_png()

    output.write_bytes(data)
    print("The Image of RAG Flow is Generated")

if __name__ == "__main__":
    generate_img()
 
