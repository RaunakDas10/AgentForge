import os
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.youtube_tools import YouTubeTools

def create_agent():
    """
    Creates an Agno (Phidata) agent powered by Google Gemini.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in environment variables")

    # Initialize the Agent
    agent = Agent(
        model=Gemini(id="models/gemini-1.5-flash", api_key=api_key),
        tools=[YouTubeTools()],
        show_tool_calls=True,
        description="You are a helpful AI assistant.",
        markdown=True
    )
    return agent

def run_agent(agent, prompt):
    """
    Runs the agent with the given prompt and returns the response.
    """
    try:
        response = agent.run(prompt)
        return response.content
    except Exception as e:
        return f"Agent execution failed: {str(e)}"
