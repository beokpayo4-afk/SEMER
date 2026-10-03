import axios from "axios";

function validationMessage(detail: unknown) {
  if (!Array.isArray(detail)) {
    return "";
  }
  const messages = detail.flatMap((item) => {
    if (!item || typeof item !== "object" || !("msg" in item) || typeof item.msg !== "string") {
      return [];
    }
    const loc =
      "loc" in item && Array.isArray(item.loc)
        ? item.loc.filter((part: unknown) => part !== "body").join(" ")
        : "";
    const text = item.msg.replace(/^Value error,\s*/i, "");
    return [loc ? `${loc}: ${text}` : text];
  });
  return messages.join(" ");
}

export function apiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }
  if (!error.response) {
    return "The server could not be reached. Check that the API is running, then try again.";
  }
  const detail = error.response.data?.detail;
  if (typeof detail === "string") {
    return detail;
  }
  return validationMessage(detail) || fallback;
}
