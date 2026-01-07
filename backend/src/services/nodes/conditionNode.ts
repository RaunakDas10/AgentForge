export async function conditionNode(node: any, context: any) {
  try {
    const condition = eval(node.condition || "true");
    return condition;
  } catch {
    return false;
  }
}
