import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (formData) {
      GenrateQuestionList();
    }
  }, [formData]);
  const GenrateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/api-model", {
        ...formData,
      });
      console.log(result.data);
    } catch (e) {
      toast("Server Error, Try Again!");
      setLoading(false);
    }
  };

  return <div>QuestionList</div>;
}

export default QuestionList;
//2:08:00
