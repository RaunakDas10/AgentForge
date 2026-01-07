import axios from "axios";

export async function apiCallNode(node: any, context: any) {
  try {
    const res = await axios({
      method: node.method || "GET",
      url: node.url,
      data: node.body || {},
      headers: node.headers || {}
    });

    return {
      ...context,
      apiResult: res.data
    };
  } catch (err: any) {
    console.error("API Node Failed", err.message);
    return context;
  }
}
