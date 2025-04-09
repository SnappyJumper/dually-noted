// src/components/TagSelector.js
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "axios";

const TagSelector = ({ selectedTags, setSelectedTags }) => {
  const [options, setOptions] = useState([]);

  // Fetch existing tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await axios.get("/tags/");
        const tagOptions = data.map(tag => ({
          label: tag.name,
          value: tag.id,
        }));
        setOptions(tagOptions);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    fetchTags();
  }, []);

  // Handle creation of a new tag
  const handleCreate = async (inputValue) => {
    try {
      const { data } = await axios.post("/tags/", { name: inputValue });
      const newOption = { label: data.name, value: data.id };
      setOptions(prev => [...prev, newOption]);
      setSelectedTags(prev => [...prev, newOption]);
    } catch (err) {
      console.error("Tag creation failed", err);
    }
  };

  const handleChange = (newValue) => {
    setSelectedTags(newValue);
  };

  return (
    <div className="my-3">
      <label><strong>Tags:</strong></label>
      <CreatableSelect
        isMulti
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={selectedTags}
      />
    </div>
  );
};

export default TagSelector;
