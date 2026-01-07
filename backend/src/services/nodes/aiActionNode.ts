export async function aiActionNode(node: any, context: any) {
  console.log("AI Node Placeholder Running");
  return {
    ...context,
    aiResult: "AI output placeholder"
  };
}
