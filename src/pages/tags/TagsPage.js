// src/pages/tags/TagsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const TagsPage = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await axios.get("/tags/");
        setTags(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTags();
  }, []);

  return (
    <div>
      <h2>Tags</h2>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TagsPage;
